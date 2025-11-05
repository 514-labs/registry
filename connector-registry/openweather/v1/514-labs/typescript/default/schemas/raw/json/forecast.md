# 5-Day Weather Forecast

5-day weather forecast with data every 3 hours.

## Endpoint

```
GET /data/2.5/forecast
```

## Query Parameters

You can call by one of the following:
- **q**: City name (e.g., `London`, `London,UK`)
- **lat, lon**: Geographic coordinates
- **zip**: ZIP/post code with country code (e.g., `94040,US`)

Additional parameters:
- **cnt**: Number of timestamps to return (max 40, default: all)
- **units**: `standard`, `metric`, or `imperial` (default: `standard`)
- **lang**: Language code for weather descriptions

## Response Structure

Returns up to 40 timestamps (5 days × 8 timestamps per day) with 3-hour intervals.

## Example Response

```json
{
  "cod": "200",
  "cnt": 40,
  "list": [
    {
      "dt": 1606223802,
      "main": {
        "temp": 15.5,
        "feels_like": 14.8,
        "temp_min": 13.0,
        "temp_max": 17.0,
        "pressure": 1013,
        "humidity": 72
      },
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01d"
        }
      ],
      "clouds": { "all": 0 },
      "wind": { "speed": 3.5, "deg": 230 },
      "visibility": 10000,
      "pop": 0,
      "dt_txt": "2020-11-24 12:00:00"
    }
  ],
  "city": {
    "id": 2643743,
    "name": "London",
    "coord": { "lat": 51.5085, "lon": -0.1257 },
    "country": "GB",
    "timezone": 0,
    "sunrise": 1606203982,
    "sunset": 1606233982
  }
}
```

## Common Queries

Get 5-day forecast:
```
q=London,UK
```

Get limited forecast (10 timestamps):
```
q=Paris,FR&cnt=10
```

Get forecast in metric units:
```
lat=40.7128&lon=-74.0060&units=metric
```

## Documentation

See [OpenWeatherMap 5-Day Forecast API](https://openweathermap.org/forecast5) for full documentation.
