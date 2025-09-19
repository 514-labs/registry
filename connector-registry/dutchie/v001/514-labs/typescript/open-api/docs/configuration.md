# Configuration

The connector accepts a `ConnectorConfig` during `initialize`. It uses the shared HTTP client from `@connector-factory/core` with hooks, retries, and a token‑bucket rate limiter.

```ts
type ConnectorConfig = {
  // Transport
  baseUrl?: string;                         // default: https://api.pos.dutchie.com
  timeoutMs?: number;                       // default: 30000
  userAgent?: string;                       // default: connector-dutchie
  defaultHeaders?: Record<string, string>;  // e.g., { Accept: "application/json" }
  defaultQueryParams?: Record<string, string | number | boolean>;

  // Auth
  auth: {
    type: "basic" | "bearer" | "oauth2";   // Dutchie commonly uses Basic with API key as username
    bearer?: { token: string };
    basic?: { username: string; password?: string }; // password left empty for API key style
    oauth2?: {
      clientId: string;
      clientSecret: string;
      refreshToken: string;
      accessToken?: string;
      expiresAt?: number;
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
    adaptiveFromHeaders?: boolean;          // default: true
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

Defaults are applied in `createDutchieConnector().initialize()`; you can override anything as needed.

## Validation

You can enable OpenAPI response validation:

```ts
const dutchie = createDutchieConnector();
dutchie.initialize({
  auth: { type: "basic", basic: { username: process.env.DUTCHIE_API_KEY! } },
  validation: { enabled: true, strict: false },
});
```

- When `strict=true`, a validation error throws; otherwise validation errors are logged and ignored.

## Observability

Built-in logging and metrics hooks can be enabled without writing any custom code:

```ts
import { createDutchieConnector } from "@workspace/connector-dutchie";

const dutchie = createDutchieConnector();
dutchie.initialize({
  auth: { type: "basic", basic: { username: process.env.DUTCHIE_API_KEY! } },
  logging: { enabled: true, level: "info" },
});
```

- Logging hook emits compact request/response/error/retry events
- Metrics hook records request/response/error/retry counts and durations

### Manual composition

```ts
import { InMemoryMetricsSink, createMetricsHooks } from "@workspace/connector-dutchie";

const sink = new InMemoryMetricsSink();
const hooks = createMetricsHooks(sink);

dutchie.initialize({
  auth: { type: "basic", basic: { username: process.env.DUTCHIE_API_KEY! } },
  hooks: { ...hooks },
});

// later: inspect sink.events
```
