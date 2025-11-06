# API Limits and Rate Limiting

## OpenWeather API Rate Limits

OpenWeather API has different rate limits depending on your subscription plan:

### Free Plan
- **60 calls/minute**
- **1,000,000 calls/month**
- Access to current weather, forecasts, and basic features

### Startup Plan ($40/month)
- **600 calls/minute**
- **10,000,000 calls/month**

### Developer Plan ($160/month)
- **3,000 calls/minute**
- **100,000,000 calls/month**

### Professional Plan (Custom)
- Custom rate limits
- Unlimited calls

See [OpenWeather Pricing](https://openweathermap.org/price) for current details.

## Rate Limit Headers

OpenWeather doesn't return rate limit headers in responses. You should track your usage manually or implement client-side rate limiting.

## Handling Rate Limits

The connector uses the `@connector-factory/core` which supports retry and rate limiting configuration:

```typescript
conn.init({
  apiKey: 'your-api-key',
  retry: {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
    respectRetryAfter: true
  },
  rateLimit: {
    requestsPerSecond: 1,  // For free plan: ~1 req/sec to stay under 60/min
    burstCapacity: 10
  }
})
```

## API Response Codes

- **200**: Success
- **401**: Invalid API key
- **404**: Not found (invalid city name, ID, etc.)
- **429**: Too many requests (rate limit exceeded)
- **500**: Server error

## Best Practices

1. **Cache responses** when possible (especially for forecast data)
2. **Use City IDs** instead of city names for better accuracy and performance
3. **Batch requests** using `getMultipleCities()` when fetching multiple cities
4. **Monitor your usage** in the OpenWeather dashboard
5. **Implement exponential backoff** for retries on failures

## Timeouts

Default timeout is 30 seconds. You can customize it:

```typescript
conn.init({
  apiKey: 'your-api-key',
  timeoutMs: 60000  // 60 seconds
})
```

