# Configuration

## Required Configuration

### apiKey (required)
Your OpenWeather API key. Get one at [OpenWeather API Keys](https://home.openweathermap.org/api_keys).

```typescript
connector.initialize({
  apiKey: 'your_api_key_here',
})
```

## Optional Configuration

### baseUrl (optional)
API base URL. Default: `https://api.openweathermap.org`

```typescript
connector.initialize({
  apiKey: 'your_api_key',
  baseUrl: 'https://api.openweathermap.org', // custom base URL if needed
})
```

### Logging (optional)
Enable request/response logging for debugging.

```typescript
connector.initialize({
  apiKey: 'your_api_key',
  logging: {
    enabled: true,
    level: 'info',              // 'debug' | 'info' | 'warn' | 'error'
    includeQueryParams: true,   // Log query parameters
    includeHeaders: false,      // Log headers
    includeBody: false,         // Log request/response bodies
  },
})
```

### Metrics (optional)
Enable metrics collection for monitoring.

```typescript
connector.initialize({
  apiKey: 'your_api_key',
  metrics: {
    enabled: true,
  },
})
```

## Advanced Configuration

The connector is built on `@connector-factory/core` which provides additional configuration options:

### Retry Configuration
```typescript
connector.initialize({
  apiKey: 'your_api_key',
  retry: {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
    respectRetryAfter: true,
  },
})
```

### Rate Limiting
```typescript
connector.initialize({
  apiKey: 'your_api_key',
  rateLimit: {
    requestsPerSecond: 60,      // OpenWeather free tier: 60 calls/minute
    burstCapacity: 60,
    adaptiveFromHeaders: false,
  },
})
```

### Timeouts
```typescript
connector.initialize({
  apiKey: 'your_api_key',
  timeoutMs: 30000,  // 30 seconds
})
```

### User Agent
```typescript
connector.initialize({
  apiKey: 'your_api_key',
  userAgent: 'my-app/1.0',
})
```

## Environment Variables

It's recommended to store your API key in environment variables:

```bash
# .env file
OPENWEATHER_API_KEY=your_api_key_here
```

```typescript
import * as dotenv from 'dotenv'
dotenv.config()

connector.initialize({
  apiKey: process.env.OPENWEATHER_API_KEY!,
})
```
