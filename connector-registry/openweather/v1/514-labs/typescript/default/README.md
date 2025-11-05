# OpenWeather Connector

TypeScript connector for the OpenWeatherMap API, providing access to current weather data, 5-day forecasts, air pollution data, and geocoding services.

## Features

- **Current Weather**: Get real-time weather data for any location
- **5-Day Forecast**: Access weather forecasts with 3-hour intervals
- **Air Pollution**: Monitor air quality and pollution levels
- **Geocoding**: Convert between location names and coordinates

## Installation

```bash
pnpm install @workspace/connector-openweather
```

## Quick Start

```typescript
import { createConnector } from '@workspace/connector-openweather'

const connector = createConnector()
connector.init({
  apiKey: 'your_api_key_here',
  units: 'metric', // optional: 'standard', 'metric', or 'imperial'
  lang: 'en', // optional: language code
})

// Get current weather
const weather = await connector.weather.get({ q: 'London,UK' })
console.log(`Temperature in ${weather.name}: ${weather.main.temp}°C`)

// Get 5-day forecast
const forecast = await connector.forecast.get({ q: 'London,UK' })
console.log(`Forecast items: ${forecast.cnt}`)

// Get air pollution data
const pollution = await connector.airPollution.getCurrent({ 
  lat: 51.5074, 
  lon: -0.1278 
})
console.log(`Air Quality Index: ${pollution.list[0].main.aqi}`)

// Geocoding
const locations = await connector.geocoding.direct({ 
  q: 'London,UK', 
  limit: 5 
})
console.log(`Found ${locations.length} locations`)
```

## Documentation

See the [docs/](./docs) folder for detailed documentation and the [CONNECTOR_GUIDE.md](./CONNECTOR_GUIDE.md) for implementation details.

Schemas: see `schemas/index.json` for machine-readable definitions and accompanying Markdown docs.

