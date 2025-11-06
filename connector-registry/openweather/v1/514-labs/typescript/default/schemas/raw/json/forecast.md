# 5 Day Weather Forecast

Get 5-day weather forecast with data every 3 hours.

## API Endpoint

```
GET /data/2.5/forecast
```

## Query Parameters

### Location (one required)
- `q` - City name (e.g., "London", "London,UK")
- `id` - City ID
- `lat` & `lon` - Geographic coordinates
- `zip` - ZIP/postal code with country code

### Optional Parameters
- `cnt` - Number of timestamps (max 40 for 5-day forecast)
- `units` - Temperature units: `standard`, `metric`, `imperial`
- `lang` - Language code

## Example Usage

```typescript
const forecast = await conn.forecast.get5Day3Hour({
  q: 'London,UK',
  units: 'metric',
  cnt: 8  // Get first 24 hours (8 * 3-hour intervals)
})

forecast.list.forEach(item => {
  console.log(`${item.dt_txt}: ${item.main.temp}°C, ${item.weather[0].description}`)
})
```

## Response Structure

- **cnt** - Number of forecast timestamps
- **list** - Array of forecast items with 3-hour intervals
  - Each item contains: temperature, weather conditions, wind, clouds, precipitation
  - **dt_txt** - Forecast time in readable format
  - **pop** - Probability of precipitation (0-1)
- **city** - Location information including sunrise/sunset
