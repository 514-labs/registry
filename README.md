## Connector Factory

Build, own, and ship production‑grade data connectors without black boxes.

Inspired by the shadcn philosophy — copy what you need, keep full ownership, and adapt it to your stack — Connector Factory gives you specs, patterns, and tooling to create connectors that are reliable, testable, and truly yours.

### Why this exists

Everyone needs connectors. Nobody enjoys building or maintaining them. Vendors turned that pain into opaque subscriptions where you pay forever and never own the code. It’s time to change that.

- **Own the code**: No lock‑in. Copy, customize, and version in your repo.
- **Proven patterns**: Rock‑solid abstractions for lifecycle, retries, rate limits, pagination, and error handling.
- **LLM‑friendly specs**: Feed our specifications to your LLM to scaffold connectors fast.
- **Integrate everywhere**: Distribute as packages or embed directly into apps/services.

### Monorepo layout

This is a TurboRepo + pnpm monorepo.

- `apps/`: user‑facing apps (e.g. docs site)
- `packages/`: shared libraries (e.g. `@workspace/ui`, `@workspace/models`)
- `services/`: reusable services and infrastructure

Follow the workspace rule: prefix internal packages and services with `@workspace`.

### Requirements

- Node 20 (until Moose Node version issues are resolved)
- pnpm (never npm)

### Quickstart

Install dependencies at the workspace root:

```bash
pnpm install
```

Run the documentation app locally:

```bash
pnpm docs:dev
# open http://localhost:3000
```

Build the docs app:

```bash
pnpm docs:build
```

TurboRepo docs: `https://turborepo.com/docs`

### Philosophy (shadcn‑inspired)

We are not a hosted connector product. We’re a system you copy into your repo:

- **Copy/paste first**: Start with templates and snippets, not a dependency.
- **Readable TypeScript**: Prefer clarity over magic. You should debug everything.
- **Composable primitives**: Small, orthogonal building blocks you can swap.
- **Batteries included, not attached**: Patterns and tests you can own and evolve.

---

## API Connector Specification (summary)

The full spec lives in `apps/components-docs/content/specifications/api-connector.mdx`. Key requirements:

- **Lifecycle**: `initialize(config)`, `connect()`, `disconnect()`, `isConnected()`
- **Requests**: `request(options)` plus `get/post/put/patch/delete`
- **Advanced ops**: `batch(requests)`, `paginate(options)` with strategies (cursor, offset, page, link‑header)
- **Configuration**:
  - Base: `baseUrl`, `timeout`
  - Auth: `api_key | bearer | basic | oauth2 | custom`
  - Retries: `maxAttempts`, backoff with jitter, circuit breaker, respect `Retry‑After`
  - Rate limiting: RPS/RPM/hour, concurrent requests, adaptive updates from headers
  - Defaults: headers, query params
  - Hooks: `beforeRequest`, `afterResponse`, `onError`, `onRetry`
- **Response shape**: `{ data, status, headers, meta: { timestamp, duration, retryCount, rateLimit } }`
- **Data**: `serialize`, `deserialize`, `validate` with schema support
- **Errors**: structured with `code`, `statusCode`, `details`, `retryable` and standard codes

### Minimal TypeScript interface

```ts
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ConnectorConfig {
  baseUrl: string;
  timeout?: number;
  auth?: { type: "api_key" | "bearer" | "basic" | "oauth2" | "custom"; credentials: unknown };
  retry?: { maxAttempts?: number; initialDelay?: number; maxDelay?: number; backoffMultiplier?: number };
  rateLimit?: { requestsPerSecond?: number; requestsPerMinute?: number; concurrentRequests?: number };
  defaultHeaders?: Record<string, string>;
  defaultQueryParams?: Record<string, string | number>;
  hooks?: Partial<Record<HookType, Hook[]>>;
}

export type HookType = "beforeRequest" | "afterResponse" | "onError" | "onRetry";

export interface HookContext {
  type: HookType;
  request?: RequestOptions;
  response?: ResponseEnvelope<unknown>;
  error?: unknown;
  metadata?: Record<string, unknown>;
  modifyRequest?: (updates: Partial<RequestOptions>) => void;
  modifyResponse?: (updates: Partial<ResponseEnvelope<unknown>>) => void;
  abort?: (reason?: string) => void;
}

export interface Hook {
  name: string;
  priority?: number; // lower runs first
  execute: (ctx: HookContext) => Promise<void> | void;
}

export interface RequestOptions {
  method: HttpMethod;
  path: string;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  timeout?: number;
}

export interface ResponseEnvelope<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
  meta?: { timestamp: string; duration: number; retryCount?: number; rateLimit?: { limit?: number; remaining?: number; reset?: string; retryAfter?: number } };
}

export interface Connector {
  initialize: (config: ConnectorConfig) => Promise<void> | void;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  request: <T = unknown>(options: RequestOptions) => Promise<ResponseEnvelope<T>>;
  get: <T = unknown>(path: string, options?: Omit<RequestOptions, "method" | "path">) => Promise<ResponseEnvelope<T>>;
  post: <T = unknown>(path: string, data?: unknown, options?: Omit<RequestOptions, "method" | "path" | "body">) => Promise<ResponseEnvelope<T>>;
  put: <T = unknown>(path: string, data?: unknown, options?: Omit<RequestOptions, "method" | "path" | "body">) => Promise<ResponseEnvelope<T>>;
  patch: <T = unknown>(path: string, data?: unknown, options?: Omit<RequestOptions, "method" | "path" | "body">) => Promise<ResponseEnvelope<T>>;
  delete: <T = unknown>(path: string, options?: Omit<RequestOptions, "method" | "path" | "body">) => Promise<ResponseEnvelope<T>>;
  batch?: <T = unknown>(requests: RequestOptions[]) => Promise<ResponseEnvelope<T>[]>;
  paginate?: <T = unknown>(options: { path: string; pageSize?: number; strategy?: "cursor" | "offset" | "page" | "link-header" }) => AsyncIterable<T[]>;
}
```

### Example: add an auth header via a hook

```ts
const authHook: Hook = {
  name: "auth-bearer",
  priority: 1,
  execute(ctx) {
    if (ctx.type !== "beforeRequest" || !ctx.request || !ctx.modifyRequest) return;
    ctx.modifyRequest({
      headers: { ...(ctx.request.headers ?? {}), Authorization: `Bearer ${process.env.API_TOKEN ?? ""}` },
    });
  },
};
```

### Testing checklist

- Unit tests for all public methods
- Integration tests with mock servers
- Retry logic (backoff, jitter, circuit breaker)
- Rate limiting behavior
- Auth flows and expiry/refresh
- Error classification and propagation
- Pagination strategies and edge cases

---

## Developing in this repo

- **Tooling**: TurboRepo + pnpm. Do not override `.env`. Prefer absolute paths in scripts.
- **Node**: Use Node 20. Example with nvm: `nvm use 20`.
- **Workspace**: Internal packages use the `@workspace/*` scope.

Common commands:

```bash
pnpm install
cd apps/components-docs && pnpm dev
```

## Roadmap (high level)

- API connectors: spec + templates + generators
- Blob storage connectors: S3, GCS, Azure
- Database connectors: Postgres, MySQL, SQLite, MongoDB
- SaaS connectors: common third‑party APIs with auth presets
- Distribution tooling: publishable packages and app integration helpers

## Acknowledgements

This project’s philosophy is inspired by shadcn/ui — pragmatic copy‑and‑own code over opaque dependencies.
