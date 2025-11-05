# Current Weather Data

Access current weather data for any location on Earth including over 200,000 cities.

## Endpoint

```
GET /data/2.5/weather
```

## Query Parameters

You can call by one of the following:
- **q**: City name (e.g., `London`, `London,UK`)
- **lat, lon**: Geographic coordinates
- **zip**: ZIP/post code with country code (e.g., `94040,US`)

Additional parameters:
- **units**: `standard`, `metric`, or `imperial` (default: `standard`)
- **lang**: Language code for weather descriptions

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
    "temp_min": 13.0,
    "temp_max": 17.0,
    "pressure": 1013,
    "humidity": 72
  },
  "wind": { "speed": 3.5, "deg": 230 },
  "clouds": { "all": 0 },
  "dt": 1606223802,
  "sys": {
    "country": "GB",
    "sunrise": 1606203982,
    "sunset": 1606233982
  },
  "name": "London"
}
```

## Common Queries

Get weather by city name:
```
q=London,UK
```

Get weather by coordinates:
```
lat=51.5085&lon=-0.1257
```

Get weather in metric units:
```
q=Paris,FR&units=metric
```

## Documentation

See [OpenWeatherMap Current Weather API](https://openweathermap.org/current) for full documentation.
