# OpenWeatherMap API Connector (TypeScript)

TypeScript connector for the OpenWeatherMap API by `514-labs`.

Access current weather data, forecasts, air pollution data, and geocoding services from OpenWeatherMap.

## Features

- **Current Weather**: Get real-time weather data for any location
- **5-Day Forecast**: 3-hour forecast data for up to 5 days
- **Air Pollution**: Current, forecast, and historical air quality data
- **Geocoding**: Convert location names to coordinates and vice versa

## Installation

```bash
pnpm install
```

## Quick Start

```typescript
import { createConnector } from './src'

const connector = createConnector()
connector.init({
  apiKey: 'your-api-key-here',
  units: 'metric', // optional: 'standard', 'metric', or 'imperial'
  language: 'en', // optional: language code
})

// Get current weather
const weather = await connector.weather.get({ q: 'London,UK' })
console.log(`Temperature in ${weather.name}: ${weather.main.temp}°C`)

// Get 5-day forecast
const forecast = await connector.forecast.get({ q: 'London,UK', cnt: 5 })
console.log(`Forecast for ${forecast.city.name}:`, forecast.list)

// Get air pollution data
const airPollution = await connector.airPollution.getCurrent({ 
  lat: 51.5074, 
  lon: -0.1278 
})
console.log(`Air Quality Index: ${airPollution.list[0].main.aqi}`)

// Geocoding
const locations = await connector.geocoding.getByLocationName({ 
  q: 'London', 
  limit: 5 
})
console.log('Found locations:', locations)
```

## Configuration

Get your API key from [OpenWeatherMap](https://home.openweathermap.org/api_keys).

```typescript
connector.init({
  apiKey: 'your-api-key',       // Required: Your OpenWeatherMap API key
  units: 'metric',               // Optional: 'standard', 'metric', or 'imperial'
  language: 'en',                // Optional: Language code (e.g., 'en', 'es', 'fr')
  logging: {                     // Optional: Request logging
    enabled: true,
    level: 'info',
  },
  metrics: {                     // Optional: Performance metrics
    enabled: true,
  },
})
```

## Resources

### Weather

Get current weather data:

```typescript
// By city name
const weather = await connector.weather.get({ q: 'London,UK' })

// By coordinates
const weather = await connector.weather.get({ lat: 51.5074, lon: -0.1278 })

// By city ID
const weather = await connector.weather.get({ id: 2643743 })

// By zip code
const weather = await connector.weather.get({ zip: '94040,US' })
```

### Forecast

Get 5-day / 3-hour forecast:

```typescript
const forecast = await connector.forecast.get({ 
  q: 'London,UK',
  cnt: 10, // Number of timestamps (max 40)
})
```

### Air Pollution

Get air quality data:

```typescript
// Current air pollution
const current = await connector.airPollution.getCurrent({ lat: 51.5074, lon: -0.1278 })

// Forecast
const forecast = await connector.airPollution.getForecast({ lat: 51.5074, lon: -0.1278 })

// Historical (requires start and end timestamps)
const historical = await connector.airPollution.getHistorical({ 
  lat: 51.5074, 
  lon: -0.1278,
  start: 1606488670,
  end: 1606747870,
})
```

### Geocoding

Convert between location names and coordinates:

```typescript
// Get coordinates by location name
const locations = await connector.geocoding.getByLocationName({ 
  q: 'London,UK',
  limit: 5,
})

// Get location name by coordinates (reverse geocoding)
const locations = await connector.geocoding.getByCoordinates({ 
  lat: 51.5074,
  lon: -0.1278,
  limit: 5,
})

// Get coordinates by zip code
const location = await connector.geocoding.getByZipCode({ zip: 'E14,GB' })
```

## Units

- **standard**: Kelvin for temperature, meters/sec for wind speed
- **metric**: Celsius for temperature, meters/sec for wind speed
- **imperial**: Fahrenheit for temperature, miles/hour for wind speed

## Documentation

- See `docs/` for detailed guides
- See `schemas/` for data models
- See `examples/` for more usage examples

## API Reference

Full OpenWeatherMap API documentation: https://openweathermap.org/api

> **📖 Implementation Guide**: See `CONNECTOR_GUIDE.md` for step-by-step instructions on implementing this connector.
