# Configuration

- baseUrl, timeoutMs, userAgent
- auth: api key, basic, bearer, oauth2 (per core)
- retry: maxAttempts, initialDelayMs, maxDelayMs, backoffMultiplier, respectRetryAfter
- rateLimit: requestsPerSecond, burstCapacity, adaptiveFromHeaders
- hooks: arrays for beforeRequest/afterResponse/onError/onRetry
