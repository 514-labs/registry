# Configuration

This document describes all configuration options for the Apex Trading connector.

## Required Configuration

### `apiKey`
- **Type**: `string`
- **Required**: Yes
- **Description**: Your Apex Trading API key. You can generate an API key from your Apex Trading account dashboard.

## Optional Configuration

### `apiSecret`
- **Type**: `string`
- **Required**: No
- **Description**: Your API secret. Required for certain authenticated operations that need request signing.

### `apiPassphrase`
- **Type**: `string`
- **Required**: No
- **Description**: Your API passphrase. Required for certain authenticated operations.

### `baseUrl`
- **Type**: `string`
- **Required**: No
- **Default**: `https://omni.apex.exchange/api/v3`
- **Description**: Custom API base URL. Useful for testing or if Apex changes their API endpoint.

### `environment`
- **Type**: `'production' | 'testnet'`
- **Required**: No
- **Default**: `'production'`
- **Description**: Determines which API environment to use. When set to `'testnet'`, the base URL defaults to `https://testnet.apex.exchange/api/v3`.

### `logging`
- **Type**: `object`
- **Required**: No
- **Description**: Logging configuration for debugging and monitoring.

#### `logging.enabled`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Enable request/response logging.

#### `logging.level`
- **Type**: `'debug' | 'info' | 'warn' | 'error'`
- **Default**: `'info'`
- **Description**: Minimum log level to output.

#### `logging.includeQueryParams`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Include query parameters in logs.

#### `logging.includeHeaders`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Include headers in logs (be careful with sensitive data).

#### `logging.includeBody`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Include request/response bodies in logs.

### `metrics`
- **Type**: `object`
- **Required**: No
- **Description**: Metrics collection configuration.

#### `metrics.enabled`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Enable metrics collection for request/response statistics.

## Advanced Configuration

You can also pass any configuration from the base `ConnectorConfig` type:

### `retry`
- **Type**: `object`
- **Description**: Retry configuration for failed requests (maxAttempts, initialDelayMs, maxDelayMs, backoffMultiplier, respectRetryAfter).

### `rateLimit`
- **Type**: `object`
- **Description**: Rate limiting configuration (requestsPerSecond: 15, burstCapacity, adaptiveFromHeaders).

### `hooks`
- **Type**: `object`
- **Description**: Arrays for beforeRequest/afterResponse/onError/onRetry lifecycle hooks.

## Example Configuration

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
```

