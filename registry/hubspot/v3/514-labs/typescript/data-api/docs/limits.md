# Limits

HubSpot enforces rate limits (vary by plan, object, and endpoint). This connector:

- Uses token bucket rate limiting with configurable RPS and burst capacity.
- Honors `Retry-After` when enabled.
- Retries on common transient status codes with exponential backoff.

Tune `rateLimit` and `retry` in `ConnectorConfig` to match your workload.
