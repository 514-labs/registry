# Limits

## Rate Limits

Shopify implements rate limiting for API requests to ensure fair usage and system stability.

### REST Admin API Rate Limits

- **Standard Plan**: 2 requests per second
- **Shopify Plus**: 4 requests per second (can be increased)
- **GraphQL Admin API**: 1000 points per second (cost-based)

### Leaky Bucket Algorithm

Shopify uses a "leaky bucket" algorithm for rate limiting:
- Each app gets a bucket that can hold a certain number of requests
- The bucket "leaks" at a constant rate (requests per second)
- When the bucket is full, additional requests are throttled with a 429 status code

### Response Headers

Shopify includes rate limit information in response headers:
- `X-Shopify-Shop-Api-Call-Limit`: Current usage / Total limit (e.g., "32/40")
- `Retry-After`: Time in seconds to wait before retrying (on 429 responses)

### Handling Rate Limits

The connector doesn't automatically retry on rate limit errors. To handle rate limits:

1. **Monitor response headers** to track your usage
2. **Implement retry logic** with exponential backoff
3. **Use the core retry configuration**:

```typescript
connector.initialize({
  shopName: 'your-shop',
  accessToken: 'token',
  retry: {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
    respectRetryAfter: true,
  },
})
```

### Best Practices

- Batch requests when possible
- Use cursor-based pagination efficiently
- Monitor the `X-Shopify-Shop-Api-Call-Limit` header
- Implement exponential backoff for retries
- Consider using webhooks instead of polling

## Data Limits

### Query Parameters

- **limit**: Maximum 250 items per page
- **fields**: Limit returned fields to reduce response size

### Bulk Operations

For large data exports, consider using Shopify's Bulk Operations API instead of paginating through REST endpoints.

## References

- [Shopify API Rate Limits](https://shopify.dev/docs/api/usage/rate-limits)
- [Bulk Operations](https://shopify.dev/docs/api/usage/bulk-operations/queries)
