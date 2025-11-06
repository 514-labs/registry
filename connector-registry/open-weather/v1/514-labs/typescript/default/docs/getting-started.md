# Getting Started

This guide will help you set up and start using the OpenWeather connector.

## Prerequisites

- Node.js 20 or higher
- An OpenWeatherMap API key ([get one here](https://openweathermap.org/api))

## Installation

```bash
pnpm add @workspace/connector-open-weather
```

## Quick Start

### 1. Get Your API Key

Sign up for a free account at [OpenWeatherMap](https://openweathermap.org/api) and generate an API key. Free tier includes:
- 60 calls per minute
- 1,000,000 calls per month
- Current weather and forecasts
- Geocoding
- Air pollution data

### 2. Initialize the Connector

```typescript
import { createConnector } from '@workspace/connector-open-weather'

const connector = createConnector()
connector.init({
  apiKey: process.env.OPENWEATHER_API_KEY!,
  units: 'metric', // 'standard', 'metric', or 'imperial'
  lang: 'en'       // Language for weather descriptions
})
```

### 3. Make Your First Request

```typescript
// Get current weather
const weather = await connector.weather.getCurrent({ q: 'London,UK' })
console.log(`Temperature in ${weather.name}: ${weather.main.temp}°C`)
console.log(`Conditions: ${weather.weather[0].description}`)
```

## Common Use Cases

### Weather by City Name

```typescript
const weather = await connector.weather.getCurrent({
  q: 'New York,US',
  units: 'imperial'
})
console.log(`${weather.main.temp}°F`)
```

### Weather by Coordinates

```typescript
const weather = await connector.weather.getCurrent({
  lat: 48.8566,
  lon: 2.3522
})
```

### 5-Day Forecast

```typescript
const forecast = await connector.forecast.get5Day({
  q: 'Tokyo,JP',
  cnt: 8 // Get next 24 hours (8 × 3-hour intervals)
})

forecast.list.forEach(item => {
  console.log(`${item.dt_txt}: ${item.main.temp}°C - ${item.weather[0].description}`)
})
```

### Geocoding

```typescript
// City name to coordinates
const locations = await connector.geocoding.direct({
  q: 'Paris,FR',
  limit: 1
})
console.log(`Paris: ${locations[0].lat}, ${locations[0].lon}`)

// Coordinates to city name
const places = await connector.geocoding.reverse({
  lat: 40.7128,
  lon: -74.0060
})
console.log(`Location: ${places[0].name}, ${places[0].country}`)
```

### Air Quality

```typescript
const airPollution = await connector.airPollution.getCurrent({
  lat: 51.5074,
  lon: -0.1278
})

const aqi = airPollution.list[0].main.aqi
console.log(`Air Quality Index: ${aqi} (1=Good, 5=Very Poor)`)
console.log(`PM2.5: ${airPollution.list[0].components.pm2_5} μg/m³`)
```

## Environment Variables

Create a `.env` file:

```bash
OPENWEATHER_API_KEY=your-api-key-here
```

Then load it in your application:

```typescript
import 'dotenv/config'
import { createConnector } from '@workspace/connector-open-weather'

const connector = createConnector()
connector.init({
  apiKey: process.env.OPENWEATHER_API_KEY!
})
```

## Error Handling

```typescript
try {
  const weather = await connector.weather.getCurrent({ q: 'InvalidCity' })
} catch (error) {
  if (error.response?.status === 404) {
    console.error('City not found')
  } else if (error.response?.status === 401) {
    console.error('Invalid API key')
  } else {
    console.error('Request failed:', error.message)
  }
}
```

## Next Steps

- Read the [Configuration Guide](./configuration.md) for advanced options
- Check out the [API schemas](../schemas/) for complete data structures
- See [examples/basic-usage.ts](../examples/basic-usage.ts) for more examples
- Review [Rate Limits](./limits.md) for API usage guidelines

## Support

- [OpenWeatherMap Documentation](https://openweathermap.org/api)
- [OpenWeatherMap FAQ](https://openweathermap.org/faq)

