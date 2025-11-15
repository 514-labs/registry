# Shopify (TypeScript)

TypeScript implementation for `shopify` by `514-labs`.

## Quick Start

```typescript
import { createConnector } from '@workspace/connector-shopify'

const connector = createConnector()
connector.init({
  shopName: 'your-shop-name',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN!,
  apiVersion: '2024-10',
})

// Fetch products
for await (const page of connector.products.list({ pageSize: 50 })) {
  console.log(`Fetched ${page.length} products`)
}
```

## Authentication

Shopify uses custom access tokens for authentication. You'll need:
- A Shopify store name (e.g., `your-shop-name`)
- An Admin API access token

See [Shopify Admin API documentation](https://shopify.dev/docs/api/admin-rest) for details on obtaining access tokens.

## Available Resources

- `products` - Product management
- `orders` - Order management
- `customers` - Customer management

See `schemas/index.json` for machine-readable definitions and accompanying Markdown docs.
