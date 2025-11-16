# Current Weather Data

Get current weather data for any location.

## API Endpoint

```
GET /data/2.5/weather
```

## Query Parameters

### Location (one required)
- `q` - City name (e.g., "London", "London,UK")
- `id` - City ID
- `lat` & `lon` - Geographic coordinates
- `zip` - ZIP/postal code with country code (e.g., "94040,US")

### Optional Parameters
- `units` - Temperature units: `standard` (Kelvin), `metric` (Celsius), `imperial` (Fahrenheit)
- `lang` - Language code for descriptions (e.g., "en", "es", "fr")

## Example Usage

```typescript
const weather = await conn.weather.getCurrent({
  q: 'London,UK',
  units: 'metric'
})
console.log(`Temperature: ${weather.main.temp}°C`)
console.log(`Description: ${weather.weather[0].description}`)
```

## Response Fields

- **coord** - Geographic coordinates
- **weather** - Array of weather conditions
- **main** - Temperature, pressure, humidity data
- **wind** - Wind speed and direction
- **clouds** - Cloudiness percentage
- **rain/snow** - Precipitation volume
- **dt** - Data calculation time (Unix timestamp)
- **sys** - Sunrise/sunset times and country code
- **name** - Location name
