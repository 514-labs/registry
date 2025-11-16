# OpenWeather Connector (TypeScript)

TypeScript implementation for OpenWeather API by 514-labs.

## Features

This connector provides access to:

- **Current Weather Data**: Get real-time weather for any location
- **5-Day Forecast**: Weather forecast with 3-hour intervals
- **Air Pollution**: Current, forecast, and historical air quality data
- **Geocoding**: Convert between location names and coordinates

## Installation

```bash
pnpm install
```

## Quick Start

```typescript
import { createConnector } from './src'

const conn = createConnector()
conn.init({
  apiKey: 'YOUR_OPENWEATHER_API_KEY',
})

// Get current weather
const weather = await conn.weather.getCurrent({
  q: 'London',
  units: 'metric',
})
console.log(`Temperature: ${weather.main?.temp}°C`)

// Get 5-day forecast
const forecast = await conn.forecast.get5Day({
  q: 'New York',
  units: 'imperial',
})

// Get air pollution data
const pollution = await conn.airPollution.getCurrent({
  lat: 48.8566,
  lon: 2.3522,
})

// Geocoding
const locations = await conn.geocoding.direct({ q: 'Tokyo' })
```

## Configuration

Required:
- `apiKey`: Your OpenWeather API key (get one at [openweathermap.org](https://openweathermap.org/api))

Optional:
- `baseUrl`: API base URL (default: `https://api.openweathermap.org`)
- `logging`: Configure request/response logging
- `metrics`: Enable metrics collection

## Resources

### Weather

Get current weather data for any location:

```typescript
// By city name
const weather = await conn.weather.getCurrent({ q: 'London' })

// By coordinates
const weather = await conn.weather.getCurrent({ lat: 51.5074, lon: -0.1278 })

// With units
const weather = await conn.weather.getCurrent({
  q: 'Paris',
  units: 'metric', // 'standard', 'metric', or 'imperial'
})
```

### Forecast

Get 5-day weather forecast with 3-hour intervals:

```typescript
const forecast = await conn.forecast.get5Day({
  q: 'Tokyo',
  units: 'metric',
})
```

### Air Pollution

Get air quality data:

```typescript
// Current air pollution
const current = await conn.airPollution.getCurrent({
  lat: 51.5074,
  lon: -0.1278,
})

// Air pollution forecast
const forecast = await conn.airPollution.getForecast({
  lat: 51.5074,
  lon: -0.1278,
})

// Historical air pollution
const history = await conn.airPollution.getHistory({
  lat: 51.5074,
  lon: -0.1278,
  start: 1606488670,
  end: 1606747870,
})
```

### Geocoding

Convert between location names and coordinates:

```typescript
// Direct geocoding (name to coordinates)
const locations = await conn.geocoding.direct({
  q: 'London',
  limit: 5,
})

// Reverse geocoding (coordinates to name)
const locations = await conn.geocoding.reverse({
  lat: 51.5074,
  lon: -0.1278,
  limit: 1,
})

// By ZIP code
const location = await conn.geocoding.zip({
  zip: 'E14,GB',
})
```

## API Documentation

For detailed API documentation, see:
- [Current Weather](https://openweathermap.org/current)
- [5 Day Forecast](https://openweathermap.org/forecast5)
- [Air Pollution](https://openweathermap.org/api/air-pollution)
- [Geocoding](https://openweathermap.org/api/geocoding-api)

## Examples

See `examples/basic-usage.ts` for more detailed examples.

## Schemas

Schemas: see `schemas/index.json` for machine-readable definitions and accompanying Markdown docs.

