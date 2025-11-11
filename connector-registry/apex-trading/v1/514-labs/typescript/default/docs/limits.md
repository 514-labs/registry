# API Limits

This document describes the rate limits and constraints of the Apex Trading API.

## Rate Limits

### Global Rate Limit
- **Limit**: 15 requests per second per API key
- **Enforcement**: Per API token/key
- **Headers**: The API returns rate limit information in response headers:
  - `X-RateLimit-Limit`: Maximum requests per second (15)
  - `X-RateLimit-Remaining`: Remaining requests in the current window
  - `Retry-After`: Time in seconds to wait before retrying (when rate limited)

### HTTP Status Codes
- **429 Too Many Requests**: Rate limit exceeded. The connector will automatically retry after the specified delay.

## Connector Rate Limiting

This connector automatically handles rate limiting to prevent you from exceeding API limits:

- **Default Setting**: 15 requests per second (matching the API limit)
- **Automatic Retry**: When a 429 status is received, the connector respects the `Retry-After` header
- **Configuration**: You can customize rate limiting in the connector configuration:

```typescript
connector.initialize({
  apiKey: 'your-api-key',
  rateLimit: {
    requestsPerSecond: 15,
    burstCapacity: 30, // optional
    adaptiveFromHeaders: true, // optional - adjust based on API response headers
  },
})
```

## Best Practices

1. **Use Pagination Wisely**: When listing large datasets, use appropriate page sizes to minimize requests
2. **Batch Operations**: Where possible, batch multiple operations into single requests
3. **Cache Data**: Cache frequently accessed reference data (products, etc.) to reduce API calls
4. **Monitor Rate Limits**: Enable metrics to track your API usage

## Data Limits

### Pagination
- **Maximum Page Size**: Varies by endpoint, typically 100-1000 items
- **Recommended Page Size**: 100 items for optimal performance
- **Offset/Limit**: Most endpoints use offset-based pagination

## Error Handling

When you exceed rate limits, the connector will:

1. Receive a `429 Too Many Requests` response
2. Read the `Retry-After` header
3. Wait the specified time
4. Automatically retry the request (up to `maxAttempts`)

You can configure retry behavior:

```typescript
connector.initialize({
  apiKey: 'your-api-key',
  retry: {
    maxAttempts: 3,
    retryableStatusCodes: [429, 500, 502, 503, 504],
    respectRetryAfter: true,
  },
})
```

