# Current Weather

Current weather data for any location on Earth including over 200,000 cities.

## Description

Access current weather data for any location including over 200,000 cities. Current weather is frequently updated based on global models and data from more than 40,000 weather stations.

## Query Parameters

- `q` - City name, state code (only for US), and country code divided by comma. Use ISO 3166 country codes. (e.g., "London,UK")
- `lat` - Latitude coordinate
- `lon` - Longitude coordinate
- `id` - City ID
- `zip` - Zip/post code and country code divided by comma (e.g., "94040,US")
- `units` - Units of measurement (standard, metric, imperial)
- `lang` - Language for weather description

## Common Queries

Get weather for London:
```
q=London,UK
```

Get weather by coordinates:
```
lat=51.5074&lon=-0.1278
```

Get weather in metric units:
```
q=Paris,FR&units=metric
```

## API Endpoint

```
GET /weather
```

## Response Fields

- `coord` - Geographical coordinates of the location
- `weather` - Array of weather conditions
- `main` - Main weather parameters (temperature, pressure, humidity, etc.)
- `wind` - Wind information
- `clouds` - Cloudiness percentage
- `rain` - Rain volume (if available)
- `snow` - Snow volume (if available)
- `dt` - Time of data calculation (Unix timestamp)
- `sys` - System information (country, sunrise, sunset)
- `timezone` - Timezone shift from UTC
- `name` - City name

## Units

### Temperature
- **Standard**: Kelvin
- **Metric**: Celsius
- **Imperial**: Fahrenheit

### Wind Speed
- **Standard**: meter/sec
- **Metric**: meter/sec
- **Imperial**: miles/hour

### Pressure
- **All units**: hPa (hectopascal)

## Example Response

```json
{
  "coord": {
    "lon": -0.1257,
    "lat": 51.5085
  },
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "clear sky",
      "icon": "01d"
    }
  ],
  "main": {
    "temp": 15.5,
    "feels_like": 14.8,
    "temp_min": 13.9,
    "temp_max": 17.2,
    "pressure": 1013,
    "humidity": 72
  },
  "wind": {
    "speed": 4.1,
    "deg": 80
  },
  "clouds": {
    "all": 0
  },
  "dt": 1605182400,
  "sys": {
    "country": "GB",
    "sunrise": 1605164800,
    "sunset": 1605198000
  },
  "timezone": 0,
  "id": 2643743,
  "name": "London",
  "cod": 200
}
```
