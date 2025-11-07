# OpenWeather Connector (TypeScript)

TypeScript connector for OpenWeather API - Access current weather, forecasts, air pollution, and geocoding data.

## Features

- ✅ **Current Weather**: Get real-time weather data for any location
- ✅ **Weather Forecast**: 5-day forecast with 3-hour intervals
- ✅ **Air Pollution**: Current, forecast, and historical air quality data
- ✅ **Geocoding**: Convert between location names and coordinates

## Installation

```bash
pnpm install
```

## Quick Start

```typescript
import { createConnector } from '@workspace/connector-openweather'

// Create and initialize the connector
const connector = createConnector()
connector.init({
  apiKey: 'your-openweather-api-key',
  units: 'metric', // 'standard', 'metric', or 'imperial'
  lang: 'en'       // Optional: language for descriptions
})

// Get current weather by city
const weather = await connector.currentWeather.getByCity('London', 'uk')
console.log(`Temperature: ${weather.main.temp}°C`)
console.log(`Description: ${weather.weather[0].description}`)

// Get weather forecast
const forecast = await connector.forecast.getByCity('New York', 'us')
console.log(`Next 5 days: ${forecast.list.length} data points`)

// Get air pollution data
const pollution = await connector.airPollution.getCurrent(51.5074, -0.1278)
console.log(`Air Quality Index: ${pollution.list[0].main.aqi}`)

// Geocoding: convert city name to coordinates
const locations = await connector.geocoding.direct('Paris,FR', 1)
console.log(`Paris coordinates: ${locations[0].lat}, ${locations[0].lon}`)
```

## Configuration

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiKey` | string | ✅ | Your OpenWeather API key ([get one here](https://openweathermap.org/appid)) |
| `units` | string | ❌ | Units: `'standard'` (Kelvin), `'metric'` (Celsius), `'imperial'` (Fahrenheit) |
| `lang` | string | ❌ | Language code for weather descriptions (e.g., 'en', 'es', 'fr') |
| `baseUrl` | string | ❌ | Override base URL (default: `https://api.openweathermap.org`) |
| `logging` | object | ❌ | Enable logging for debugging |
| `metrics` | object | ❌ | Enable metrics collection |

## API Resources

### Current Weather

```typescript
// By city name
const weather = await connector.currentWeather.getByCity('London', 'uk')

// By coordinates
const weather = await connector.currentWeather.getByCoordinates(51.5074, -0.1278)

// By city ID
const weather = await connector.currentWeather.getByCityId(2643743)

// By zip code
const weather = await connector.currentWeather.getByZipCode('94040', 'us')
```

### Weather Forecast

```typescript
// 5 day / 3 hour forecast
const forecast = await connector.forecast.getByCity('Paris', 'fr')

// With custom number of data points
const forecast = await connector.forecast.getByCoordinates(48.8566, 2.3522, 10)
```

### Air Pollution

```typescript
// Current air pollution
const current = await connector.airPollution.getCurrent(51.5074, -0.1278)

// Forecast (up to 4 days)
const forecast = await connector.airPollution.getForecast(51.5074, -0.1278)

// Historical data (from Nov 27, 2020)
const historical = await connector.airPollution.getHistorical({
  lat: 51.5074,
  lon: -0.1278,
  start: 1606435200, // Unix timestamp
  end: 1606521600
})
```

### Geocoding

```typescript
// Location name to coordinates
const locations = await connector.geocoding.direct('London,UK', 5)

// Coordinates to location name
const locations = await connector.geocoding.reverse(51.5074, -0.1278)

// Zip code to coordinates
const location = await connector.geocoding.byZipCode('94040', 'us')
```

## Authentication

Get your free API key from [OpenWeather](https://openweathermap.org/appid). The free tier includes:
- Current weather data
- 5 day / 3 hour forecast
- Air pollution data
- Geocoding
- 1,000 API calls per day

## Rate Limits

Free tier: 60 calls/minute, 1,000,000 calls/month

See [OpenWeather pricing](https://openweathermap.org/price) for paid plans with higher limits.

## Documentation

- [OpenWeather API Documentation](https://openweathermap.org/api)
- [Current Weather API](https://openweathermap.org/current)
- [Forecast API](https://openweathermap.org/forecast5)
- [Air Pollution API](https://openweathermap.org/api/air-pollution)
- [Geocoding API](https://openweathermap.org/api/geocoding-api)

## Schemas

See `schemas/index.json` for machine-readable schema definitions and accompanying documentation.

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Run tests
pnpm run test

# Run example
pnpm tsx examples/basic-usage.ts
```

## License

See LICENSE file in the connector directory.
