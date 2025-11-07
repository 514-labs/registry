# OpenWeather Connector

Official connector for the OpenWeather API, providing access to weather data and services.

## Overview

The OpenWeather connector enables access to:
- **Current Weather**: Real-time weather data for any location worldwide
- **Weather Forecasts**: 5-day forecasts with 3-hour intervals
- **Air Pollution**: Current, forecast, and historical air quality data
- **Geocoding**: Convert between location names and coordinates

## Available Versions

- **v1**: Latest stable version with full API support

## Implementations

- `514-labs/typescript/default`: TypeScript implementation with full type safety

## Quick Start

```typescript
import { createConnector } from '@workspace/connector-openweather'

const connector = createConnector()
connector.init({
  apiKey: 'your-openweather-api-key',
  units: 'metric'
})

// Get current weather
const weather = await connector.currentWeather.getByCity('London', 'uk')

// Get forecast
const forecast = await connector.forecast.getByCity('Paris', 'fr')

// Get air quality
const airQuality = await connector.airPollution.getCurrent(51.5074, -0.1278)

// Geocoding
const locations = await connector.geocoding.direct('Tokyo,JP')
```

## Documentation

- [OpenWeather API Documentation](https://openweathermap.org/api)
- [Get API Key](https://openweathermap.org/appid)
- [API Pricing](https://openweathermap.org/price)

## Features

✅ Current weather data  
✅ 5-day / 3-hour forecasts  
✅ Air pollution monitoring  
✅ Geocoding services  
✅ Multiple units (metric, imperial, standard)  
✅ Multi-language support  
✅ Full TypeScript support  

## License

See individual implementation directories for license information.
