# Getting Started

## Installation

```bash
# Clone or install the connector
pnpm install
```

## Quick Start

### 1. Get an API Key

Sign up at [OpenWeatherMap](https://openweathermap.org) and get your API key from your [account page](https://home.openweathermap.org/api_keys).

### 2. Initialize the Connector

```typescript
import { createConnector } from './src'

const connector = createConnector()
connector.init({
  apiKey: 'your-api-key',
  units: 'metric', // Optional: 'metric', 'imperial', or 'standard'
  language: 'en', // Optional: ISO 639-1 language code
})
```

### 3. Get Current Weather

```typescript
// By city name
const weather = await connector.weather.get({ q: 'London,UK' })
console.log(`Temperature in ${weather.name}: ${weather.main.temp}°C`)
console.log(`Weather: ${weather.weather[0].description}`)

// By coordinates
const weatherByCoords = await connector.weather.get({
  lat: 51.5074,
  lon: -0.1278,
})

// By city ID
const weatherById = await connector.weather.get({ id: 2643743 })

// By zip code
const weatherByZip = await connector.weather.get({ zip: '94040,US' })
```

### 4. Get 5-Day Forecast

```typescript
const forecast = await connector.forecast.get({
  q: 'Paris,FR',
  cnt: 10, // Number of timestamps (optional, max 40)
})

console.log(`Forecast for ${forecast.city.name}:`)
forecast.list.forEach((item) => {
  console.log(`${item.dt_txt}: ${item.main.temp}°C - ${item.weather[0].description}`)
})
```

### 5. Get Air Quality Data

```typescript
// Current air pollution
const airPollution = await connector.airPollution.getCurrent({
  lat: 51.5074,
  lon: -0.1278,
})
console.log(`Air Quality Index: ${airPollution.list[0].main.aqi}`)

// Forecast air pollution
const airForecast = await connector.airPollution.getForecast({
  lat: 51.5074,
  lon: -0.1278,
})

// Historical data (requires start and end timestamps)
const historical = await connector.airPollution.getHistorical({
  lat: 51.5074,
  lon: -0.1278,
  start: 1606488670,
  end: 1606747870,
})
```

### 6. Geocoding

```typescript
// Get coordinates by location name
const locations = await connector.geocoding.getByLocationName({
  q: 'London,UK',
  limit: 5,
})
console.log('Found locations:', locations)

// Reverse geocoding (coordinates to location)
const reverseLocations = await connector.geocoding.getByCoordinates({
  lat: 51.5074,
  lon: -0.1278,
  limit: 1,
})
console.log('Location:', reverseLocations[0].name)

// By zip code
const zipLocation = await connector.geocoding.getByZipCode({
  zip: 'E14,GB',
})
console.log(`Zip ${zipLocation.zip} is in ${zipLocation.name}`)
```

## Complete Example

```typescript
import { createConnector } from './src'

async function main() {
  // Initialize
  const connector = createConnector()
  connector.init({
    apiKey: process.env.OPENWEATHER_API_KEY!,
    units: 'metric',
    logging: { enabled: true, level: 'info' },
  })

  // Get current weather
  const weather = await connector.weather.get({ q: 'Tokyo,JP' })
  console.log(`\nCurrent Weather in ${weather.name}:`)
  console.log(`Temperature: ${weather.main.temp}°C`)
  console.log(`Feels like: ${weather.main.feels_like}°C`)
  console.log(`Humidity: ${weather.main.humidity}%`)
  console.log(`Wind: ${weather.wind.speed} m/s`)
  console.log(`Description: ${weather.weather[0].description}`)

  // Get forecast
  const forecast = await connector.forecast.get({ q: 'Tokyo,JP', cnt: 3 })
  console.log(`\n3-Hour Forecast:`)
  forecast.list.forEach((item, i) => {
    console.log(`[${i + 1}] ${item.dt_txt}: ${item.main.temp}°C`)
  })
}

main().catch(console.error)
```

## Next Steps

- Check out [Configuration](./configuration.md) for more options
- See [examples/basic-usage.ts](../examples/basic-usage.ts) for more examples
- Read the [API Documentation](https://openweathermap.org/api) for available parameters
