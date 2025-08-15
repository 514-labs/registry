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
