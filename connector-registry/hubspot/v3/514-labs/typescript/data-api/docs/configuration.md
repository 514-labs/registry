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
    adaptiveFromHeaders?: boolean;          // default: true (reserved; not adaptive yet)
  };

  // Hooks
  hooks?: {
    beforeRequest?: Function[];
    afterResponse?: Function[];
    onRetry?: Function[];
    onError?: Function[];
  };
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
