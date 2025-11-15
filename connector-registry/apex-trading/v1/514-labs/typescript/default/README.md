# Apex Trading Connector

TypeScript connector for the Apex Trading wholesale cannabis platform API.

## Overview

Apex Trading is a wholesale cannabis trading platform. This connector provides access to products, batches, orders, companies, and buyers data.

## Installation

```bash
pnpm add @workspace/connector-apex-trading
```

## Quick Start

```typescript
import { createConnector } from '@workspace/connector-apex-trading'

const connector = createConnector()

connector.initialize({
  apiKey: process.env.APEX_API_KEY!,
  logging: { enabled: true, level: 'info' },
  metrics: { enabled: true },
})

// List products with incremental sync
for await (const page of connector.products.list({ 
  updated_at_from: '2024-01-01T00:00:00Z',
  pageSize: 100 
})) {
  console.log('Products:', page)
}

// List receiving orders
for await (const page of connector.orders.receiving({ 
  status: 'confirmed' 
})) {
  console.log('Orders:', page)
}

// Get company details
const company = await connector.companies.get('company-id')
console.log('Company:', company)
```

## Configuration

### Required
- `apiKey`: Your Apex Trading API key

### Optional
- `baseUrl`: Custom API base URL (default: https://api-docs.apextrading.com)
- `logging`: Logging configuration
- `metrics`: Metrics collection configuration

## Available Resources

- **products**: Product catalog with cannabis products
- **batches**: Product batches with tracking and test results
- **orders**: Orders (receiving, shipping, transporter)
- **companies**: Trading companies (distributors, retailers, etc.)
- **buyers**: Buyer information and purchase history

## API Features

### Incremental Sync

Products and batches support incremental sync using `updated_at_from`:

```typescript
// Get products updated since last sync
for await (const page of connector.products.list({ 
  updated_at_from: lastSyncTime 
})) {
  // Process updated products
}
```

### Order Types

Access different order types:

```typescript
// Receiving orders
for await (const page of connector.orders.receiving()) { }

// Shipping orders
for await (const page of connector.orders.shipping()) { }

// Transporter orders
for await (const page of connector.orders.transporter()) { }

// All orders
for await (const page of connector.orders.list()) { }
```

## API Rate Limits

The Apex Trading API has a rate limit of 15 requests per second. This connector automatically handles rate limiting.

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Configuration](./docs/configuration.md)
- [Schemas](./docs/schema.md)
- [API Limits](./docs/limits.md)
- [Observability](./docs/observability.md)

## License

See [LICENSE](../../_meta/LICENSE)
