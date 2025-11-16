# Getting Started with OpenWeather Connector

This guide will help you get started with the OpenWeather connector.

## Installation

Install the connector in your project:

```bash
pnpm install @workspace/connector-openweather
# or
npm install @workspace/connector-openweather
# or
yarn add @workspace/connector-openweather
```

## Get an API Key

1. Sign up for a free account at [OpenWeather](https://home.openweathermap.org/users/sign_up)
2. Navigate to the API keys section
3. Generate a new API key
4. Copy the API key for use in your application

**Note**: Free tier includes 60 calls/minute and 1,000,000 calls/month.

## Basic Setup

Create a `.env` file in your project root:

```bash
OPENWEATHER_API_KEY=your_api_key_here
OPENWEATHER_UNITS=metric
OPENWEATHER_LANG=en
```

## Quick Start Example

```typescript
import { createConnector } from '@workspace/connector-openweather'

// Create and initialize the connector
const connector = createConnector()
connector.init({
  apiKey: process.env.OPENWEATHER_API_KEY || '',
  units: 'metric',  // Use Celsius for temperature
  lang: 'en'        // English language
})

// Get current weather
async function getCurrentWeather() {
  const weather = await connector.currentWeather.getByCity('London,UK')
  
  console.log(`Temperature: ${weather.main.temp}°C`)
  console.log(`Feels like: ${weather.main.feels_like}°C`)
  console.log(`Weather: ${weather.weather[0].description}`)
  console.log(`Humidity: ${weather.main.humidity}%`)
  console.log(`Wind speed: ${weather.wind.speed} m/s`)
}

getCurrentWeather().catch(console.error)
```

## Common Use Cases

### 1. Get Current Weather

```typescript
// By city name
const weather = await connector.currentWeather.getByCity('New York,NY,US')

// By coordinates
const weather = await connector.currentWeather.getByCoordinates(40.7128, -74.0060)

// By ZIP code
const weather = await connector.currentWeather.getByZip('10001,US')
```

### 2. Get 5-Day Forecast

```typescript
const forecast = await connector.forecast.getByCity('Paris,FR')

// Iterate through forecast periods
forecast.list.forEach(item => {
  console.log(`${item.dt_txt}: ${item.main.temp}°C - ${item.weather[0].description}`)
})
```

### 3. Check Air Quality

```typescript
const pollution = await connector.airPollution.getCurrent(48.8566, 2.3522)

const aqiLabels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor']
const aqi = pollution.list[0].main.aqi
console.log(`Air Quality: ${aqiLabels[aqi - 1]}`)
console.log(`PM2.5: ${pollution.list[0].components.pm2_5} μg/m³`)
```

### 4. Geocoding

```typescript
// Find coordinates for a city
const locations = await connector.geocoding.forward('Tokyo,JP')
console.log(`Coordinates: ${locations[0].lat}, ${locations[0].lon}`)

// Find location name from coordinates
const places = await connector.geocoding.reverse(35.6762, 139.6503)
console.log(`Location: ${places[0].name}, ${places[0].country}`)
```

## Error Handling

```typescript
try {
  const weather = await connector.currentWeather.getByCity('InvalidCity')
} catch (error) {
  if (error.statusCode === 404) {
    console.error('City not found')
  } else if (error.statusCode === 401) {
    console.error('Invalid API key')
  } else if (error.statusCode === 429) {
    console.error('Rate limit exceeded')
  } else {
    console.error('An error occurred:', error.message)
  }
}
```

## Next Steps

- Read the [Configuration Guide](./configuration.md) for detailed configuration options
- Check [Rate Limits](./limits.md) to understand API usage limits
- Explore [API Schemas](./schema.md) for complete data structure documentation
- See the [README](../README.md) for comprehensive API reference

## Support

- [OpenWeather API Documentation](https://openweathermap.org/api)
- [OpenWeather FAQ](https://openweathermap.org/faq)
- [GitHub Issues](https://github.com/514-labs/registry/issues)
