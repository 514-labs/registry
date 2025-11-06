# 5 Day / 3 Hour Weather Forecast

5 day forecast with data every 3 hours. Forecast is available in JSON or XML format.

## API Endpoint

```
GET /data/2.5/forecast
```

## Parameters

- `q`: City name, state code and country code divided by comma
- `lat`, `lon`: Geographical coordinates
- `id`: City ID
- `zip`: ZIP/post code and country code divided by comma
- `cnt`: Number of timestamps to return (max 96)
- `units`: Units of measurement (`standard`, `metric`, `imperial`)
- `lang`: Language for weather descriptions

## Response Structure

The response contains:
- `list`: Array of forecast items (every 3 hours)
- `city`: Information about the location
- `cnt`: Number of forecast items

Each forecast item includes:
- Weather conditions
- Temperature (min/max/feels like)
- Wind speed and direction
- Cloudiness
- Probability of precipitation
- Rain/snow volume (if applicable)

## Example Request

```
GET /data/2.5/forecast?q=London&units=metric&appid=YOUR_API_KEY
```

## Example Response

```json
{
  "cod": "200",
  "cnt": 40,
  "list": [
    {
      "dt": 1606488670,
      "main": {
        "temp": 15.5,
        "feels_like": 14.8,
        "temp_min": 13.9,
        "temp_max": 16.7,
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
      "wind": { "speed": 3.6, "deg": 230 },
      "clouds": { "all": 0 },
      "pop": 0,
      "dt_txt": "2020-11-27 15:00:00"
    }
  ],
  "city": {
    "id": 2643743,
    "name": "London",
    "coord": { "lat": 51.5085, "lon": -0.1257 },
    "country": "GB",
    "timezone": 0,
    "sunrise": 1606461821,
    "sunset": 1606492960
  }
}
```

## Common Use Cases

- Weather planning for events
- Travel weather forecasting
- Agricultural planning
- Outdoor activity scheduling
- Multi-day weather trends
