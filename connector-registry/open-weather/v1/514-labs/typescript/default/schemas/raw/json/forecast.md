# 5-Day Weather Forecast

5-day weather forecast with data available in 3-hour intervals (40 timestamps).

## API Endpoint

```
GET https://api.openweathermap.org/data/2.5/forecast
```

## Common Queries

Get forecast by city name:
```
q=London,UK&cnt=10
```

Get forecast by coordinates:
```
lat=51.5074&lon=-0.1278
```

Limit number of forecast items:
```
cnt=16
```

## Parameters

- **q**: City name, state code, country code (e.g., "London,UK")
- **lat/lon**: Geographic coordinates
- **cnt**: Number of timestamps to return (max 96, defaults to 40)
- **units**: standard, metric, or imperial
- **lang**: Language code

## Response Structure

The response contains:
- **list**: Array of forecast items (every 3 hours)
  - **dt**: Forecast timestamp
  - **main**: Temperature, pressure, humidity
  - **weather**: Weather conditions
  - **clouds**: Cloudiness
  - **wind**: Wind data
  - **pop**: Probability of precipitation (0-1)
  - **dt_txt**: Human-readable timestamp
- **city**: City information including coordinates, timezone, sunrise/sunset

## Example Response

```json
{
  "cod": "200",
  "message": 0,
  "cnt": 2,
  "list": [
    {
      "dt": 1635000000,
      "main": {
        "temp": 288.15,
        "feels_like": 287.42,
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
      "wind": { "speed": 4.5, "deg": 230 },
      "pop": 0,
      "dt_txt": "2021-10-23 12:00:00"
    }
  ],
  "city": {
    "id": 2643743,
    "name": "London",
    "coord": { "lat": 51.5085, "lon": -0.1257 },
    "country": "GB",
    "timezone": 0,
    "sunrise": 1634976123,
    "sunset": 1635013456
  }
}
```
