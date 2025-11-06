# Air Pollution API

Get air quality data including Air Quality Index (AQI) and concentrations of various pollutants.

## API Endpoints

### Current Air Pollution
```
GET https://api.openweathermap.org/data/2.5/air_pollution
```

### Air Pollution Forecast
```
GET https://api.openweathermap.org/data/2.5/air_pollution/forecast
```

### Historical Air Pollution
```
GET https://api.openweathermap.org/data/2.5/air_pollution/history
```

## Parameters

- **lat**: Latitude (required)
- **lon**: Longitude (required)
- **start**: Start date (Unix timestamp, UTC) - for historical data
- **end**: End date (Unix timestamp, UTC) - for historical data

## Air Quality Index

The AQI is calculated based on concentrations of various pollutants:

- **1 - Good**: Air quality is satisfactory
- **2 - Fair**: Air quality is acceptable
- **3 - Moderate**: May affect sensitive individuals
- **4 - Poor**: Health effects may be experienced by everyone
- **5 - Very Poor**: Health alert: everyone may experience serious effects

## Pollutant Measurements

All measurements are in μg/m³:

- **CO**: Carbon monoxide
- **NO**: Nitrogen monoxide
- **NO2**: Nitrogen dioxide
- **O3**: Ozone
- **SO2**: Sulphur dioxide
- **PM2.5**: Fine particles matter (diameter ≤ 2.5 μm)
- **PM10**: Coarse particulate matter (diameter ≤ 10 μm)
- **NH3**: Ammonia

## Common Queries

Get current air pollution:
```
lat=51.5074&lon=-0.1278
```

Get air pollution forecast:
```
lat=51.5074&lon=-0.1278
```

Get historical data (last 24 hours):
```
lat=51.5074&lon=-0.1278&start=1635000000&end=1635086400
```

## Example Response

```json
{
  "coord": {
    "lon": -0.1257,
    "lat": 51.5085
  },
  "list": [
    {
      "dt": 1635000000,
      "main": {
        "aqi": 2
      },
      "components": {
        "co": 230.31,
        "no": 0.01,
        "no2": 14.87,
        "o3": 68.66,
        "so2": 0.64,
        "pm2_5": 5.23,
        "pm10": 7.01,
        "nh3": 0.82
      }
    }
  ]
}
```

## Health Recommendations by AQI

### Good (1)
Air quality is considered satisfactory. Outdoor activities are fine.

### Fair (2)
Air quality is acceptable. Unusually sensitive people should consider limiting prolonged outdoor exertion.

### Moderate (3)
Members of sensitive groups may experience health effects. The general public is less likely to be affected.

### Poor (4)
Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.

### Very Poor (5)
Health alert: everyone may experience more serious health effects. Avoid outdoor activities.
