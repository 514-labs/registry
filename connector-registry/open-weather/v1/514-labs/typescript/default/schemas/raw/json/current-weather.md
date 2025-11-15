# Current Weather

Get current weather data for any location including over 200,000 cities worldwide.

## API Endpoint

```
GET https://api.openweathermap.org/data/2.5/weather
```

## Common Queries

Get weather by city name:
```
q=London,UK
```

Get weather by coordinates:
```
lat=51.5074&lon=-0.1278
```

Get weather by city ID:
```
id=2643743
```

Get weather by zip code:
```
zip=94040,US
```

## Units

- `units=standard`: Temperature in Kelvin (default)
- `units=metric`: Temperature in Celsius
- `units=imperial`: Temperature in Fahrenheit

## Language Support

Use the `lang` parameter to get weather descriptions in different languages:
```
lang=es  # Spanish
lang=fr  # French
lang=de  # German
```

## Response Fields

- **coord**: Geographic coordinates (latitude, longitude)
- **weather**: Weather condition details (id, main, description, icon)
- **main**: Temperature, pressure, humidity data
- **wind**: Wind speed and direction
- **clouds**: Cloudiness percentage
- **rain**: Rain volume (if present)
- **snow**: Snow volume (if present)
- **dt**: Data calculation timestamp (Unix UTC)
- **sys**: Sunrise, sunset, country code
- **name**: City name
- **timezone**: Timezone offset from UTC

## Example Response

```json
{
  "coord": { "lon": -0.1257, "lat": 51.5085 },
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "clear sky",
      "icon": "01d"
    }
  ],
  "main": {
    "temp": 288.15,
    "feels_like": 287.42,
    "temp_min": 286.15,
    "temp_max": 290.15,
    "pressure": 1013,
    "humidity": 72
  },
  "wind": { "speed": 4.5, "deg": 230 },
  "clouds": { "all": 0 },
  "dt": 1635000000,
  "sys": {
    "country": "GB",
    "sunrise": 1634976123,
    "sunset": 1635013456
  },
  "name": "London"
}
```
