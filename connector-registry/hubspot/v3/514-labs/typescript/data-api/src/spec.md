## HubSpot Connector Spec

This v3 spec documents a compact, production‑oriented extractor for HubSpot CRM. It builds on v2 (typed domains, retries, rate limits, hooks) and clarifies how to add custom objects alongside the defaults.

### Scope and Principles

- **Reusable primitives**: One request primitive + a generic cursor paginator.
- **Thin domains**: Default objects (contacts, companies, deals, tickets, engagements) are small bindings to shared CRUD.
- **Custom‑object friendly**: The same CRUD/pagination primitives work for any `objectType`.
- **Deterministic + observable**: Stable response envelope; hooks for transforms/logging.

### Lifecycle and Request Pipeline

- `initialize(config)` → validate config, prepare HTTP client/limiters.
- `connect()` / `disconnect()` → toggle readiness.
- `request({ method, path, query, headers, body, timeoutMs, operation })` → single execution path; retries + rate‑limit + hooks.
- `paginate({ path, query, pageSize, extractItems?, extractNextCursor? })` → generic cursor iterator; defaults match HubSpot (`results[]`, `paging.next.after`).

### Configuration (kept minimal)

- Base: `baseUrl` (default `https://api.hubapi.com`), `timeoutMs`, `userAgent`, `defaultHeaders`, `defaultQueryParams`.
- Auth: Private App Token (Bearer) now; OAuth2 later.
- Retry: bounded attempts, exponential backoff + jitter, `Retry‑After` aware, retry budget.
- Rate limit: token bucket (`requestsPerSecond`, `burstCapacity`, optional `concurrentRequests`).
- Hooks: `beforeRequest`, `afterResponse`, `onError`, `onRetry`.

### Domain Surface (Defaults)

- Thin domains bind paths to shared CRUD (list/get) and convenience extractors (stream/getAll).
- Provided:
  - Contacts, Companies, Deals, Tickets: `list|get|stream|getAll`
  - Engagements: same surface, parameterized by `objectType` (one of `notes|calls|emails|meetings|tasks`)
- All support `properties?: string[]` and cursor paging (`limit`, `after`).

### Custom Objects Support (First‑Class Only)

Custom objects live under `/crm/v3/objects/{objectType}` and share the same paging shape. To add one, follow the Minimal API Addition steps below to create a model, API contracts, a domain binding, and public methods. This ensures compile‑time safety and avoids runtime string typos.

Notes:
- Items follow the base `HubSpotObject` shape with typed `properties` defined by your model.
- Property metadata for discovery/validation is available via `/crm/v3/properties/{objectType}` (optional for extraction).

### Pagination

- Cursor strategy with `limit` and `after`.
- Defaults extract items from `data.results` and next cursor from `data.paging.next.after`.
- Overridable extractors allow non‑standard endpoints without new domain code.

### Error Handling and Envelope

- Standardized error mapping for timeouts, network errors, 408/425/429/5xx.
- Every response is wrapped: `{ data, status, headers, meta: { timestamp, durationMs, requestId?, retryCount?, rateLimit? } }`.

### Testing

- Unit: request primitive, retry/backoff behavior, paginator, default domain list/get, and custom object pagination via `paginate`.
- Integration (gated): smoke‑test a small page on a real object type.

### Conformance to Baseline Spec

- Lifecycle, request primitive, hooks: implemented.
- Cursor pagination: implemented with pluggable extractors.
- Rate‑limit + retries with jitter and `Retry‑After`: implemented.
- Typed models for defaults; generic model for custom objects.

### Minimal API Addition

If you want your object to be first‑class in this package (like contacts/companies), add these minimal pieces:

- Models: `src/models/<object>/`
  - `<object>.ts` (properties + model)
  - `<object>-api-contracts.ts` (list/single response types)
  - `index.ts` (re‑export the above)
  - Add an export in `src/models/index.ts` (e.g., `export * from "./<object>"`)

- Domain: `src/domains/<object>.ts`
  - Bind your path with `makeCrudDomain` → expose `{ list, get, streamAll, getAll }` under clear names

- Connector surface: `src/index.ts`
  - Spread your domain builder into the aggregated `domain` getter
  - Add public methods that delegate (e.g., `list<MyObjects>`, `get<MyObject>`, `stream<MyObjects>`, `get<MyObjects>`)

This is the recommended and only supported path in this spec. It provides full typing and consistent ergonomics across objects.


