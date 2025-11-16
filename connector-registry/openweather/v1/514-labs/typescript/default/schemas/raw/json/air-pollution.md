# Air Pollution Data

Get current, forecast, and historical air pollution data, including Air Quality Index (AQI) and pollutant concentrations.

## API Endpoints

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

## Parameters

- `lat`: Latitude (required)
- `lon`: Longitude (required)
- `start`: Start date (Unix timestamp, UTC) - for historical data only
- `end`: End date (Unix timestamp, UTC) - for historical data only

## Air Quality Index (AQI)

The AQI ranges from 1 to 5:

1. **Good**: Air quality is satisfactory
2. **Fair**: Air quality is acceptable
3. **Moderate**: Members of sensitive groups may experience health effects
4. **Poor**: Everyone may begin to experience health effects
5. **Very Poor**: Health alert; everyone may experience more serious health effects

## Pollutants

The API returns concentrations (μg/m³) for:

- **CO**: Carbon monoxide
- **NO**: Nitrogen monoxide
- **NO₂**: Nitrogen dioxide
- **O₃**: Ozone
- **SO₂**: Sulphur dioxide
- **PM2.5**: Fine particles matter (diameter < 2.5 μm)
- **PM10**: Coarse particulate matter (diameter < 10 μm)
- **NH₃**: Ammonia

## Example Request

```
GET /data/2.5/air_pollution?lat=51.5085&lon=-0.1257&appid=YOUR_API_KEY
```

## Example Response

```json
{
  "coord": { "lon": -0.1257, "lat": 51.5085 },
  "list": [
    {
      "main": { "aqi": 1 },
      "components": {
        "co": 201.94,
        "no": 0.01,
        "no2": 0.78,
        "o3": 68.66,
        "so2": 0.64,
        "pm2_5": 0.5,
        "pm10": 0.59,
        "nh3": 0.12
      },
      "dt": 1606488670
    }
  ]
}
```

## Common Use Cases

- Monitor air quality for health alerts
- Display AQI on weather apps
- Track pollution trends over time
- Health recommendations based on air quality
- Environmental monitoring and research
