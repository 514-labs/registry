# Apex Trading Connector (TypeScript)

TypeScript connector for the [Apex Trading](https://app.apextrading.com) API by `514-labs`.

## Features

- **Authentication**: Bearer token authentication
- **Pagination**: Automatic page-based pagination (per_page, max 500)
- **Rate Limiting**: Built-in rate limiting (15 requests/second default)
- **Resources**: Batches, Brands, Buyers, Buyer Contact Logs, Buyer Stages, Products, and more
- **Observability**: Optional logging and metrics support

## Installation

```bash
pnpm install
```

## Quick Start

```typescript
import { createConnector } from '@workspace/connector-apex'

// Initialize the connector
const conn = createConnector()
conn.init({
  accessToken: 'your_bearer_token',
  logging: {
    enabled: true,
    level: 'info'
  }
})

// List batches with pagination
for await (const page of conn.batches.list({ pageSize: 50, maxItems: 100 })) {
  console.log(`Fetched ${page.length} batches`)
  page.forEach(batch => console.log(`Batch #${batch.id}`))
}

// Get a single batch
const batch = await conn.batches.get(123)
console.log('Batch:', batch)

// List buyers with filters
for await (const page of conn.buyers.list({ 
  updated_at_from: '2025-01-01T00:00:00Z',
  pageSize: 20
})) {
  console.log(`Fetched ${page.length} buyers`)
}
```

## Configuration

### Required

- `accessToken` (string): Your Apex Trading API bearer token

### Optional

- `baseUrl` (string): Override the base URL (default: `https://app.apextrading.com/api`)
- `timeoutMs` (number): Request timeout in milliseconds (default: 30000)
- `userAgent` (string): Custom user agent string
- `logging` (object): Logging configuration
  - `enabled` (boolean): Enable logging
  - `level` (string): Log level ('debug', 'info', 'warn', 'error')
  - `includeQueryParams` (boolean): Include query parameters in logs
  - `includeHeaders` (boolean): Include headers in logs
  - `includeBody` (boolean): Include response body in logs
- `metrics` (object): Metrics configuration
  - `enabled` (boolean): Enable metrics collection
- `rateLimit` (object): Rate limiting configuration
  - `requestsPerSecond` (number): Requests per second (default: 15)

## Resources

### Batches (V2 API)

```typescript
// List batches with optional filters
conn.batches.list({ 
  updated_at_from: '2025-04-20T22:04:50Z',
  pageSize: 50,
  maxItems: 200
})

// Get a single batch
conn.batches.get(batchId)

// Create a batch
conn.batches.create(batchData)

// Update a batch
conn.batches.update(batchId, updateData)
```

### Brands

```typescript
// List all brands
conn.brands.list({ pageSize: 20 })

// Get a single brand
conn.brands.get(brandId)
```

### Buyers

```typescript
// List buyers with filters
conn.buyers.list({ 
  updated_at_from: '2025-04-20T22:04:50Z',
  pageSize: 50
})

// Get a single buyer
conn.buyers.get(buyerId)
```

### Buyer Contact Logs

```typescript
// List contact logs with filters
conn.buyerContactLogs.list({ 
  buyer_id: 123,
  updated_at_from: '2025-04-20T22:04:50Z'
})

// Get a single contact log
conn.buyerContactLogs.get(logId)
```

### Buyer Stages

```typescript
// List all buyer stages
conn.buyerStages.list()

// Get a single stage
conn.buyerStages.get(stageId)
```

### Products

```typescript
// List products with filters
conn.products.list({ 
  updated_at_from: '2025-05-03T22:04:50Z',
  has_available_batches: true,
  include_sold_out_batches: false
})

// Get a single product
conn.products.get(productId)

// Create a product
conn.products.create(productData)

// Update a product
conn.products.update(productId, updateData)
```

## API Reference

For detailed API documentation, see:
- [Apex Trading API Documentation](https://app.apextrading.com/api)
- [Configuration Guide](docs/configuration.md)
- [Schema Documentation](docs/schema.md)

## Development

```bash
# Build
pnpm run build

# Run tests
pnpm run test

# Try the example
pnpm tsx examples/basic-usage.ts
```

## License

MIT

## Related Documentation

- [Getting Started](docs/getting-started.md)
- [Configuration](docs/configuration.md)
- [Schema](docs/schema.md)
- [Observability](docs/observability.md)
- [Rate Limits](docs/limits.md)
- [Connector Implementation Guide](CONNECTOR_GUIDE.md)

