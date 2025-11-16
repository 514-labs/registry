# OpenWeather Connector (TypeScript)

TypeScript connector for the OpenWeatherMap API by `514-labs`.

## Features

- ✅ Current weather data
- ✅ 5-day / 3-hour forecast
- ✅ Air pollution data (current, forecast, historical)
- ✅ Geocoding (direct, reverse, ZIP code)
- ✅ Multiple location formats (city name, coordinates, ZIP, city ID)
- ✅ Multiple units (metric, imperial, standard)
- ✅ Multi-language support
- ✅ Built-in logging and metrics
- ✅ TypeScript type definitions

## Quick Start

```typescript
import { createConnector } from '@workspace/connector-openweather'

const conn = createConnector()
conn.init({
  apiKey: process.env.OPENWEATHER_API_KEY!
})

// Get current weather
const weather = await conn.weather.getCurrent({
  q: 'London,UK',
  units: 'metric'
})
console.log(`Temperature: ${weather.main.temp}°C`)
```

## Documentation

- [Getting Started](docs/getting-started.md) - Quick start guide and examples
- [Configuration](docs/configuration.md) - API key setup and configuration options
- [Limits](docs/limits.md) - API rate limits and best practices
- [Observability](docs/observability.md) - Logging and metrics
- [Schemas](docs/schema.md) - Data schemas and types

## API Resources

### Weather
```typescript
// Current weather by city name
const weather = await conn.weather.getCurrent({ q: 'London,UK', units: 'metric' })

// Current weather by coordinates
const weather = await conn.weather.getCurrent({ lat: 51.5074, lon: -0.1278, units: 'metric' })

// Multiple cities
const data = await conn.weather.getMultipleCities([2643743, 5368361], { units: 'metric' })
```

### Forecast
```typescript
// 5-day / 3-hour forecast
const forecast = await conn.forecast.get5Day3Hour({
  q: 'London,UK',
  units: 'metric',
  cnt: 8  // First 8 timestamps (24 hours)
})
```

### Air Pollution
```typescript
// Current air quality
const current = await conn.airPollution.getCurrent({ lat: 51.5074, lon: -0.1278 })

// Air quality forecast
const forecast = await conn.airPollution.getForecast({ lat: 51.5074, lon: -0.1278 })

// Historical data (requires start and end unix timestamps)
const historical = await conn.airPollution.getHistorical({
  lat: 51.5074,
  lon: -0.1278,
  start: 1606223802,
  end: 1606482999
})
```

### Geocoding
```typescript
// Get coordinates by city name
const locations = await conn.geocoding.getByLocationName({ q: 'London', limit: 5 })

// Reverse geocoding
const locations = await conn.geocoding.getByCoordinates({ lat: 51.5074, lon: -0.1278 })

// By ZIP code
const location = await conn.geocoding.getByZipCode({ zip: '94040,US' })
```

## Requirements

- Node.js 20+
- OpenWeather API key (get one at [openweathermap.org](https://openweathermap.org/api))

## License

MIT

> **📖 Implementation Guide**: See `CONNECTOR_GUIDE.md` for step-by-step instructions on implementing this connector.

Schemas: see `schemas/index.json` for machine-readable definitions and accompanying Markdown docs.
