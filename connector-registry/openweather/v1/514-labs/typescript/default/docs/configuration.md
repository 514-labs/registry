# Configuration Guide

## Required Configuration

### API Key
Your OpenWeather API key is required to use this connector.

```typescript
const connector = createConnector()
connector.init({
  apiKey: 'your_api_key_here'
})
```

**Get your API key:**
1. Sign up at [OpenWeather](https://home.openweathermap.org/users/sign_up)
2. Navigate to the API keys section in your account
3. Generate a new API key
4. Copy the key to your configuration

## Optional Configuration

### Units of Measurement

Control the temperature and wind speed units returned by the API:

```typescript
connector.init({
  apiKey: 'your_api_key',
  units: 'metric'  // 'standard', 'metric', or 'imperial'
})
```

- **`standard`** (default): Temperature in Kelvin, wind speed in meter/sec
- **`metric`**: Temperature in Celsius, wind speed in meter/sec
- **`imperial`**: Temperature in Fahrenheit, wind speed in miles/hour

### Language

Get weather descriptions in different languages:

```typescript
connector.init({
  apiKey: 'your_api_key',
  lang: 'es'  // Language code (ISO 639-1)
})
```

Supported languages include: en, es, fr, de, it, pt, ru, ja, zh_cn, and many more.
See [OpenWeather language list](https://openweathermap.org/current#multi) for all options.

### Logging

Enable detailed logging for debugging:

```typescript
connector.init({
  apiKey: 'your_api_key',
  logging: {
    enabled: true,
    level: 'debug',  // 'debug', 'info', 'warn', 'error'
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

Enable metrics collection:

```typescript
connector.init({
  apiKey: 'your_api_key',
  metrics: {
    enabled: true
  }
})
```

## Environment Variables

Store your configuration in environment variables:

```bash
# .env file
OPENWEATHER_API_KEY=your_api_key_here
OPENWEATHER_UNITS=metric
OPENWEATHER_LANG=en
```

Then use them in your code:

```typescript
import { createConnector } from '@workspace/connector-openweather'

const connector = createConnector()
connector.init({
  apiKey: process.env.OPENWEATHER_API_KEY || '',
  units: (process.env.OPENWEATHER_UNITS as any) || 'metric',
  lang: process.env.OPENWEATHER_LANG || 'en'
})
```

## Complete Example

```typescript
import { createConnector } from '@workspace/connector-openweather'

const connector = createConnector()
connector.init({
  apiKey: process.env.OPENWEATHER_API_KEY || '',
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

// Use the connector
const weather = await connector.currentWeather.getByCity('London,UK')
console.log(`Temperature in London: ${weather.main.temp}°C`)
```
