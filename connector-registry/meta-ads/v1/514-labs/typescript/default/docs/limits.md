# Limits

Meta Ads Graph API enforces rate limits and quotas. This connector:

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

## Facebook Graph API Rate Limits

Meta Ads API has several types of rate limits:

### App-level Rate Limiting
- **Rate**: 200 calls per hour per user in development mode
- **Rate**: Varies in production based on app usage and user base
- **Header**: `X-App-Usage` contains percentage of rate limit used

### Ad Account Level Rate Limiting
- **Rate**: Varies based on ad spend and account activity
- **Header**: `X-Ad-Account-Usage` contains percentage of rate limit used

### Business Use Case Rate Limiting
- **Rate**: Varies based on specific API endpoints and business use case
- **Header**: `X-Business-Use-Case-Usage` contains percentage of rate limit used

### Page Level Rate Limiting
- **Rate**: 4800 calls per hour per page
- **Header**: `X-Page-Usage` contains percentage of rate limit used

## Recommended Configuration

```ts
metaAds.initialize({
  auth: { type: "bearer", bearer: { token: process.env.META_ADS_ACCESS_TOKEN! } },
  rateLimit: {
    requestsPerSecond: 25,    // Conservative rate for most use cases
    burstCapacity: 50,        // Allow some burst capacity
    concurrentRequests: 10,   // Reasonable concurrency
    adaptiveFromHeaders: true // Respect API feedback
  },
  retry: {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 30000,
    respectRetryAfter: true   // Important for rate limit recovery
  }
});
```

Tune `rateLimit` and `retry` in `ConnectorConfig` to match your workload and stay within Meta's limits.
