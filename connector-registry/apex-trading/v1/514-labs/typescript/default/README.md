# Apex Trading Connector

TypeScript connector for the Apex Trading API.

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
  apiSecret: process.env.APEX_API_SECRET,
  apiPassphrase: process.env.APEX_API_PASSPHRASE,
  environment: 'production', // or 'testnet'
  logging: { enabled: true, level: 'info' },
  metrics: { enabled: true },
})

// List products
for await (const page of connector.products.list()) {
  console.log('Products:', page)
}

// Get account balance
const balance = await connector.accounts.getBalance()
console.log('Balance:', balance)

// List orders
for await (const page of connector.orders.list({ symbol: 'BTC-USDT' })) {
  console.log('Orders:', page)
}

// Create an order
const order = await connector.orders.create({
  symbol: 'BTC-USDT',
  side: 'BUY',
  type: 'LIMIT',
  quantity: '0.001',
  price: '50000',
  timeInForce: 'GTC',
})
console.log('Order created:', order)
```

## Configuration

### Required
- `apiKey`: Your Apex Trading API key

### Optional
- `apiSecret`: Your API secret (required for some operations)
- `apiPassphrase`: Your API passphrase (required for some operations)
- `baseUrl`: Custom API base URL
- `environment`: 'production' or 'testnet' (default: 'production')
- `logging`: Logging configuration
- `metrics`: Metrics collection configuration

## Available Resources

- **accounts**: Account management and balance information
- **orders**: Order creation, listing, and management
- **trades**: Trade history and information
- **products**: Market products, tickers, and order book data

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
