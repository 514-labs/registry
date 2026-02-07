# Getting Started

## Installation

```bash
npm install @workspace/connector-shopify
# or
pnpm add @workspace/connector-shopify
```

## Basic Usage

```typescript
import { createConnector } from '@workspace/connector-shopify'

// Initialize the connector
const connector = createConnector()
connector.init({
  shopName: 'your-shop-name',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN!,
  apiVersion: '2024-10',
})

// Fetch products
for await (const page of connector.products.list({ pageSize: 50 })) {
  for (const product of page) {
    console.log(`Product: ${product.title}`)
  }
}

// Get a single product
const product = await connector.products.get(123456789)
console.log(product)

// Fetch orders
for await (const page of connector.orders.list({ status: 'open' })) {
  for (const order of page) {
    console.log(`Order ${order.name}: ${order.email}`)
  }
}

// Search customers
const customers = await connector.customers.search({
  query: 'email:john@example.com'
})
console.log(customers)
```

## Authentication

See [Configuration](./configuration.md) for details on obtaining and using Shopify API credentials.

## Available Resources

- **Products** - List, get, and count products
- **Orders** - List, get, and count orders
- **Customers** - List, get, search, and count customers

## Pagination

All list methods support cursor-based pagination with the following parameters:

- `pageSize`: Number of items per page (default: 50, max: 250)
- `maxItems`: Maximum total items to fetch across all pages

Example:
```typescript
// Fetch 100 products, 50 at a time
for await (const page of connector.products.list({ pageSize: 50, maxItems: 100 })) {
  console.log(`Page size: ${page.length}`)
}
```

## Rate Limiting

Shopify enforces rate limits on API requests. The connector does not automatically handle rate limiting, so you may want to implement retry logic or use the built-in retry configuration from `@connector-factory/core`.

See [Shopify Rate Limits](https://shopify.dev/docs/api/usage/rate-limits) for more information.
