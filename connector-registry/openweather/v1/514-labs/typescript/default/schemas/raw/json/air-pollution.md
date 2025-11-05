# Air Pollution Data

Air quality and pollution data for any coordinates.

## Description

Get current, forecast, and historical air pollution data. The data includes:
- Air Quality Index (AQI) on a 1-5 scale
- Concentrations of major pollutants (CO, NO, NO2, O3, SO2, PM2.5, PM10, NH3)

## Air Quality Index

- 1 = Good
- 2 = Fair
- 3 = Moderate
- 4 = Poor
- 5 = Very Poor

## Endpoints

Current air pollution:
```
GET /data/2.5/air_pollution?lat={lat}&lon={lon}
```

Forecast:
```
GET /data/2.5/air_pollution/forecast?lat={lat}&lon={lon}
```

Historical:
```
GET /data/2.5/air_pollution/history?lat={lat}&lon={lon}&start={start}&end={end}
```

## Query Parameters

- `lat` - Latitude (required)
- `lon` - Longitude (required)
- `start` - Start date (unix timestamp, for historical data)
- `end` - End date (unix timestamp, for historical data)
