# Limits

HubSpot enforces rate limits (vary by plan, object, and endpoint). This connector:

- Token‑bucket rate limiting wraps all requests:
  - Configure with `rateLimit.requestsPerSecond`, `burstCapacity`, and `concurrentRequests`.
  - When configured (`requestsPerSecond > 0`), a `TokenBucketLimiter` waits for a slot before each request.

- Retries with exponential backoff + jitter:
  - Defaults: `maxAttempts=3`, `initialDelayMs=1000`, `maxDelayMs=30000`, `backoffMultiplier=2`, `retryBudgetMs=60000`.
  - Retryable status codes by default: `408, 425, 429, 500, 502, 503, 504`.
  - Respects `Retry-After` when `respectRetryAfter=true`.

- Rate‑limit and diagnostic headers parsed into the response envelope meta:
  - `x-hubspot-ratelimit-daily`, `x-hubspot-ratelimit-daily-remaining`
  - `x-hubspot-ratelimit-secondly`, `x-hubspot-ratelimit-secondly-remaining`
  - `x-hubspot-ratelimit-reset`, and `retry-after`

Tune `rateLimit` and `retry` in `ConnectorConfig` to match your workload.
