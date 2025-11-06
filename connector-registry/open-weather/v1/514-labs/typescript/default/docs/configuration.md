# Configuration

The OpenWeather connector requires an API key and supports various configuration options.

## Required Configuration

### API Key

You need an OpenWeatherMap API key to use this connector.

```typescript
import { createConnector } from '@workspace/connector-open-weather'

const connector = createConnector()
connector.init({
  apiKey: 'your-api-key-here'
})
```

**Getting an API Key:**
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API keys section
4. Generate a new API key

## Optional Configuration

### Units of Measurement

Control the units for temperature and other measurements:

```typescript
connector.init({
  apiKey: 'your-api-key',
  units: 'metric' // 'standard', 'metric', or 'imperial'
})
```

- `standard`: Temperature in Kelvin (default)
- `metric`: Temperature in Celsius, wind speed in m/s
- `imperial`: Temperature in Fahrenheit, wind speed in mph

### Language

Get weather descriptions in different languages:

```typescript
connector.init({
  apiKey: 'your-api-key',
  lang: 'es' // Spanish
})
```

Supported language codes: en, es, fr, de, it, pt, ru, ja, zh_cn, and [many more](https://openweathermap.org/current#multi).

### Logging

Enable request and response logging for debugging:

```typescript
connector.init({
  apiKey: 'your-api-key',
  logging: {
    enabled: true,
    level: 'debug', // 'debug', 'info', 'warn', 'error'
    includeQueryParams: true,
    includeHeaders: true,
    includeBody: true,
    logger: (level, event) => {
      console.log(`[${level}]`, event)
    }
  }
})
```

### Metrics

Enable metrics collection to track API usage:

```typescript
connector.init({
  apiKey: 'your-api-key',
  metrics: {
    enabled: true
  }
})
```

## Complete Example

```typescript
import { createConnector } from '@workspace/connector-open-weather'

const connector = createConnector()
connector.init({
  apiKey: process.env.OPENWEATHER_API_KEY!,
  units: 'metric',
  lang: 'en',
  logging: {
    enabled: process.env.NODE_ENV === 'development',
    level: 'info'
  },
  metrics: {
    enabled: true
  }
})
```

## Environment Variables

We recommend storing your API key in environment variables:

```bash
# .env
OPENWEATHER_API_KEY=your-api-key-here
```

Then use it in your code:

```typescript
connector.init({
  apiKey: process.env.OPENWEATHER_API_KEY!
})
```

## Rate Limits

OpenWeatherMap has different rate limits based on your subscription plan:

- **Free**: 60 calls/minute, 1,000,000 calls/month
- **Startup**: 600 calls/minute, up to 3,000,000 calls/month
- **Developer**: 3,000 calls/minute, unlimited calls

The connector automatically includes the API key in all requests as a query parameter.

## Core Configuration

The connector is built on `@connector-factory/core` which provides additional configuration options:

- `baseUrl`: Override the API base URL (default: `https://api.openweathermap.org`)
- `timeoutMs`: Request timeout in milliseconds
- `userAgent`: Custom user agent string
- `retry`: Retry configuration (maxAttempts, delays, backoff)
- `rateLimit`: Client-side rate limiting
- `hooks`: Custom request/response hooks

See [@connector-factory/core documentation](https://github.com/514-labs/moose/tree/main/packages/core) for details.

