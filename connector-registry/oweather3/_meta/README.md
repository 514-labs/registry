# Open Weather (OpenWeatherMap API)

OpenWeatherMap connector for accessing weather data, forecasts, air pollution information, and geocoding services.

## Overview

The OpenWeatherMap API provides comprehensive weather data including:
- Current weather conditions for any location
- 5-day weather forecasts with 3-hour intervals
- Air quality and pollution data
- Geocoding (location names to coordinates and reverse)

## Versions

- **v1** - Current stable version

## Implementations

- **514-labs/typescript/default** - TypeScript implementation with full API coverage

## Features

- ✅ Current weather data
- ✅ 5-day / 3-hour forecast
- ✅ Air pollution (current, forecast, historical)
- ✅ Geocoding (direct, reverse, zip code)
- ✅ Multiple units support (metric, imperial, standard)
- ✅ Multi-language support
- ✅ Full TypeScript types
- ✅ Comprehensive tests

## Quick Start

```typescript
import { createConnector } from './src'

const connector = createConnector()
connector.init({
  apiKey: 'your-api-key',
  units: 'metric',
})

// Get current weather
const weather = await connector.weather.get({ q: 'London,UK' })
console.log(`Temperature: ${weather.main.temp}°C`)
```

## Resources

- [OpenWeatherMap Website](https://openweathermap.org)
- [API Documentation](https://openweathermap.org/api)
- [Get API Key](https://home.openweathermap.org/api_keys)
