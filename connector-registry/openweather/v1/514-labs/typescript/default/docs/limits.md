# Rate Limits

OpenWeather API has rate limits that vary by subscription tier.

## Free Tier

- **Calls per minute**: 60
- **Calls per month**: 1,000,000
- **Updates**: Every 10 minutes
- **Data availability**: Current weather, 5-day forecast (3-hour intervals)

## Paid Tiers

OpenWeather offers various paid tiers with higher limits:

- **Startup**: 60 calls/min, no monthly limit, 1-minute updates
- **Developer**: 600 calls/min, no monthly limit, 1-minute updates
- **Professional**: 3,000 calls/min, no monthly limit, 1-minute updates
- **Enterprise**: Custom limits

See [OpenWeather Pricing](https://openweathermap.org/price) for current pricing and features.

## Rate Limit Handling

The connector automatically handles rate limiting through the core framework:

```typescript
connector.init({
  apiKey: 'your_api_key',
  // Rate limiting is handled automatically by the core
})
```

## Best Practices

1. **Cache responses**: Weather data doesn't change every second, cache responses for at least 10 minutes
2. **Batch requests**: If you need data for multiple cities, request them sequentially with delays
3. **Monitor usage**: Keep track of your API usage in your OpenWeather account dashboard
4. **Use appropriate tier**: Upgrade if you consistently hit rate limits

## Error Responses

When rate limits are exceeded, you'll receive:

- HTTP Status: `429 Too Many Requests`
- Error message: "Your account temporary blocked due to exceeding of requests limitation of your subscription type"

## Checking Limits

Monitor your API usage in the OpenWeather dashboard:
- Log in to your account
- Navigate to "API keys" section
- View usage statistics for each API key
