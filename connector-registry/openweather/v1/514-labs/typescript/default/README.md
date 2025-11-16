# OpenWeather Connector

A TypeScript connector for the OpenWeather API, providing access to current weather data, forecasts, air pollution data, and geocoding services.

## Features

- 🌤️ **Current Weather Data** - Get real-time weather information for any location
- 📅 **5-Day Forecast** - Access weather predictions with 3-hour intervals
- 🌬️ **Air Pollution Data** - Monitor air quality indices and pollutant levels
- 🗺️ **Geocoding** - Convert between city names and coordinates
- 🔄 **Multiple Query Methods** - Search by city name, coordinates, city ID, or ZIP code
- 🌍 **Multi-language Support** - Get weather data in multiple languages
- 📏 **Flexible Units** - Choose between metric, imperial, or standard units

## Installation

```bash
pnpm install @workspace/connector-openweather
```

## Quick Start

```typescript
import { createConnector } from '@workspace/connector-openweather'

// Create and initialize the connector
const connector = createConnector()
connector.init({
  apiKey: 'your_api_key_here',
  units: 'metric',  // optional: 'standard', 'metric', or 'imperial'
  lang: 'en',       // optional: language code
})

// Get current weather
const weather = await connector.currentWeather.getByCity('London,UK')
console.log(`Temperature: ${weather.main.temp}°C`)
console.log(`Weather: ${weather.weather[0].description}`)
```

## API Key

Get your free API key from [OpenWeather](https://openweathermap.org/api):
1. Sign up at https://home.openweathermap.org/users/sign_up
2. Navigate to API keys section
3. Generate a new API key
4. Copy the key to your `.env` file

## Available Resources

### Current Weather

Get real-time weather data for any location:

```typescript
// By city name
const weather = await connector.currentWeather.getByCity('London,UK')

// By coordinates
const weather = await connector.currentWeather.getByCoordinates(51.5074, -0.1278)

// By city ID
const weather = await connector.currentWeather.getByCityId(2643743)

// By ZIP code
const weather = await connector.currentWeather.getByZip('10001,US')
```

### 5-Day Forecast

Access weather forecasts with 3-hour intervals:

```typescript
// By city name
const forecast = await connector.forecast.getByCity('New York,NY,US')

// By coordinates
const forecast = await connector.forecast.getByCoordinates(40.7128, -74.0060)

// Access forecast data
forecast.list.forEach(item => {
  console.log(`${item.dt_txt}: ${item.main.temp}°C, ${item.weather[0].description}`)
})
```

### Air Pollution

Monitor air quality and pollutant levels:

```typescript
// Current air pollution
const pollution = await connector.airPollution.getCurrent(48.8566, 2.3522)
console.log(`AQI: ${pollution.list[0].main.aqi}`) // 1-5 scale

// Air pollution forecast
const forecast = await connector.airPollution.getForecast(48.8566, 2.3522)

// Historical data (requires start and end timestamps)
const historical = await connector.airPollution.getHistorical(
  48.8566, 
  2.3522, 
  1606223802, // start timestamp
  1606482999  // end timestamp
)
```

### Geocoding

Convert between location names and coordinates:

```typescript
// Forward geocoding (city name to coordinates)
const locations = await connector.geocoding.forward('Tokyo,JP', 5)
console.log(`Coordinates: ${locations[0].lat}, ${locations[0].lon}`)

// Reverse geocoding (coordinates to location)
const places = await connector.geocoding.reverse(35.6762, 139.6503)
console.log(`Location: ${places[0].name}, ${places[0].country}`)

// By ZIP code
const location = await connector.geocoding.byZipCode('10001,US')
console.log(`${location.name}: ${location.lat}, ${location.lon}`)
```

## Configuration

### Required Configuration

- `apiKey` - Your OpenWeather API key

### Optional Configuration

- `units` - Temperature units: `'standard'` (Kelvin), `'metric'` (Celsius), or `'imperial'` (Fahrenheit). Default: `'standard'`
- `lang` - Language code for weather descriptions (e.g., `'en'`, `'es'`, `'fr'`, `'de'`). Default: `'en'`
- `logging` - Logging configuration (see Observability section)
- `metrics` - Metrics collection (see Observability section)

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
OPENWEATHER_API_KEY=your_api_key_here
OPENWEATHER_UNITS=metric
OPENWEATHER_LANG=en
```

## Response Types

All responses are fully typed. Key types include:

- `CurrentWeatherResponse` - Current weather data
- `ForecastResponse` - 5-day forecast data
- `AirPollutionResponse` - Air quality data
- `GeocodingLocation` - Geographic location data

See the TypeScript definitions in `src/resources/` for complete type information.

## Rate Limits

Free tier: 60 calls/minute, 1,000,000 calls/month

For higher limits, see [OpenWeather pricing](https://openweathermap.org/price).

## Examples

See the `examples/` directory for more usage examples:

```bash
# Set up your .env file first
cp .env.example .env
# Edit .env and add your API key

# Run the basic example
pnpm tsx examples/basic-usage.ts
```

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Configuration Guide](./docs/configuration.md)
- [API Schema](./docs/schema.md)
- [Rate Limits](./docs/limits.md)
- [Observability](./docs/observability.md)
- [Connector Implementation Guide](./CONNECTOR_GUIDE.md)

## API Reference

For complete API documentation, visit [OpenWeather API Documentation](https://openweathermap.org/api).

## License

See LICENSE file for details.
