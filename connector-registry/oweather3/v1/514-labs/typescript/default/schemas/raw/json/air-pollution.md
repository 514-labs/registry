# Air Pollution

Air pollution data including Air Quality Index (AQI) and concentration of pollutants.

## Description

Air pollution API provides current, forecast and historical air pollution data for any coordinates on the globe. Besides basic Air Quality Index, the API returns data about polluting gases such as Carbon monoxide (CO), Nitrogen monoxide (NO), Nitrogen dioxide (NO2), Ozone (O3), Sulphur dioxide (SO2), Ammonia (NH3), and particulates (PM2.5 and PM10).

## Endpoints

### Current Air Pollution
```
GET /air_pollution
```

### Forecast Air Pollution
```
GET /air_pollution/forecast
```

### Historical Air Pollution
```
GET /air_pollution/history
```

## Query Parameters

- `lat` - Latitude (required)
- `lon` - Longitude (required)
- `start` - Start date (Unix timestamp, UTC) - for historical data
- `end` - End date (Unix timestamp, UTC) - for historical data

## Common Queries

Get current air pollution for London:
```
lat=51.5074&lon=-0.1278
```

Get historical data:
```
lat=51.5074&lon=-0.1278&start=1606488670&end=1606747870
```

## Response Fields

- `coord` - Geographical coordinates
- `list` - Array of air pollution data points
  - `dt` - Date and time (Unix timestamp)
  - `main.aqi` - Air Quality Index (1-5)
  - `components` - Pollutant concentrations (μg/m³)
    - `co` - Carbon monoxide
    - `no` - Nitrogen monoxide
    - `no2` - Nitrogen dioxide
    - `o3` - Ozone
    - `so2` - Sulphur dioxide
    - `pm2_5` - Fine particles matter
    - `pm10` - Coarse particulate matter
    - `nh3` - Ammonia

## Air Quality Index Values

- **1** = Good
- **2** = Fair
- **3** = Moderate
- **4** = Poor
- **5** = Very Poor

## Example Response

```json
{
  "coord": {
    "lon": -0.1257,
    "lat": 51.5085
  },
  "list": [
    {
      "dt": 1605182400,
      "main": {
        "aqi": 2
      },
      "components": {
        "co": 230.31,
        "no": 0.21,
        "no2": 13.82,
        "o3": 68.66,
        "so2": 1.73,
        "pm2_5": 5.8,
        "pm10": 7.0,
        "nh3": 0.92
      }
    }
  ]
}
```
