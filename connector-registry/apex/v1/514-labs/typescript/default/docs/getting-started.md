# Getting Started

This guide will help you get up and running with the Apex Trading connector.

## Installation

### 1. Navigate to your project

Go to the root directory of your project.

### 2. Run the installer

Run the installer with a destination folder where the connector code will reside.

```bash
bash -i <(curl https://registry.514.ai/install.sh) --dest app/connectors/apex apex v1 514-labs typescript default
```

### 3. Install dependencies

From your project's root directory:

```bash
pnpm install
```

## Authentication

The Apex Trading API uses Bearer token authentication. You'll need to obtain an API token from your Apex Trading account.

1. Log in to your Apex Trading account
2. Navigate to API settings
3. Generate a new API token
4. Store it securely (preferably in environment variables)

## Basic Usage

```typescript
import { createConnector } from '@514labs/connector-apex'

// Initialize the connector
const conn = createConnector()
conn.init({
  accessToken: 'your_bearer_token_here'
})

// List batches
for await (const page of conn.batches.list({ pageSize: 10 })) {
  console.log(`Fetched ${page.length} batches`)
  page.forEach(batch => {
    console.log(`Batch #${batch.id}`)
  })
}
```

## Working with Resources

### Batches

The batches resource uses the v2 API endpoints.

```typescript
// List batches with filters
for await (const page of conn.batches.list({ 
  updated_at_from: '2025-04-20T22:04:50Z',
  pageSize: 50,
  maxItems: 200
})) {
  console.log(`Page with ${page.length} batches`)
}

// Get a single batch
const batch = await conn.batches.get(123)
console.log('Batch:', batch)

// Create a new batch
const newBatch = await conn.batches.create({
  // batch data
})

// Update a batch
const updatedBatch = await conn.batches.update(123, {
  // updated fields
})
```

### Buyers

```typescript
// List all buyers
for await (const page of conn.buyers.list({ pageSize: 20 })) {
  page.forEach(buyer => {
    console.log(`${buyer.name} (${buyer.buyer_type})`)
  })
}

// Filter by updated date
for await (const page of conn.buyers.list({ 
  updated_at_from: '2025-01-01T00:00:00Z'
})) {
  console.log(`Fetched ${page.length} recently updated buyers`)
}

// Get a single buyer
const buyer = await conn.buyers.get(456)
console.log('Buyer:', buyer.name)
```

### Brands

```typescript
// List all brands
for await (const page of conn.brands.list()) {
  page.forEach(brand => {
    console.log(`${brand.name} - Company ${brand.company_id}`)
  })
}

// Get a single brand
const brand = await conn.brands.get(789)
console.log('Brand:', brand)
```

### Products

```typescript
// List products with filters
for await (const page of conn.products.list({ 
  updated_at_from: '2025-05-01T00:00:00Z',
  has_available_batches: true,
  include_sold_out_batches: false,
  pageSize: 25
})) {
  console.log(`Fetched ${page.length} products`)
}

// Get a single product
const product = await conn.products.get(101)

// Create a product
const newProduct = await conn.products.create({
  // product data
})

// Update a product
const updatedProduct = await conn.products.update(101, {
  // updated fields
})
```

## Pagination

The connector handles pagination automatically. You control pagination behavior with:

- `pageSize`: Number of items per page (default: 15, max: 500)
- `maxItems`: Maximum total items to fetch (optional)

```typescript
// Fetch first 100 items, 25 at a time
for await (const page of conn.batches.list({ 
  pageSize: 25,
  maxItems: 100 
})) {
  console.log(`Page with ${page.length} items`)
}

// Fetch all items, 500 at a time (most efficient)
for await (const page of conn.batches.list({ 
  pageSize: 500
})) {
  console.log(`Page with ${page.length} items`)
}
```

## Error Handling

```typescript
try {
  const batch = await conn.batches.get(999)
  console.log('Batch:', batch)
} catch (error) {
  if (error.statusCode === 404) {
    console.log('Batch not found')
  } else if (error.statusCode === 401) {
    console.log('Authentication failed')
  } else {
    console.log('Error:', error.message)
  }
}
```

## Rate Limiting

The Apex API has a rate limit of 15 requests per second. The connector automatically enforces this:

```typescript
conn.init({
  accessToken: 'token',
  rateLimit: {
    requestsPerSecond: 15  // Default
  }
})
```

## Logging

Enable logging for debugging:

```typescript
conn.init({
  accessToken: 'token',
  logging: {
    enabled: true,
    level: 'info',
    includeQueryParams: true
  }
})

// Logs will show:
// - HTTP requests with method, URL, and query params
// - HTTP responses with status and duration
// - Errors and retries
```

## Environment Variables

Use environment variables for credentials:

```bash
# .env
APEX_ACCESS_TOKEN=your_bearer_token_here
```

```typescript
import { createConnector } from '@514labs/connector-apex'

const conn = createConnector()
conn.init({
  accessToken: process.env.APEX_ACCESS_TOKEN!
})
```

## Next Steps

- [Configuration Guide](configuration.md) - Detailed configuration options
- [Schema Documentation](schema.md) - Data structures and schemas
- [Observability](observability.md) - Logging and metrics
- [Rate Limits](limits.md) - API limits and quotas

