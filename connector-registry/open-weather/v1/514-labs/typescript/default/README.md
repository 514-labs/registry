# OpenWeather Connector (TypeScript)

TypeScript connector for the OpenWeatherMap API by 514-labs.

> **📖 Implementation Guide**: See `CONNECTOR_GUIDE.md` for step-by-step instructions on implementing this connector.

## Features

Access current weather, forecasts, geocoding, and air pollution data from OpenWeatherMap:

- **Current Weather**: Real-time weather conditions for any location
- **5-Day Forecast**: Weather forecast with 3-hour intervals
- **Geocoding**: Convert between city names and coordinates
- **Air Pollution**: Current, forecast, and historical air quality data

## Installation

```bash
pnpm add @workspace/connector-open-weather
```

## Quick Start

```typescript
import { createConnector } from '@workspace/connector-open-weather'

const connector = createConnector()
connector.init({
  apiKey: 'your-api-key-here',
  units: 'metric', // optional: 'standard', 'metric', or 'imperial'
  lang: 'en' // optional: language code
})

// Get current weather by city name
const weather = await connector.weather.getCurrent({ q: 'London,UK' })
console.log(`Temperature in ${weather.name}: ${weather.main.temp}°C`)

// Get 5-day forecast by coordinates
const forecast = await connector.forecast.get5Day({ 
  lat: 51.5074, 
  lon: -0.1278 
})
console.log(`${forecast.cnt} forecast items for ${forecast.city.name}`)

// Geocode a city name
const locations = await connector.geocoding.direct({ q: 'London,UK', limit: 5 })
console.log(`Found ${locations.length} locations`)

// Get air pollution data
const airQuality = await connector.airPollution.getCurrent({ 
  lat: 51.5074, 
  lon: -0.1278 
})
console.log(`Air Quality Index: ${airQuality.list[0].main.aqi}`)
```

## Configuration

### Required

- `apiKey`: Your OpenWeatherMap API key ([get one here](https://openweathermap.org/api))

### Optional

- `units`: Units of measurement (`'standard'`, `'metric'`, or `'imperial'`)
- `lang`: Language code for weather descriptions (default: `'en'`)
- `logging`: Enable request/response logging
- `metrics`: Enable metrics collection

See `docs/configuration.md` for detailed configuration options.

## Resources

### Weather

Current weather data for locations worldwide.

```typescript
const weather = await connector.weather.getCurrent({
  q: 'Paris,FR',
  units: 'metric'
})
```

### Forecast

5-day weather forecast with data every 3 hours.

```typescript
const forecast = await connector.forecast.get5Day({
  lat: 48.8566,
  lon: 2.3522,
  cnt: 10 // optional: limit number of forecast items
})
```

### Geocoding

Convert between location names and geographic coordinates.

```typescript
// City name to coordinates
const locations = await connector.geocoding.direct({ 
  q: 'New York,US',
  limit: 1
})

// Coordinates to city name
const places = await connector.geocoding.reverse({
  lat: 40.7128,
  lon: -74.0060
})

// Zip code lookup
const location = await connector.geocoding.byZipCode({ 
  zip: '94040,US' 
})
```

### Air Pollution

Air quality data including pollutant concentrations.

```typescript
// Current air pollution
const current = await connector.airPollution.getCurrent({
  lat: 51.5074,
  lon: -0.1278
})

// Forecast
const forecast = await connector.airPollution.getForecast({
  lat: 51.5074,
  lon: -0.1278
})

// Historical data
const history = await connector.airPollution.getHistory({
  lat: 51.5074,
  lon: -0.1278,
  start: Math.floor(Date.now() / 1000) - 86400, // 24 hours ago
  end: Math.floor(Date.now() / 1000)
})
```

## Documentation

- `docs/getting-started.md` - Setup and basic usage
- `docs/configuration.md` - Configuration options
- `docs/schema.md` - Data schemas
- `docs/limits.md` - API rate limits and quotas
- `docs/observability.md` - Logging and metrics

## Schemas

See `schemas/index.json` for machine-readable data definitions and accompanying Markdown documentation.

## Testing

```bash
pnpm test
```

## License

MIT

