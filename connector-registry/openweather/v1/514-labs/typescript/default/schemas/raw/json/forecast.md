# Weather Forecast

5 day forecast with data every 3 hours.

## Description

Get weather forecast for 5 days with data every 3 hours. Forecast is available for any location on Earth.

## API Endpoint

```
GET /data/2.5/forecast
```

## Query Parameters

You must provide one of the following to identify the location:

- `q`: City name, state code (US only) and country code divided by comma
- `lat` & `lon`: Geographic coordinates
- `id`: City ID
- `zip`: Zip/post code and country code divided by comma

Optional parameters:
- `cnt`: Number of timestamps to return (max 96, default all available)
- `units`: Units of measurement (standard, metric, imperial)
- `lang`: Language for weather description

## Common Use Cases

**Get 5-day forecast:**
```
q=London,uk
```

**Get next 24 hours (8 data points):**
```
q=Paris&cnt=8
```

**Forecast by coordinates:**
```
lat=48.8566&lon=2.3522
```

## Response Fields

- `cnt`: Number of forecast data points returned
- `list`: Array of forecast items (3-hour intervals)
  - `dt`: Forecast time (Unix timestamp)
  - `main`: Temperature, pressure, humidity
  - `weather`: Weather conditions
  - `clouds`: Cloudiness
  - `wind`: Wind parameters
  - `pop`: Probability of precipitation (0-1)
  - `dt_txt`: Forecast time (text format)
- `city`: City information including coordinates, country, timezone

## Data Points

Each forecast contains data for a 3-hour interval:
- 00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00

Maximum of 40 data points (5 days × 8 intervals).

## Rate Limits

Free tier: 60 calls/minute

## Documentation

https://openweathermap.org/forecast5
