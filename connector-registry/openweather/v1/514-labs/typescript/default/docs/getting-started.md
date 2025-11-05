# Getting Started

This guide will help you get up and running with the OpenWeather connector.

## Prerequisites

- Node.js 20 or higher
- An OpenWeatherMap API key (free tier available)

## Installation

```bash
pnpm install @workspace/connector-openweather
```

## Get Your API Key

1. Sign up for a free account at [OpenWeatherMap](https://openweathermap.org/api)
2. Navigate to your [API keys page](https://home.openweathermap.org/api_keys)
3. Generate a new API key (it may take a few hours to activate)
4. Copy your API key for use in the connector

## Basic Usage

### Initialize the Connector

```typescript
import { createConnector } from '@workspace/connector-openweather'

const connector = createConnector()
connector.init({
  apiKey: 'your_api_key_here',
  units: 'metric',  // Optional: 'standard', 'metric', or 'imperial'
  lang: 'en'        // Optional: language code
})
```

### Get Current Weather

```typescript
// By city name
const weather = await connector.weather.get({ 
  q: 'London,UK' 
})

console.log(`Temperature: ${weather.main.temp}°C`)
console.log(`Weather: ${weather.weather[0].description}`)
console.log(`Humidity: ${weather.main.humidity}%`)
```

### Get Weather Forecast

```typescript
// Get 5-day forecast
const forecast = await connector.forecast.get({ 
  q: 'Paris,FR' 
})

console.log(`City: ${forecast.city.name}`)
console.log(`Forecast items: ${forecast.cnt}`)

// Print forecast for next 24 hours (8 timestamps)
forecast.list.slice(0, 8).forEach(item => {
  console.log(`${item.dt_txt}: ${item.main.temp}°C - ${item.weather[0].description}`)
})
```

### Get Air Pollution Data

```typescript
// Current air pollution
const pollution = await connector.airPollution.getCurrent({
  lat: 40.7128,
  lon: -74.0060
})

const aqi = pollution.list[0].main.aqi
const aqiLabels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor']
console.log(`Air Quality: ${aqiLabels[aqi - 1]}`)
console.log(`PM2.5: ${pollution.list[0].components.pm2_5} μg/m³`)
```

### Use Geocoding

```typescript
// Find locations by name
const locations = await connector.geocoding.direct({
  q: 'London',
  limit: 5
})

locations.forEach(loc => {
  console.log(`${loc.name}, ${loc.country} (${loc.lat}, ${loc.lon})`)
})
```

## Next Steps

- Check out the [Configuration](./configuration.md) guide for detailed options
- Review [Rate Limits](./limits.md) to understand API constraints
- Explore the [Schema Documentation](../schemas/raw/json/) for detailed response structures
- See [examples/basic-usage.ts](../examples/basic-usage.ts) for more examples

