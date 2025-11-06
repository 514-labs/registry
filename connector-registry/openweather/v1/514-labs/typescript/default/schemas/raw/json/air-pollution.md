# Air Pollution Data

Get air quality and pollution data for any location.

## API Endpoints

```
GET /data/2.5/air_pollution          # Current air pollution
GET /data/2.5/air_pollution/forecast # Air pollution forecast
GET /data/2.5/air_pollution/history  # Historical air pollution
```

## Query Parameters

### Required
- `lat` - Latitude
- `lon` - Longitude

### For Historical Data
- `start` - Start date (Unix timestamp, UTC)
- `end` - End date (Unix timestamp, UTC)

## Air Quality Index (AQI)

The API returns an Air Quality Index from 1 to 5:

1. **Good** - Air quality is satisfactory
2. **Fair** - Air quality is acceptable
3. **Moderate** - Members of sensitive groups may experience health effects
4. **Poor** - Everyone may begin to experience health effects
5. **Very Poor** - Health alert: everyone may experience more serious health effects

## Pollutant Components

All concentrations are measured in **μg/m³** (micrograms per cubic meter):

- **CO** - Carbon monoxide
- **NO** - Nitrogen monoxide
- **NO2** - Nitrogen dioxide
- **O3** - Ozone
- **SO2** - Sulphur dioxide
- **PM2.5** - Fine particles matter
- **PM10** - Coarse particulate matter
- **NH3** - Ammonia

## Example Usage

```typescript
// Current air pollution
const current = await conn.airPollution.getCurrent({
  lat: 51.5074,
  lon: -0.1278
})
console.log(`AQI: ${current.list[0].main.aqi}`)
console.log(`PM2.5: ${current.list[0].components.pm2_5} μg/m³`)

// Forecast
const forecast = await conn.airPollution.getForecast({
  lat: 51.5074,
  lon: -0.1278
})

// Historical (last 7 days)
const end = Math.floor(Date.now() / 1000)
const start = end - (7 * 24 * 60 * 60)
const historical = await conn.airPollution.getHistorical({
  lat: 51.5074,
  lon: -0.1278,
  start,
  end
})
```
