# Getting Started with OpenWeather Connector

## Installation

```bash
npm install @workspace/connector-openweather
```

## Quick Start

```typescript
import { createConnector } from '@workspace/connector-openweather'

const conn = createConnector()
conn.init({
  apiKey: process.env.OPENWEATHER_API_KEY!,
  logging: { enabled: true, level: 'info' }
})

// Get current weather
const weather = await conn.weather.getCurrent({
  q: 'London,UK',
  units: 'metric'
})
console.log(`Temperature: ${weather.main.temp}°C`)

// Get 5-day forecast
const forecast = await conn.forecast.get5Day3Hour({
  lat: 51.5074,
  lon: -0.1278,
  units: 'metric'
})
console.log(`Forecast items: ${forecast.cnt}`)

// Get air pollution data
const airPollution = await conn.airPollution.getCurrent({
  lat: 51.5074,
  lon: -0.1278
})
console.log(`AQI: ${airPollution.list[0].main.aqi}`)

// Geocoding
const locations = await conn.geocoding.getByLocationName({
  q: 'Paris,FR',
  limit: 1
})
console.log(`Coordinates: ${locations[0].lat}, ${locations[0].lon}`)
```

## Available Resources

### Weather
- `weather.getCurrent(params)` - Get current weather data
- `weather.getMultipleCities(cityIds, params)` - Get weather for multiple cities

### Forecast
- `forecast.get5Day3Hour(params)` - Get 5 day / 3 hour forecast

### Air Pollution
- `airPollution.getCurrent(params)` - Get current air pollution
- `airPollution.getForecast(params)` - Get air pollution forecast
- `airPollution.getHistorical(params)` - Get historical air pollution

### Geocoding
- `geocoding.getByLocationName(params)` - Get coordinates by city name
- `geocoding.getByCoordinates(params)` - Reverse geocoding
- `geocoding.getByZipCode(params)` - Get coordinates by ZIP code

## Location Parameters

You can specify location in several ways:

- **City name**: `{ q: 'London' }` or `{ q: 'London,UK' }`
- **City ID**: `{ id: 2643743 }`
- **Coordinates**: `{ lat: 51.5074, lon: -0.1278 }`
- **ZIP code**: `{ zip: '94040,US' }`

## Units

Choose temperature units:
- `units: 'standard'` - Kelvin (default)
- `units: 'metric'` - Celsius
- `units: 'imperial'` - Fahrenheit

