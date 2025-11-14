# Woooo Test Connector

⚠️ **WARNING: This is a test connector - do not use in production**

This is a minimal stub connector created for testing purposes.

## Installation

```bash
pnpm install
```

## Usage

```typescript
import { createConnector } from '@workspace/connector-woooo-test'

const connector = createConnector()
connector.init({
  apiKey: 'your-test-api-key'
})

// Test the connection
const result = await connector.testConnection()
console.log(result.message)
```

## Configuration

- `apiKey` (optional): Test API key
- `baseUrl` (optional): Base URL for API calls (default: https://api.example.com)

## Development

Build the connector:
```bash
pnpm run build
```

Run tests:
```bash
pnpm run test
```

## License

MIT
