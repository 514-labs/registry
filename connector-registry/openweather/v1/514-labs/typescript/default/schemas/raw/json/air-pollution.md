# Air Pollution Data

Air pollution data including Air Quality Index and pollutant concentrations.

## Description

Access current, forecast, and historical air pollution data. The Air Pollution API provides current air quality index, pollutant gases concentration (CO, NO, NO2, O3, SO2, NH3), and particulate matter concentrations (PM2.5, PM10).

## API Endpoints

```
GET /data/2.5/air_pollution          # Current air pollution
GET /data/2.5/air_pollution/forecast # Forecast (up to 4 days)
GET /data/2.5/air_pollution/history  # Historical (from Nov 27, 2020)
```

## Query Parameters

**Required:**
- `lat`: Latitude
- `lon`: Longitude

**For historical data:**
- `start`: Start date (Unix timestamp, UTC)
- `end`: End date (Unix timestamp, UTC)

## Air Quality Index (AQI)

The AQI is a qualitative assessment of air quality:

| AQI | Level | Description |
|-----|-------|-------------|
| 1 | Good | Air quality is satisfactory |
| 2 | Fair | Acceptable air quality |
| 3 | Moderate | Members of sensitive groups may experience health effects |
| 4 | Poor | Everyone may begin to experience health effects |
| 5 | Very Poor | Health alert: everyone may experience more serious health effects |

## Pollutants

All concentrations are measured in μg/m³ (micrograms per cubic meter):

- **CO**: Carbon monoxide
- **NO**: Nitrogen monoxide
- **NO2**: Nitrogen dioxide
- **O3**: Ozone
- **SO2**: Sulphur dioxide
- **PM2.5**: Fine particles matter (diameter < 2.5 μm)
- **PM10**: Coarse particulate matter (diameter < 10 μm)
- **NH3**: Ammonia

## Common Use Cases

**Get current air pollution:**
```
lat=51.5074&lon=-0.1278
```

**Get air pollution forecast:**
```
lat=35.6762&lon=139.6503
```

**Get historical data (last 24 hours):**
```
lat=40.7128&lon=-74.0060&start=1606435200&end=1606521600
```

## Historical Data

Historical air pollution data is available from November 27, 2020.

## Rate Limits

Free tier: 60 calls/minute

## Documentation

https://openweathermap.org/api/air-pollution
