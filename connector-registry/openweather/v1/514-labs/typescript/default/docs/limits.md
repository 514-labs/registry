# Rate Limits and API Constraints

## Rate Limits

OpenWeatherMap enforces different rate limits based on your subscription plan.

### Free Tier
- **60 calls per minute**
- **1,000,000 calls per month**

### Paid Plans
Higher rate limits are available with paid subscriptions. See [OpenWeatherMap Pricing](https://openweathermap.org/price) for details.

## Response Headers

OpenWeatherMap does not include standard rate limit headers in responses. Monitor your usage through your account dashboard at [OpenWeatherMap](https://home.openweathermap.org/subscriptions).

## API Constraints

### Current Weather
- Single location per request
- No pagination (returns single result)
- Can query by:
  - City name
  - Geographic coordinates (lat/lon)
  - City ID
  - ZIP/postal code

### 5-Day Forecast
- Returns up to 40 timestamps (5 days × 8 timestamps per day)
- 3-hour intervals
- Can limit results using `cnt` parameter
- Returns list of forecasts in a single response

### Air Pollution
- Current data: single timestamp
- Forecast: up to 4 days (96 hours)
- Historical: limited to previous data (depends on subscription)
- Requires geographic coordinates (lat/lon)

### Geocoding
- Direct geocoding: up to 5 locations per request (configurable via `limit`)
- Reverse geocoding: up to 5 locations per request (configurable via `limit`)
- ZIP code lookup: single location per request

## Best Practices

1. **Cache Results**: Weather data doesn't change frequently. Cache results for at least 10 minutes.

2. **Batch Requests**: If fetching data for multiple locations, implement queuing to stay within rate limits.

3. **Error Handling**: Implement exponential backoff for rate limit errors (HTTP 429).

4. **Use Appropriate Updates**:
   - Current weather: Update every 10-30 minutes
   - Forecasts: Update every 1-3 hours
   - Air pollution: Update every 1 hour

5. **Monitor Usage**: Regularly check your API usage in the OpenWeatherMap dashboard.

## Error Responses

### 401 Unauthorized
- Invalid API key
- API key not activated yet (wait a few hours after signup)

### 404 Not Found
- City/location not found
- Invalid coordinates

### 429 Too Many Requests
- Rate limit exceeded
- Wait before retrying

Example error handling:

```typescript
try {
  const weather = await connector.weather.get({ q: 'London,UK' })
} catch (error: any) {
  if (error.status === 401) {
    console.error('Invalid API key')
  } else if (error.status === 404) {
    console.error('Location not found')
  } else if (error.status === 429) {
    console.error('Rate limit exceeded, wait before retrying')
  }
}
```

