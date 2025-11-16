# Configuration

## Required Configuration

- **`apiKey`**: Your OpenWeather API key
  - Get your API key at [OpenWeatherMap](https://openweathermap.org/api)
  - Sign up for a free account to get started
  - Free tier includes 1,000 API calls per day

## Optional Configuration

- **`baseUrl`**: API base URL (default: `https://api.openweathermap.org`)
  - Usually not needed unless using a proxy or custom endpoint

- **`logging`**: Request/response logging configuration
  - `enabled`: Enable logging (default: `false`)
  - `level`: Log level - `'debug' | 'info' | 'warn' | 'error'` (default: `'info'`)
  - `includeQueryParams`: Include query parameters in logs (default: `false`)
  - `includeHeaders`: Include headers in logs (default: `false`)
  - `includeBody`: Include request/response body in logs (default: `false`)
  - `logger`: Custom logger function

- **`metrics`**: Metrics collection configuration
  - `enabled`: Enable metrics collection (default: `false`)

## Example Configuration

```typescript
import { createConnector } from './src'

const conn = createConnector()
conn.init({
  apiKey: process.env.OPENWEATHER_API_KEY!,
  baseUrl: 'https://api.openweathermap.org', // optional
  logging: {
    enabled: true,
    level: 'info',
    includeQueryParams: true,
  },
  metrics: {
    enabled: true,
  },
})
```

## Environment Variables

Create a `.env` file in the connector directory:

```bash
OPENWEATHER_API_KEY=your_api_key_here
```

Then use it in your code:

```typescript
conn.init({
  apiKey: process.env.OPENWEATHER_API_KEY!,
})
```

## Units

Many endpoints support different unit systems:

- `standard`: Kelvin (temperature), meters/sec (wind speed)
- `metric`: Celsius (temperature), meters/sec (wind speed)
- `imperial`: Fahrenheit (temperature), miles/hour (wind speed)

Example:

```typescript
const weather = await conn.weather.getCurrent({
  q: 'London',
  units: 'metric', // Returns temperature in Celsius
})
```

## Language Support

You can get weather descriptions in different languages using the `lang` parameter:

```typescript
const weather = await conn.weather.getCurrent({
  q: 'Paris',
  lang: 'fr', // Returns descriptions in French
})
```

Supported languages include: `en`, `fr`, `es`, `de`, `it`, `ja`, `zh_cn`, and [many more](https://openweathermap.org/current#multi).

