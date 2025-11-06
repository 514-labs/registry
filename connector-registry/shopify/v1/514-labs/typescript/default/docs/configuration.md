# Configuration

## Required Configuration

- **shopName**: Your Shopify store name (without `.myshopify.com`)
  - Example: If your store URL is `https://my-store.myshopify.com`, use `my-store`
- **accessToken**: Your Shopify Admin API access token
  - Obtain from: Shopify Admin → Apps → Develop apps → Create an app → Install → Admin API access token

## Optional Configuration

- **apiVersion**: Shopify API version to use (default: `2024-10`)
  - Format: `YYYY-MM` (e.g., `2024-10`, `2024-07`)
  - See [Shopify API versioning](https://shopify.dev/docs/api/usage/versioning)
- **logging**: Request/response logging configuration
  - `enabled`: Enable logging (default: `false`)
  - `level`: Log level - `debug`, `info`, `warn`, `error` (default: `info`)
  - `includeQueryParams`: Include query parameters in logs (default: `false`)
  - `includeHeaders`: Include headers in logs (default: `false`)
  - `includeBody`: Include request/response bodies in logs (default: `false`)
  - `logger`: Custom logger function (default: `console.log`)
- **metrics**: Metrics collection configuration
  - `enabled`: Enable metrics collection (default: `false`)

## Authentication

This connector uses Shopify's Admin API access token authentication. The token is sent via the `X-Shopify-Access-Token` header.

### Obtaining an Access Token

1. Go to your Shopify Admin
2. Navigate to Apps → Develop apps
3. Click "Create an app"
4. Give your app a name and configure the scopes you need
5. Click "Install app"
6. Copy the Admin API access token

### Required Scopes

Depending on which resources you want to access, configure the following scopes:

- `read_products` - For products resource
- `read_orders` - For orders resource
- `read_customers` - For customers resource

## Example

```typescript
import { createConnector } from '@workspace/connector-shopify'

const connector = createConnector()
connector.init({
  shopName: 'my-store',
  accessToken: 'shpat_xxxxxxxxxxxx',
  apiVersion: '2024-10',
  logging: {
    enabled: true,
    level: 'info',
    includeQueryParams: true,
  },
  metrics: {
    enabled: true,
  },
})
```
