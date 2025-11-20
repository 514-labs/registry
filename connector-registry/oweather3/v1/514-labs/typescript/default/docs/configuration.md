# Configuration

## Required Configuration

### API Key

```typescript
connector.init({
  apiKey: 'your-api-key', // Required: Get from https://home.openweathermap.org/api_keys
})
```

## Optional Configuration

### Units

Choose the unit system for temperature and wind speed:

```typescript
connector.init({
  apiKey: 'your-api-key',
  units: 'metric', // Options: 'standard', 'metric', 'imperial'
})
```

- **standard** (default): Temperature in Kelvin, wind speed in meter/sec
- **metric**: Temperature in Celsius, wind speed in meter/sec
- **imperial**: Temperature in Fahrenheit, wind speed in miles/hour

### Language

Set the language for weather descriptions:

```typescript
connector.init({
  apiKey: 'your-api-key',
  language: 'en', // ISO 639-1 language code
})
```

Supported languages include: en, es, fr, de, it, pt, ru, ja, zh_cn, and many more.
See [OpenWeatherMap language support](https://openweathermap.org/current#multi) for the full list.

### Logging

Enable request/response logging for debugging:

```typescript
connector.init({
  apiKey: 'your-api-key',
  logging: {
    enabled: true,
    level: 'info', // 'debug', 'info', 'warn', 'error'
    includeQueryParams: true,
    includeHeaders: true,
    includeBody: true,
    logger: (level, event) => {
      // Custom logger implementation
      console.log(`[${level}]`, event)
    },
  },
})
```

### Metrics

Enable performance metrics collection:

```typescript
connector.init({
  apiKey: 'your-api-key',
  metrics: {
    enabled: true,
  },
})
```

## Complete Example

```typescript
import { createConnector } from '@workspace/connector-oweather3'

const connector = createConnector()
connector.init({
  apiKey: process.env.OPENWEATHER_API_KEY!,
  units: 'metric',
  language: 'en',
  logging: {
    enabled: true,
    level: 'info',
  },
  metrics: {
    enabled: true,
  },
})
```

## Environment Variables

Create a `.env` file in your project:

```bash
OPENWEATHER_API_KEY=your-api-key-here
OPENWEATHER_UNITS=metric
OPENWEATHER_LANG=en
```

Then use in your code:

```typescript
connector.init({
  apiKey: process.env.OPENWEATHER_API_KEY!,
  units: process.env.OPENWEATHER_UNITS as 'metric' | 'imperial' | 'standard',
  language: process.env.OPENWEATHER_LANG,
})
```
