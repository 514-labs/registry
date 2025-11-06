# 5 Day Weather Forecast

5 day forecast with data every 3 hours for any location on Earth.

## Description

5 day weather forecast includes weather forecast data with 3-hour step. The forecast is available in JSON or XML format.

## Query Parameters

- `q` - City name, state code (only for US), and country code divided by comma
- `lat` - Latitude coordinate
- `lon` - Longitude coordinate
- `id` - City ID
- `zip` - Zip/post code and country code divided by comma
- `cnt` - Number of timestamps to return (max 40, default all)
- `units` - Units of measurement (standard, metric, imperial)
- `lang` - Language for weather description

## Common Queries

Get 5-day forecast for London:
```
q=London,UK
```

Get 10 timestamps only:
```
q=Paris,FR&cnt=10
```

## API Endpoint

```
GET /forecast
```

## Response Fields

- `cod` - Internal parameter
- `message` - Internal parameter
- `cnt` - Number of lines returned
- `list` - Array of forecast data points (every 3 hours)
  - `dt` - Time of forecasted data (Unix timestamp)
  - `main` - Temperature, pressure, humidity
  - `weather` - Weather conditions
  - `clouds` - Cloudiness
  - `wind` - Wind data
  - `pop` - Probability of precipitation (0-1)
  - `dt_txt` - Time in ISO format
- `city` - City information (name, coordinates, country, etc.)

## Example Response

```json
{
  "cod": "200",
  "message": 0,
  "cnt": 40,
  "list": [
    {
      "dt": 1605182400,
      "main": {
        "temp": 15.5,
        "feels_like": 14.8,
        "temp_min": 13.9,
        "temp_max": 17.2,
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
      "clouds": {
        "all": 0
      },
      "wind": {
        "speed": 4.1,
        "deg": 80
      },
      "pop": 0.2,
      "dt_txt": "2024-11-06 12:00:00"
    }
  ],
  "city": {
    "id": 2643743,
    "name": "London",
    "coord": {
      "lat": 51.5085,
      "lon": -0.1257
    },
    "country": "GB",
    "timezone": 0,
    "sunrise": 1605164800,
    "sunset": 1605198000
  }
}
```
