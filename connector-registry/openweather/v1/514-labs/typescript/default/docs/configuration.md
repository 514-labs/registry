# Configuration

## Getting Started

To use the OpenWeather connector, you'll need an API key from OpenWeatherMap:

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your API key from your account dashboard
3. Use the API key to initialize the connector

## Required Configuration

### `apiKey` (string, required)

Your OpenWeatherMap API key.

```typescript
connector.init({
  apiKey: 'your_api_key_here'
})
```

## Optional Configuration

### `units` (string, optional)

Temperature unit system. Defaults to `'standard'`.

Options:
- `'standard'` - Kelvin (default)
- `'metric'` - Celsius
- `'imperial'` - Fahrenheit

```typescript
connector.init({
  apiKey: 'your_api_key_here',
  units: 'metric'
})
```

### `lang` (string, optional)

Language code for weather descriptions. Defaults to `'en'`.

Supported languages include: `en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `zh_cn`, `ja`, and many more. See [OpenWeatherMap language documentation](https://openweathermap.org/current#multi) for the full list.

```typescript
connector.init({
  apiKey: 'your_api_key_here',
  lang: 'es'
})
```

### `baseUrl` (string, optional)

Custom base URL for the API. Defaults to `'https://api.openweathermap.org'`.

```typescript
connector.init({
  apiKey: 'your_api_key_here',
  baseUrl: 'https://api.openweathermap.org'
})
```

### `logging` (object, optional)

Enable and configure request/response logging.

```typescript
connector.init({
  apiKey: 'your_api_key_here',
  logging: {
    enabled: true,
    level: 'info',
    includeQueryParams: true,
    includeHeaders: true,
    includeBody: true,
    logger: (level, event) => console.log(level, event)
  }
})
```

### `metrics` (object, optional)

Enable metrics collection.

```typescript
connector.init({
  apiKey: 'your_api_key_here',
  metrics: {
    enabled: true
  }
})
```

## Complete Example

```typescript
import { createConnector } from '@workspace/connector-openweather'

const connector = createConnector()
connector.init({
  apiKey: process.env.OPENWEATHER_API_KEY!,
  units: 'metric',
  lang: 'en',
  logging: {
    enabled: true,
    level: 'info'
  }
})
```

## Core Configuration Options

The connector also supports standard configuration options from @connector-factory/core:

- `baseUrl`: API base URL
- `timeoutMs`: Request timeout in milliseconds
- `userAgent`: Custom user agent string
- `retry`: Retry configuration (maxAttempts, initialDelayMs, maxDelayMs, backoffMultiplier, respectRetryAfter)
- `rateLimit`: Rate limiting configuration (requestsPerSecond, burstCapacity, adaptiveFromHeaders)
- `hooks`: Custom hooks for beforeRequest/afterResponse/onError/onRetry

