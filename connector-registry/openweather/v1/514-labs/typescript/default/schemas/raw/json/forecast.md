# 5-Day Weather Forecast

5-day weather forecast with data every 3 hours.

## Description

Get a 5-day weather forecast with 3-hour intervals. The forecast includes:
- Temperature forecasts
- Weather conditions
- Wind data
- Probability of precipitation
- Atmospheric pressure and humidity

## Query Methods

Same as current weather:
- By city name: `q=London,UK`
- By coordinates: `lat=51.5074&lon=-0.1278`
- By city ID: `id=2643743`
- By ZIP code: `zip=10001,US`

## Additional Parameters

- `cnt` - Number of timestamps (max 40, default 40)

## API Endpoint

```
GET /data/2.5/forecast
```
