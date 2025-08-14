# Configuration

The connector accepts a `ConnectorConfig` object during `initialize`.

```ts
{
  baseUrl?: string;               // default: https://api.hubapi.com
  timeoutMs?: number;             // request timeout (ms)
  userAgent?: string;             // sent in requests
  defaultHeaders?: Record<string, string>;
  defaultQueryParams?: Record<string, string | number | boolean>;
  auth: {
    type: "bearer";
    bearer?: { token?: string };
  };
  retry?: {
    maxAttempts?: number;         // default 3
    initialDelayMs?: number;      // default 1000
    maxDelayMs?: number;          // default 30000
    backoffMultiplier?: number;   // default 2
    retryableStatusCodes?: number[]; // includes 408, 425, 429, 500, 502, 503, 504
    retryBudgetMs?: number;       // default 60000
    respectRetryAfter?: boolean;  // default true
  };
  rateLimit?: {
    requestsPerSecond?: number;   // default 15
    concurrentRequests?: number;  // default 10
    burstCapacity?: number;       // default 30
    adaptiveFromHeaders?: boolean;// default true
  };
  hooks?: {
    beforeRequest?: Function[];
    afterResponse?: Function[];
    onRetry?: Function[];
    onError?: Function[];
  };
}
```

Defaults are derived by `withDerivedDefaults`. See `src/config/defaults.ts` for exact values.
