# Air Pollution Data

Access current, forecast and historical air pollution data.

## Endpoints

### Current Air Pollution
```
GET /data/2.5/air_pollution
```

### Air Pollution Forecast
```
GET /data/2.5/air_pollution/forecast
```

### Historical Air Pollution
```
GET /data/2.5/air_pollution/history
```

## Query Parameters

All endpoints require:
- **lat**: Latitude of the location
- **lon**: Longitude of the location

Historical endpoint also requires:
- **start**: Start date (Unix timestamp, UTC)
- **end**: End date (Unix timestamp, UTC)

## Air Quality Index (AQI)

The API returns an Air Quality Index (AQI) value:
- **1**: Good
- **2**: Fair
- **3**: Moderate
- **4**: Poor
- **5**: Very Poor

## Example Response

```json
{
  "coord": { "lon": -0.1257, "lat": 51.5085 },
  "list": [
    {
      "main": { "aqi": 2 },
      "components": {
        "co": 230.31,
        "no": 0.58,
        "no2": 19.53,
        "o3": 68.66,
        "so2": 0.43,
        "pm2_5": 8.31,
        "pm10": 12.01,
        "nh3": 0.52
      },
      "dt": 1606223802
    }
  ]
}
```

## Pollutant Components

All values are in μg/m³ (micrograms per cubic meter):
- **co**: Carbon monoxide
- **no**: Nitrogen monoxide
- **no2**: Nitrogen dioxide
- **o3**: Ozone
- **so2**: Sulphur dioxide
- **pm2_5**: Fine particles matter
- **pm10**: Coarse particulate matter
- **nh3**: Ammonia

## Common Queries

Get current air pollution:
```
lat=51.5085&lon=-0.1257
```

Get air pollution forecast:
```
lat=40.7128&lon=-74.0060
```

Get historical data (24 hours):
```
lat=48.8566&lon=2.3522&start=1606223802&end=1606310202
```

## Documentation

See [OpenWeatherMap Air Pollution API](https://openweathermap.org/api/air-pollution) for full documentation.
