# LLM Build Guide: HubSpot Connector (TypeScript, v3)

Purpose: Build the HubSpot connector and help users add more HubSpot objects using the same architecture.

## Success criteria
- Same public API and directory layout as this connector
- Strong types end‑to‑end; streaming methods named `stream<Domain>s`
- First‑class only for new objects (no dynamic string helpers)
- Jest tests runnable; optional integration test gated by env token

## Core principles
- Thin typed domains per object; shared CRUD + cursor pagination
- Single transport path: `request` with retries, rate‑limit, hooks
- Cursor pagination = HubSpot defaults: `results[]` + `paging.next.after`
- Bearer token auth (Private App Token) for MVP

## Public API surface
- Lifecycle: `initialize`, `connect`, `disconnect`, `isConnected`
- Primitives: `request`, `paginate<T>`
- Domains (methods on connector):
  - Contacts/Companies/Deals/Tickets: `list*`, `get*`, `stream*`, `get*` (plural for list/stream/getAll; singular for get)
  - Engagements: same, but each method requires `{ objectType: "notes"|"calls"|"emails"|"meetings"|"tasks" }`

## Project layout to create
```
connectors/hubspot/v3/fiveonefour/typescript/
  docs/
  jest.config.cjs
  jest.integration.cjs
  package.json
  src/
    client/
      http-client.ts
      middleware/
        hook-middleware.ts
    config/
      defaults.ts
    core/
      make-crud-domain.ts
      paginate.ts
    domains/
      contacts.ts
      companies.ts
      deals.ts
      ...
    index.ts
    models/
      shared/
        base.ts
        api-params.ts
        index.ts
      contacts/
        contact.ts
        contact-api-contracts.ts
        index.ts
      companies/
        company.ts
        company-api-contracts.ts
        index.ts
      deals/
        deal.ts
        deal-api-contracts.ts
        index.ts
      ...
      index.ts
    rate-limit/
      token-bucket.ts
    types/
      config.ts
      connector.ts
      envelopes.ts
  tests/
    unit/*.test.ts
    integration/hooks.test.ts
```

## Responsibilities
- `src/index.ts`: lifecycle; init HTTP/auth/limiter; `request`; `paginate<T>`; delegates to domains; exposes public methods
- `src/core/paginate.ts`: `paginateCursor<T>` (extract items from `data.results`, next from `data.paging.next.after`)
- `src/core/make-crud-domain.ts`: build `{ list, get, streamAll, getAll }` for a given object path using paginator
- `src/domains/*`: bind HubSpot paths to CRUD; import types from `src/models/*`
- `src/models/*`: strong types for `properties` and API contracts; base shapes in `models/shared/*`
- `src/types/*`: config, connector surface, response envelope
- `rate-limit/token-bucket.ts`: token bucket if RPS configured

## Transport and config
- `HttpClient` returns `HttpResponseEnvelope<T> = { data, status, headers, meta }`
- Auth: apply Bearer token; set `Accept: application/json`; avoid `Content-Type` on GET
- Retry: bounded attempts; exponential backoff + jitter; honor `Retry-After`; retry budget
- Rate limit: wait for slot before request when `requestsPerSecond > 0`

## Hooks

- Where:
  - Types: `src/types/hooks.ts` defines `HookType`, `Hook`, `HookContext`
  - Pipeline: `src/client/middleware/hook-middleware.ts` exposes `applyHookPipeline`
  - Usage: `src/client/http-client.ts` constructs the pipeline per request and invokes phases

- Phases (ordered by `priority`, ascending within each phase):
  - `beforeRequest` → mutate request or abort
  - `afterResponse` → transform/validate envelope
  - `onError` → enrich/map errors
  - `onRetry` → observe retry attempts (called before backoff sleep)

- Context methods provided to hooks:
  - `modifyRequest(updates)` to shallow-merge request fields
  - `modifyResponse(updates)` to shallow-merge response envelope
  - `abort(reason?)` to cancel the request with a user-defined reason

- Configuration:
  - `ConnectorConfig.hooks` accepts arrays per phase: `{ beforeRequest?: Hook[]; afterResponse?: Hook[]; onError?: Hook[]; onRetry?: Hook[] }`

Minimal example (response shaping):

```ts
// In user config, attach an afterResponse hook to flatten items
const hooks = {
  afterResponse: [{
    name: "flatten-items",
    priority: 1,
    execute(ctx) {
      if (ctx.type !== "afterResponse" || !ctx.response) return;
      const results = Array.isArray(ctx.response.data?.results) ? ctx.response.data.results : [];
      const items = results.map((r: any) => ({ id: r.id, ...r.properties }));
      ctx.modifyResponse?.({ data: { items } });
    },
  }],
};

connector.initialize({ auth: { type: "bearer", bearer: { token } }, hooks });
```

Implementation notes:
- The pipeline is created in `HttpClient.request` with `applyHookPipeline` and invoked in order: `beforeRequest` → HTTP → `afterResponse` (or `onError`), with `onRetry` between attempts.
- Hooks must be side-effect safe and fast; avoid blocking operations in `beforeRequest`.
- Prefer response shaping in `afterResponse` rather than baking transforms into domains.

## Operational details

- Response envelope:
  - Always return `{ data, status, headers, meta }` where `meta = { timestamp, durationMs, requestId?, retryCount?, rateLimit? }`.
  - Parse rate‑limit headers into `meta.rateLimit`: `x-hubspot-ratelimit-*(limit/remaining)`, `x-hubspot-ratelimit-reset`, and `retry-after` (seconds).

- Errors:
  - Throw `ConnectorError { message, code, statusCode?, retryable?, details?, requestId?, source }`.
  - Retryable by default: 408, 425, 429, 5xx and transient network failures; map timeouts to `TIMEOUT`, transport to `NETWORK_ERROR`, parsing to `PARSING_ERROR`.

- Pagination:
  - `paginateCursor<T>` defaults: items from `data.results`, next cursor from `data.paging.next.after`, `limit` param, `pageSize` default 100.
  - Accept `extractItems` and `extractNextCursor` overrides for non‑standard endpoints.

- Rate limiting:
  - Token bucket `waitForSlot()` before request when `requestsPerSecond > 0`.
  - Bucket uses `capacity` and `refillPerSec`; simple 50ms polling when empty.

- Derived defaults (`withDerivedDefaults`):
  - Base URL, timeout, `userAgent`, `Accept: application/json` header.
  - Retry defaults (attempts, backoff/jitter, budget, respect `Retry‑After`).
  - Conservative rate‑limit defaults; merge user overrides.

- Parameter conventions:
  - `properties?: string[]` joined as CSV in list/get.
  - List params support `limit` and `after`.
  - Engagement methods require `objectType` in a strict union: `"notes"|"calls"|"emails"|"meetings"|"tasks"`.

- Streaming and bulk helpers:
  - `streamAll` yields items across pages (memory‑safe).
  - `getAll` collects items with optional `maxItems` cap to avoid unbounded growth.

- Request details:
  - Do not set `Content-Type` on GET by default; always set `Accept: application/json`.
  - Include `userAgent` from config in outbound requests when applicable.

## Agent coding rules
- Keep domains thin; all path strings live in domain files only
- Models extend `HubSpotObject`; `properties` typed per domain plus index signature for unknowns
- Expose streaming as `stream<Domain>s`
- Match error/envelope shapes and param names exactly
- Do not introduce dynamic helpers in the public API (first‑class only for new objects)
- Avoid `any` in exported surfaces; annotate function signatures and generics explicitly
- Do not set `Content-Type` on GET; always set `Accept: application/json`; include `userAgent` from config
- Always throw `ConnectorError` (never raw errors); set `source` appropriately
- Join `properties?: string[]` as CSV without spaces; pass `limit`/`after` as received
- Call rate limiter `waitForSlot()` before transport when configured; never bypass
- Use `paginateCursor` for collection; prefer `streamAll` over `getAll` for large datasets
- Keep hooks fast and side‑effect safe; avoid I/O in `beforeRequest`; use `afterResponse` for transforms
- Keep all object path strings in `src/domains/*` only; core and models must not embed paths
- Ensure re‑exports: add `index.ts` in each model folder and update `src/models/index.ts`
- Maintain naming consistency: singular for `get<Domain>`, plural for `list/stream/getAll`
- Tests: write Jest unit tests for list/get and pagination; integration tests gated by env token

## Add a new HubSpot object (first‑class only)
Build order: Models → Domain → Connector methods → Tests.
1. Models: create `src/models/<object>/`
   - `<object>.ts`: `<Object>Properties`, `<Object>` extends `HubSpotObject`
   - `<object>-api-contracts.ts`: `type <Objects>Response = HubSpotListResponse<<Object>>;` and `type <Object>Response = HubSpotSingleResponse<<Object>>;`
   - `index.ts`: re‑export
   - Add `export * from "./<object>"` to `src/models/index.ts`
2. Domain: `src/domains/<object>.ts`
   - `makeCrudDomain<<Object>, <Objects>Response, <Object>Response>("/crm/v3/objects/<objectType>", send)`
   - Return `{ list<Object>s, get<Object>, stream<Object>s, get<Object>s }`
3. Connector surface: `src/index.ts`
   - Spread your domain into `domain` getter
   - Add public methods delegating to the domain
4. Tests: unit tests for list/get + pagination behavior; keep integration test gated by token

Notes
- Custom objects use `/crm/v3/objects/{objectType}` and the same pagination shape
- Prefer selective `properties?: string[]` to minimize payloads

## Minimal example (domain)
```ts
// src/domains/things.ts
import type { SendFn } from "../core/paginate";
import { makeCrudDomain } from "../core/make-crud-domain";
import type { Thing, ThingsResponse, ThingResponse } from "../models/things";

export function buildThingsDomain(send: SendFn) {
  const base = makeCrudDomain<Thing, ThingsResponse, ThingResponse>("/crm/v3/objects/things", send);
  return {
    listThings: base.list,
    getThing: base.get,
    streamThings: base.streamAll,
    getThings: base.getAll,
  };
}
```

## Testing
- Jest runner; unit fast with HTTP mocking
- Split configs: `jest.config.cjs` for unit; `jest.integration.cjs` for integration
- Gate live tests with env (e.g., `HUBSPOT_TOKEN`)

## Out of scope in v3
- OAuth2, adaptive rate‑limit, circuit breaker, schema validation, dynamic helpers

## Final checklist
- [ ] Layout created
- [ ] Public API methods present and delegate to domains
- [ ] CRUD domains via `make-crud-domain.ts`
- [ ] `paginateCursor` matches HubSpot defaults
- [ ] Models + contracts added and exported
- [ ] Unit tests pass; integration optional

## Schemas and packaging updates

- Schemas (raw only):
  - Location: `schemas/`
    - `index.json` enumerates entities and points to raw schemas.
    - `raw/json/*.schema.json` mirrors TS models exactly: `<Object>` = `HubSpotObject` + `<Object>Properties` with `properties` values constrained to `string|null`.
    - `raw/relational/tables.json` + `tables.sql` define staging tables. Required columns (id, properties, created_at, updated_at, archived) are NOT NULL. Engagements include `object_type` in PK.
  - Extracted schemas: deferred until a transform exists.

- Package subpath exports:
  - Consumers can import stable subpaths (avoid deep internals):
    - Main API: `import { createHubSpotConnector } from '@workspace/connector-hubspot'`
    - Config: `import { withDerivedDefaults, type ConnectorConfig } from '@workspace/connector-hubspot/config'`
    - Low-level client (optional): `import { HttpClient } from '@workspace/connector-hubspot/client'`
  - Implemented via `package.json` `exports` map.

- Running the example:
  - From package dir: `HUBSPOT_TOKEN="..." pnpm exec tsx examples/basic-usage.ts`

- Adding a new object (updates):
  1. Models: add `<object>` folder with `<Object>Properties` and `<Object>` extends `HubSpotObject`.
  2. Contracts: list/single response types.
  3. Domain: `makeCrudDomain` bound to `/crm/v3/objects/<objectType>`.
  4. Connector: add public methods delegating to domain; prefer `stream<Object>s` naming.
  5. Schemas:
     - Raw JSON: `schemas/raw/json/<objects>.schema.json` mirroring the TS model (`properties` additional props are `string|null`).
     - Raw relational: add table to `schemas/raw/relational/tables.json` and DDL in `tables.sql` (NOT NULL id/properties/created_at/updated_at/archived). Add `object_type` for multi-subtype domains as needed.
     - Update `schemas/index.json` with the new entity.
  6. Tests: unit tests for list/get/pagination.

- Future (optional):
  - Add Zod alongside models and generate JSON Schema later; no public API change required.
  - Migrate transport to the official HubSpot SDK behind the existing client facade to preserve the API.
