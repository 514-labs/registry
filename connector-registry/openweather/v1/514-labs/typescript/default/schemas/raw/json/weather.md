# Current Weather Data

Access current weather data for any location on Earth including over 200,000 cities.

## API Endpoint

```
GET /data/2.5/weather
```

## Parameters

- `q`: City name, state code and country code divided by comma (e.g., "London,UK")
- `lat`, `lon`: Geographical coordinates (latitude, longitude)
- `id`: City ID
- `zip`: ZIP/post code and country code divided by comma (e.g., "94040,US")
- `units`: Units of measurement (`standard`, `metric`, `imperial`)
- `lang`: Language for weather descriptions

## Response Fields

- `coord`: Coordinates of the location (longitude, latitude)
- `weather`: Weather condition information (id, main, description, icon)
- `main`: Main weather parameters (temperature, pressure, humidity)
- `wind`: Wind information (speed, direction, gust)
- `clouds`: Cloudiness percentage
- `rain`: Precipitation volume (1h, 3h)
- `snow`: Snow volume (1h, 3h)
- `dt`: Time of data calculation (Unix timestamp)
- `sys`: System information (country, sunrise, sunset times)
- `name`: City name

## Example Request

```
GET /data/2.5/weather?q=London&units=metric&appid=YOUR_API_KEY
```

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
    "temp": 15.5,
    "feels_like": 14.8,
    "temp_min": 13.9,
    "temp_max": 16.7,
    "pressure": 1013,
    "humidity": 72
  },
  "wind": { "speed": 3.6, "deg": 230 },
  "clouds": { "all": 0 },
  "dt": 1606488670,
  "sys": {
    "country": "GB",
    "sunrise": 1606461821,
    "sunset": 1606492960
  },
  "name": "London"
}
```

## Common Use Cases

- Display current temperature on weather dashboard
- Show weather conditions for user's location
- Monitor weather for outdoor activities
- Integrate real-time weather into mobile apps
