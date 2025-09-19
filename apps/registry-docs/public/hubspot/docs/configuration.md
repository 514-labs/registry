# Configuration

The connector accepts a `ConnectorConfig` during `initialize`. It uses a custom HTTP client with hooks, retries, and a token‑bucket rate limiter.

```ts
type ConnectorConfig = {
  // Transport
  baseUrl?: string;                         // default: https://api.hubapi.com
  timeoutMs?: number;                       // default: 30000
  userAgent?: string;                       // default: connector-factory-hubspot/0.1.0
  defaultHeaders?: Record<string, string>;  // default: { Accept: "application/json" }
  defaultQueryParams?: Record<string, string | number | boolean>;

  // Auth
  auth: {
    type: "bearer" | "oauth2";
    bearer?: { token: string };             // actively applied (Authorization: Bearer <token>)
    oauth2?: {                              // present in types; not applied by transport yet
      clientId: string;
      clientSecret: string;
      refreshToken: string;
      accessToken?: string;
      expiresAt?: number;                   // epoch seconds
      tokenUrl?: string;
    };
  };

  // Retries
  retry?: {
    maxAttempts?: number;                   // default: 3
    initialDelayMs?: number;                // default: 1000
    maxDelayMs?: number;                    // default: 30000
    backoffMultiplier?: number;             // default: 2
    retryableStatusCodes?: number[];        // default: [408, 425, 429, 500, 502, 503, 504]
    retryBudgetMs?: number;                 // default: 60000
    respectRetryAfter?: boolean;            // default: true
  };

  // Rate limit
  rateLimit?: {
    requestsPerSecond?: number;             // default: 15
    concurrentRequests?: number;            // default: 10
    burstCapacity?: number;                 // default: 30
    adaptiveFromHeaders?: boolean;          // default: true (when true, auto‑adapts using rate‑limit headers)
  };

  // Hooks
  hooks?: {
    beforeRequest?: Function[];
    afterResponse?: Function[];
    onRetry?: Function[];
    onError?: Function[];
  };

  // Observability (built-in hooks)
  enableLogging?: boolean | { level?: "debug" | "info" | "warn" | "error"; includeQueryParams?: boolean; includeHeaders?: boolean; includeBody?: boolean };
  enableMetrics?: boolean;
}
```

Defaults come from `withDerivedDefaults` (see `src/config/defaults.ts`). OAuth2 fields are part of the public types, but the current transport applies only Bearer tokens.

## Validation

Configuration is validated during `initialize` and before any API calls. If invalid, a descriptive error is thrown.

- Required fields depend on `auth.type`:
  - If `auth.type` is `bearer`, you must provide `auth.bearer.token`.
  - If `auth.type` is `oauth2`, you must provide `auth.oauth2.clientId`, `auth.oauth2.clientSecret`, and `auth.oauth2.refreshToken`.
- Optional numeric fields are range-checked (e.g., `timeoutMs > 0`, `retry.maxDelayMs >= retry.initialDelayMs`).
- URLs must be valid when provided (e.g., `baseUrl`, `auth.oauth2.tokenUrl`).

Example errors:

```text
Invalid configuration: bearer.token: Missing required field auth.bearer.token
Invalid configuration: retry.maxDelayMs: retry.maxDelayMs must be >= retry.initialDelayMs
```

Programmatic validation is available via:

```ts
import { validateConfig } from "@workspace/connector-hubspot/config";

const resolved = validateConfig(userConfig);
```

## Observability

Built-in logging and metrics hooks can be enabled without writing any custom code:

```ts
import { createHubSpotConnector } from "@connector-factory/hubspot";

const connector = createHubSpotConnector();
connector.initialize({
  auth: { type: "bearer", bearer: { token: process.env.HUBSPOT_TOKEN! } },
  enableLogging: { level: "info" },   // or true for defaults
  enableMetrics: true,                 // in-memory counters/timings
});
```

- With logging enabled, each request logs a one-line JSON like: `{ "event": "http_response", "method": "GET", "url": "https://api.hubapi.com/crm/v3/objects/contacts", "status": 200, "durationMs": 120, "retryCount": 0 }`.
- With metrics enabled, the connector records counters and timings in an in-memory sink. You can access a sink by composing manually (see below).

### Manual composition
If you prefer manual control, you can import and attach the hooks yourself:

```ts
import { createLoggingHooks, createMetricsHooks, InMemoryMetricsSink } from "@connector-factory/hubspot";

const logging = createLoggingHooks({ level: "info" });
const { hooks: metricsHooks, sink } = createMetricsHooks({ sink: new InMemoryMetricsSink() }, { service: "hubspot" });

connector.initialize({
  auth: { type: "bearer", bearer: { token } },
  hooks: {
    ...logging,
    ...metricsHooks,
  },
});

// later: sink.getSnapshot() for simple inspection in tests/dev
```
