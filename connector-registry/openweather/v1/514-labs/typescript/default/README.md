# OpenWeather API Connector (TypeScript)

TypeScript implementation for OpenWeather API by 514-labs.

## Overview

This connector provides access to [OpenWeather API](https://openweathermap.org) services including:

- **Current Weather Data** - Real-time weather data for any location
- **5-day Weather Forecast** - Weather forecast with 3-hour step
- **Air Pollution Data** - Current and forecasted air quality information
- **Geocoding API** - Convert location names to coordinates and vice versa

## Quick Start

### Installation

```bash
pnpm install
```

### Configuration

1. Get your API key from [OpenWeather](https://home.openweathermap.org/api_keys)
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Add your API key to `.env`:
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```

### Basic Usage

```typescript
import { createConnector } from '@workspace/connector-openweather'

const connector = createConnector()
connector.initialize({
  apiKey: process.env.OPENWEATHER_API_KEY!,
})

// Get current weather
const weather = await connector.weather.get({
  q: 'London,GB',
  units: 'metric',
})
console.log(`Temperature: ${weather.main.temp}°C`)

// Get 5-day forecast
const forecast = await connector.forecast.get({
  q: 'London,GB',
  units: 'metric',
})

// Get air pollution data
const pollution = await connector.airPollution.getCurrent({
  lat: 51.5074,
  lon: -0.1278,
})

// Geocoding
const locations = await connector.geocoding.getByLocationName({
  q: 'Paris,FR',
  limit: 1,
})
```

## Available Resources

### Weather
- `weather.get(params)` - Get current weather data

### Forecast
- `forecast.get(params)` - Get 5-day weather forecast with 3-hour step

### Air Pollution
- `airPollution.getCurrent(params)` - Get current air pollution data
- `airPollution.getForecast(params)` - Get forecasted air pollution data
- `airPollution.getHistory(params)` - Get historical air pollution data

### Geocoding
- `geocoding.getByLocationName(params)` - Get coordinates by location name
- `geocoding.getByCoordinates(params)` - Get location name by coordinates
- `geocoding.getByZipCode(params)` - Get location by zip/post code

## Examples

See `examples/basic-usage.ts` for comprehensive examples.

## Documentation

- [Getting Started](docs/getting-started.md)
- [Configuration Options](docs/configuration.md)
- [Rate Limits](docs/limits.md)
- [Schemas](docs/schema.md)
- [Observability](docs/observability.md)

## API Reference

For detailed API documentation, visit [OpenWeather API Documentation](https://openweathermap.org/api).

## License

See `_meta/LICENSE` for details.
