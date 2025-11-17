# Configuration

The Apex Trading connector supports comprehensive configuration options for authentication, rate limiting, logging, and more.

## Basic Configuration

```typescript
import { createConnector } from '@workspace/connector-apex'

const conn = createConnector()
conn.init({
  accessToken: process.env.APEX_ACCESS_TOKEN || 'your_token',
})
```

## Configuration Options

### Required

#### `accessToken` (string)

Your Apex Trading API bearer token for authentication.

```typescript
conn.init({
  accessToken: 'your_bearer_token_here'
})
```

### Optional

#### `baseUrl` (string)

Override the default base URL. Default: `https://app.apextrading.com/api`

```typescript
conn.init({
  accessToken: 'token',
  baseUrl: 'https://custom.apextrading.com/api'
})
```

#### `timeoutMs` (number)

Request timeout in milliseconds. Default: `30000` (30 seconds)

```typescript
conn.init({
  accessToken: 'token',
  timeoutMs: 60000  // 60 seconds
})
```

#### `userAgent` (string)

Custom user agent string. Default: `apex-connector/0.1.0`

```typescript
conn.init({
  accessToken: 'token',
  userAgent: 'MyApp/1.0'
})
```

## Rate Limiting

The Apex API has a rate limit of 15 requests per second. The connector enforces this by default.

#### `rateLimit.requestsPerSecond` (number)

Configure custom rate limiting. Default: `15`

```typescript
conn.init({
  accessToken: 'token',
  rateLimit: {
    requestsPerSecond: 10  // More conservative rate limiting
  }
})
```

## Logging

Enable detailed logging for debugging and monitoring.

#### `logging.enabled` (boolean)

Enable or disable logging. Default: `false`

#### `logging.level` (string)

Log level: `'debug'`, `'info'`, `'warn'`, or `'error'`. Default: `'info'`

#### `logging.includeQueryParams` (boolean)

Include query parameters in logs. Default: `false`

#### `logging.includeHeaders` (boolean)

Include HTTP headers in logs. Default: `false`

#### `logging.includeBody` (boolean)

Include response body in logs. Default: `false`

#### `logging.logger` (function)

Custom logger function. Default: `console.log`

```typescript
conn.init({
  accessToken: 'token',
  logging: {
    enabled: true,
    level: 'info',
    includeQueryParams: true,
    includeHeaders: false,
    includeBody: false,
    logger: (level, event) => {
      // Custom logging implementation
      console.log(`[${level}]`, JSON.stringify(event, null, 2))
    }
  }
})
```

### Example Logging Output

```typescript
conn.init({
  accessToken: 'token',
  logging: {
    enabled: true,
    level: 'info',
    includeQueryParams: true
  }
})

// Produces logs like:
// info { 
//   event: 'http_request',
//   method: 'GET',
//   url: '/v2/batches',
//   query: { page: 1, per_page: 50 }
// }
// info {
//   event: 'http_response',
//   method: 'GET',
//   url: '/v2/batches',
//   status: 200,
//   durationMs: 234
// }
```

## Metrics

Enable metrics collection for monitoring connector usage.

#### `metrics.enabled` (boolean)

Enable or disable metrics collection. Default: `false`

```typescript
conn.init({
  accessToken: 'token',
  metrics: {
    enabled: true
  }
})

// Access metrics
const sink = (conn as any)._metricsSink
console.log('Metrics:', sink.events)
```

## Complete Example

```typescript
import { createConnector } from '@workspace/connector-apex'

const conn = createConnector()
conn.init({
  // Required
  accessToken: process.env.APEX_ACCESS_TOKEN,
  
  // Optional: Custom base URL
  baseUrl: 'https://app.apextrading.com/api',
  
  // Optional: Request timeout
  timeoutMs: 30000,
  
  // Optional: Custom user agent
  userAgent: 'MyCompany-Integration/1.0',
  
  // Optional: Rate limiting
  rateLimit: {
    requestsPerSecond: 15
  },
  
  // Optional: Logging
  logging: {
    enabled: true,
    level: 'info',
    includeQueryParams: true,
    includeHeaders: false,
    includeBody: false
  },
  
  // Optional: Metrics
  metrics: {
    enabled: true
  }
})
```

## Environment Variables

For security, store your credentials in environment variables:

```bash
# .env
APEX_ACCESS_TOKEN=your_bearer_token_here
APEX_BASE_URL=https://app.apextrading.com/api
```

```typescript
import { createConnector } from '@workspace/connector-apex'

const conn = createConnector()
conn.init({
  accessToken: process.env.APEX_ACCESS_TOKEN!,
  baseUrl: process.env.APEX_BASE_URL
})
```

