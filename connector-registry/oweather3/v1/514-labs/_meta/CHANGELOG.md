# Changelog

All notable changes to this connector will be documented in this file.

## 1.0.0 - 2024-11-06

### Added

- Initial release of OpenWeatherMap connector
- **Weather Resource**: Get current weather data by city name, coordinates, city ID, or zip code
- **Forecast Resource**: Get 5-day weather forecast with 3-hour intervals
- **Air Pollution Resource**: Access current, forecast, and historical air quality data
- **Geocoding Resource**: Convert between location names and coordinates
  - Direct geocoding (location name to coordinates)
  - Reverse geocoding (coordinates to location name)
  - Zip code lookup
- Support for multiple units (metric, imperial, standard)
- Multi-language support
- Comprehensive TypeScript types for all API responses
- Full test coverage with Jest
- Detailed documentation and examples
- JSON schemas for all resources
