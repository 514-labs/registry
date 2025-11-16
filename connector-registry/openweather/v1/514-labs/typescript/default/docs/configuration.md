# Configuration

## Required Configuration

### `apiKey` (required)
Your OpenWeather API key. Get one from [https://openweathermap.org/api](https://openweathermap.org/api).

```typescript
conn.init({
  apiKey: 'your-api-key-here'
})
```

## Optional Configuration

### `baseUrl` (optional)
Override the default API base URL. Default: `https://api.openweathermap.org`

```typescript
conn.init({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.openweathermap.org'  // custom base URL
})
```

### `logging` (optional)
Configure request/response logging.

```typescript
conn.init({
  apiKey: 'your-api-key',
  logging: {
    enabled: true,
    level: 'info',  // 'debug' | 'info' | 'warn' | 'error'
    includeQueryParams: true,
    includeHeaders: false,
    includeBody: false,
    logger: (level, event) => console.log(level, event)  // custom logger
  }
})
```

### `metrics` (optional)
Enable metrics collection.

```typescript
conn.init({
  apiKey: 'your-api-key',
  metrics: {
    enabled: true
  }
})

// Access metrics (if enabled)
const metricsSink = (conn as any)._metricsSink
console.log(metricsSink.events)
```

## Environment Variables

Create a `.env` file in your project:

```bash
OPENWEATHER_API_KEY=your-api-key-here
```

Then use it:

```typescript
import 'dotenv/config'

conn.init({
  apiKey: process.env.OPENWEATHER_API_KEY!
})
```

## API Key Setup

1. Sign up at [https://openweathermap.org/home/sign_up](https://openweathermap.org/home/sign_up)
2. Navigate to API keys section in your account
3. Generate a new API key
4. Wait a few hours for the key to be activated
5. Use the key in your connector configuration

