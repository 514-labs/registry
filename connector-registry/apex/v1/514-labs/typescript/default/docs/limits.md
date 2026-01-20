# Limits

This document describes the API limits, quotas, and rate limiting behavior for the Apex Trading API.

## Rate Limits

### Request Rate

The Apex Trading API has a rate limit of **15 requests per second**.

```typescript
// The connector enforces this by default
conn.init({
  accessToken: 'token',
  rateLimit: {
    requestsPerSecond: 15  // Default
  }
})

// You can adjust this for more conservative usage
conn.init({
  accessToken: 'token',
  rateLimit: {
    requestsPerSecond: 10  // More conservative
  }
})
```

### Pagination Limits

- **Default page size**: 15 items
- **Maximum page size**: 500 items per page

```typescript
// Use maximum page size for efficiency
conn.batches.list({ pageSize: 500 })

// Or use smaller pages for real-time processing
conn.batches.list({ pageSize: 50 })
```

## Best Practices

### 1. Use Maximum Page Size

To minimize API calls and stay within rate limits, use the maximum page size of 500:

```typescript
for await (const page of conn.batches.list({ pageSize: 500 })) {
  // Process up to 500 items at a time
}
```

### 2. Filter Data at the API Level

Use query parameters to filter data at the API level rather than fetching everything:

```typescript
// Good: Filter at API level
conn.buyers.list({ 
  updated_at_from: '2025-04-20T00:00:00Z'
})

// Less efficient: Fetch all and filter locally
```

### 3. Use maxItems for Testing

When testing, use `maxItems` to limit the total number of items fetched:

```typescript
// Only fetch 100 items for testing
conn.batches.list({ 
  pageSize: 50,
  maxItems: 100
})
```

### 4. Handle Rate Limit Errors

While the connector manages rate limiting automatically, be prepared to handle rate limit errors:

```typescript
try {
  for await (const page of conn.batches.list({ pageSize: 500 })) {
    // Process items
  }
} catch (error) {
  if (error.statusCode === 429) {
    console.log('Rate limit exceeded, waiting before retry...')
    // Wait and retry
  }
}
```

## Timeout Configuration

The default request timeout is 30 seconds. For long-running requests, you can increase this:

```typescript
conn.init({
  accessToken: 'token',
  timeoutMs: 60000  // 60 seconds
})
```

## Resource-Specific Limits

### Batches (v2 API)

- Endpoint: `/v2/batches`
- Rate limit: Same as general API (15 req/sec)
- Pagination: Supports `page` and `per_page` parameters

### Products

- Endpoint: `/v1/products`
- Rate limit: Same as general API (15 req/sec)
- Pagination: Supports `page` and `per_page` parameters
- Filters: `updated_at_from`, `has_available_batches`, `include_sold_out_batches`

### Buyers

- Endpoint: `/v1/buyers`
- Rate limit: Same as general API (15 req/sec)
- Pagination: Supports `page` and `per_page` parameters
- Filters: `updated_at_from`

## Monitoring Usage

Enable metrics to monitor your API usage:

```typescript
conn.init({
  accessToken: 'token',
  metrics: { enabled: true }
})

// After some operations
const sink = (conn as any)._metricsSink
const requests = sink.events.filter(e => e.type === 'request')
const responses = sink.events.filter(e => e.type === 'response')

console.log(`Made ${requests.length} requests`)
console.log(`Successful responses: ${responses.filter(r => r.status < 400).length}`)
```

## Error Responses

Common error status codes:

- **400 Bad Request**: Invalid parameters
- **401 Unauthorized**: Invalid or missing access token
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

## Recommendations

1. **Use incremental sync**: Use `updated_at_from` filters to only fetch recently changed data
2. **Maximize page size**: Use `pageSize: 500` to minimize API calls
3. **Monitor rate limits**: Enable logging to track request patterns
4. **Implement backoff**: Add retry logic with exponential backoff for transient errors
5. **Cache when possible**: Cache static data (like buyer stages, brands) locally

## Example: Efficient Batch Synchronization

```typescript
import { createConnector } from '@514labs/connector-apex'

const conn = createConnector()
conn.init({
  accessToken: process.env.APEX_ACCESS_TOKEN!,
  rateLimit: { requestsPerSecond: 15 },
  logging: { enabled: true, level: 'info' }
})

// Sync only recent changes
const lastSyncTime = '2025-04-20T00:00:00Z'

let totalFetched = 0
for await (const page of conn.batches.list({ 
  updated_at_from: lastSyncTime,
  pageSize: 500  // Maximum page size
})) {
  totalFetched += page.length
  console.log(`Synced ${totalFetched} batches so far`)
  
  // Process batch...
  await processBatches(page)
}

console.log(`Total batches synced: ${totalFetched}`)
```

