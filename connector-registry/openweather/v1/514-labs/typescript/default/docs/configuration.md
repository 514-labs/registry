# Configuration

## Required Configuration

### `apiKey` (string, required)

Your OpenWeather API key. Get one from [OpenWeather](https://openweathermap.org/appid).

**Example:**
```typescript
connector.init({
  apiKey: 'your-openweather-api-key'
})
```

## Optional Configuration

### `units` (string, optional)

Units of measurement for temperature and wind speed.

**Values:**
- `'standard'` - Temperature in Kelvin, wind speed in meter/sec (default)
- `'metric'` - Temperature in Celsius, wind speed in meter/sec
- `'imperial'` - Temperature in Fahrenheit, wind speed in miles/hour

**Example:**
```typescript
connector.init({
  apiKey: 'your-api-key',
  units: 'metric'
})
```

### `lang` (string, optional)

Language for weather condition descriptions.

**Common values:** `en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `ja`, `zh_cn`, etc.

See [full list of language codes](https://openweathermap.org/current#multi).

**Example:**
```typescript
connector.init({
  apiKey: 'your-api-key',
  lang: 'es'
})
```

### `baseUrl` (string, optional)

Override the base URL for the API. Defaults to `https://api.openweathermap.org`.

**Example:**
```typescript
connector.init({
  apiKey: 'your-api-key',
  baseUrl: 'https://custom-proxy.example.com'
})
```

### `logging` (object, optional)

Enable request/response logging for debugging.

**Properties:**
- `enabled` (boolean) - Enable logging
- `level` (string) - Log level: `'debug'`, `'info'`, `'warn'`, `'error'`
- `includeQueryParams` (boolean) - Include query parameters in logs
- `includeHeaders` (boolean) - Include headers in logs
- `includeBody` (boolean) - Include response body in logs
- `logger` (function) - Custom logger function

**Example:**
```typescript
connector.init({
  apiKey: 'your-api-key',
  logging: {
    enabled: true,
    level: 'info',
    includeQueryParams: true
  }
})
```

### `metrics` (object, optional)

Enable metrics collection.

**Properties:**
- `enabled` (boolean) - Enable metrics collection

**Example:**
```typescript
connector.init({
  apiKey: 'your-api-key',
  metrics: { enabled: true }
})
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
OPENWEATHER_API_KEY=your_api_key_here
OPENWEATHER_UNITS=metric
OPENWEATHER_LANG=en
```

Load in your code:

```typescript
import dotenv from 'dotenv'
dotenv.config()

connector.init({
  apiKey: process.env.OPENWEATHER_API_KEY!,
  units: process.env.OPENWEATHER_UNITS as 'metric',
  lang: process.env.OPENWEATHER_LANG
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
    enabled: process.env.NODE_ENV === 'development',
    level: 'info'
  }
})
```
