# API Limits and Rate Limiting

## Free Tier Limits

The OpenWeather API free tier includes:

- **1,000 API calls per day**
- **60 calls per minute**
- Current weather data
- 5-day/3-hour forecast
- Air pollution data (current and forecast)
- Geocoding

## Rate Limiting

OpenWeather enforces rate limits:

- **60 calls per minute** for free accounts
- Exceeding limits returns HTTP 429 (Too Many Requests)
- Consider implementing client-side rate limiting for high-volume applications

### Implementing Rate Limiting

You can add rate limiting using the connector core's built-in features:

```typescript
conn.init({
  apiKey: 'YOUR_API_KEY',
  rateLimit: {
    requestsPerSecond: 1, // ~60 per minute
  },
})
```

## Paid Plans

OpenWeather offers several paid plans with higher limits:

- **Startup**: 3,000 calls/minute
- **Developer**: 10,000 calls/minute
- **Professional**: 100,000 calls/minute
- **Enterprise**: Custom limits

For more details, see [OpenWeather Pricing](https://openweathermap.org/price).

## Data Freshness

- **Current weather**: Updated every 10 minutes
- **Forecasts**: Updated every 3 hours
- **Air pollution**: Updated hourly

## Best Practices

1. **Cache responses**: Don't fetch the same data repeatedly
2. **Use appropriate update intervals**: Match data freshness to your needs
3. **Batch requests**: When possible, fetch data for multiple locations in sequence rather than parallel
4. **Monitor your usage**: Check your API usage in the OpenWeather dashboard
5. **Handle errors gracefully**: Implement retry logic with exponential backoff

## Error Responses

Common error codes:

- **401**: Invalid API key
- **404**: Location not found
- **429**: Rate limit exceeded (too many requests)
- **5xx**: Server errors (temporary, retry with backoff)

## Geographic Coverage

- **Weather data**: Global coverage
- **Air pollution**: Major cities worldwide
- **Geocoding**: Comprehensive coverage with local name variants

