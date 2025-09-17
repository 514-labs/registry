# Limits

Dutchie enforces rate limits. This connector:

- Token‑bucket rate limiting wraps all requests:
  - Configure with `rateLimit.requestsPerSecond`, `burstCapacity`, and `concurrentRequests`.
  - When configured (`requestsPerSecond > 0`), a limiter waits for a slot before each request.
  - When `rateLimit.adaptiveFromHeaders=true` (default), the limiter adapts to API feedback when headers are present (e.g., `Retry-After`).

- Retries with exponential backoff + jitter:
  - Defaults: `maxAttempts=3`, `initialDelayMs=1000`, `maxDelayMs=30000`, `backoffMultiplier=2`, `retryBudgetMs=60000`.
  - Retryable status codes by default: `408, 425, 429, 500, 502, 503, 504`.
  - Respects `Retry-After` when `respectRetryAfter=true`.

- Diagnostic headers are parsed into response envelope meta when present:
  - `retry-after` and request id headers (if provided by the service)

Tune `rateLimit` and `retry` in `ConnectorConfig` to match your workload.
