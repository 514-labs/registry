# Getting Started with OpenWeather v2.5 Connector

This guide will help you get up and running with the OpenWeather v2.5 connector in just a few minutes.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Setup](#quick-setup)
- [Your First API Call](#your-first-api-call)
- [Basic Usage Patterns](#basic-usage-patterns)
- [Error Handling](#error-handling)
- [Rate Limit Management](#rate-limit-management)
- [Next Steps](#next-steps)

## Prerequisites

Before you begin, ensure you have:

1. **Node.js**: Version 16.0.0 or higher
2. **TypeScript**: Version 5.0.0 or higher (if using TypeScript)
3. **OpenWeather API Key**: Free account provides 1,000 calls/day

### Get Your API Key

1. Go to [OpenWeather API](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to your API keys section
4. Copy your API key (it may take a few minutes to activate)

## Quick Setup

### Step 1: Install the Connector

```bash
# Clone the connector factory repository
git clone https://github.com/connector-factory/connector-factory.git
cd connector-factory

# Copy the OpenWeather connector to your project
cp -r registry/openweather/v2.5/fiveonefour/typescript/ ./openweather-connector/
cd ./openweather-connector/

# Install dependencies
npm install
```

### Step 2: Set Up Environment Variables

Create a `.env.local` file:

```bash
# .env.local
OPENWEATHER_API_KEY=your_api_key_here
OPENWEATHER_UNITS=metric
OPENWEATHER_LANGUAGE=en
```

### Step 3: Verify Installation

```bash
# Run offline tests to verify everything is working
npm run test:offline

# Run a quick integration test (uses 1 API call)
npm run test:integration:conservative
```

## Your First API Call

Let's make your first weather API call:

### JavaScript/Node.js

```javascript
// quick-start.js
const { createOpenWeatherClient } = require('./src/config');

async function getWeather() {
  try {
    // Create client (automatically uses environment variables)
    const client = await createOpenWeatherClient();
    
    // Get current weather for New York City
    const weather = await client.getCurrentWeather(40.7128, -74.0060);
    
    console.log(`Weather in ${weather.location.name}:`);
    console.log(`Temperature: ${weather.current.temperature}°C`);
    console.log(`Description: ${weather.current.weather[0].description}`);
    console.log(`Humidity: ${weather.current.humidity}%`);
    
  } catch (error) {
    console.error('Error getting weather:', error.message);
  }
}

getWeather();
```

### TypeScript

```typescript
// quick-start.ts
import { createOpenWeatherClient } from './src/config';
import { ConnectorError } from './src/connector-types';

async function getWeather(): Promise<void> {
  try {
    // Create client with TypeScript support
    const client = await createOpenWeatherClient();
    
    // Get current weather for London
    const weather = await client.getCurrentWeather(51.5074, -0.1278);
    
    console.log(`Weather in ${weather.location.name}:`);
    console.log(`Temperature: ${weather.current.temperature}°C`);
    console.log(`Feels like: ${weather.current.feels_like}°C`);
    console.log(`Description: ${weather.current.weather[0].description}`);
    
    // Access wind data (if available)
    if (weather.current.wind) {
      console.log(`Wind: ${weather.current.wind.speed} m/s`);
    }
    
  } catch (error) {
    if (error instanceof ConnectorError) {
      console.error(`Weather API Error: ${error.message}`);
      console.error(`Error Code: ${error.code}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

getWeather();
```

### Run Your First Script

```bash
# For JavaScript
node quick-start.js

# For TypeScript
npx ts-node quick-start.ts
```

## Basic Usage Patterns

### 1. Current Weather

```typescript
import { createOpenWeatherClient } from './src/config';

const client = await createOpenWeatherClient();

// Get weather by coordinates
const weather = await client.getCurrentWeather(40.7128, -74.0060);

console.log({
  location: weather.location.name,
  temperature: weather.current.temperature,
  description: weather.current.weather[0].description,
  humidity: weather.current.humidity,
  pressure: weather.current.pressure,
  windSpeed: weather.current.wind?.speed,
  sunrise: weather.current.sun?.sunrise,
  sunset: weather.current.sun?.sunset
});
```

### 2. Weather Forecast

```typescript
// Get 5-day forecast
const forecast = await client.getForecast(51.5074, -0.1278, 5);

console.log(`5-day forecast for ${forecast.location.name}:`);
forecast.daily.forEach((day, index) => {
  console.log(`Day ${index + 1}: ${day.temperature.max}°C / ${day.temperature.min}°C - ${day.weather[0].description}`);
});
```

### 3. Hourly Forecast

```typescript
// Get 24-hour forecast (3-hour intervals in v2.5)
const hourly = await client.getHourlyForecast(35.6762, 139.6503, 24);

console.log(`24-hour forecast for ${hourly.location.name}:`);
hourly.hourly.forEach((hour, index) => {
  const time = hour.timestamp.toLocaleTimeString();
  console.log(`${time}: ${hour.temperature}°C - ${hour.weather[0].description}`);
});
```

### 4. Multiple Locations

```typescript
const locations = [
  { name: 'New York', lat: 40.7128, lon: -74.0060 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 }
];

for (const location of locations) {
  const weather = await client.getCurrentWeather(location.lat, location.lon);
  console.log(`${location.name}: ${weather.current.temperature}°C`);
  
  // Small delay to respect rate limits
  await new Promise(resolve => setTimeout(resolve, 1000));
}
```

## Error Handling

The connector provides structured error handling with specific error types:

### Basic Error Handling

```typescript
import { ConnectorError, ErrorCode } from './src/connector-types';

try {
  const weather = await client.getCurrentWeather(40.7128, -74.0060);
  console.log(weather);
} catch (error) {
  if (error instanceof ConnectorError) {
    switch (error.code) {
      case ErrorCode.AUTHENTICATION_FAILED:
        console.error('❌ Invalid API key. Check your OPENWEATHER_API_KEY.');
        break;
      case ErrorCode.RATE_LIMITED:
        console.error('⏰ Rate limit exceeded. Wait before making more requests.');
        break;
      case ErrorCode.INVALID_COORDINATES:
        console.error('📍 Invalid coordinates. Check lat/lon values.');
        break;
      case ErrorCode.NETWORK_ERROR:
        console.error('🌐 Network error. Check your internet connection.');
        break;
      default:
        console.error(`🚫 API error: ${error.message}`);
    }
  } else {
    console.error('💥 Unexpected error:', error);
  }
}
```

### Common Error Scenarios

```typescript
// 1. Invalid coordinates
try {
  await client.getCurrentWeather(91, -200); // Invalid lat/lon
} catch (error) {
  // Will throw INVALID_COORDINATES error
}

// 2. Invalid forecast period
try {
  await client.getForecast(40.7128, -74.0060, 10); // Too many days
} catch (error) {
  // Will throw VALIDATION_ERROR
}

// 3. Premium features on free tier
try {
  await client.getHistoricalWeather(40.7128, -74.0060, new Date('2023-01-01'));
} catch (error) {
  // Will throw SUBSCRIPTION_EXPIRED error
}
```

## Rate Limit Management

The connector automatically manages rate limits, but here are best practices:

### Understanding Limits

- **Free Tier**: 1,000 calls/day (about 41 calls/hour)
- **Per Minute**: No official limit, but conservative approach recommended
- **Connector Default**: 60 requests/minute with burst capacity of 10

### Best Practices

```typescript
// 1. Use conservative configuration for production
const client = new OpenWeatherClient({
  apiKey: process.env.OPENWEATHER_API_KEY!,
  rateLimit: {
    requestsPerMinute: 30,  // More conservative
    burstCapacity: 5,
    adaptiveFromHeaders: true
  }
});

// 2. Add delays between requests when making multiple calls
const cities = ['New York', 'London', 'Tokyo'];
for (const city of cities) {
  const weather = await client.getCurrentWeather(/* coordinates */);
  console.log(weather);
  
  // Wait 2 seconds between requests
  await new Promise(resolve => setTimeout(resolve, 2000));
}

// 3. Monitor your usage
const response = await client.getCurrentWeather(40.7128, -74.0060);
if (response.meta.rateLimit) {
  console.log(`Remaining calls: ${response.meta.rateLimit.remaining}`);
}
```

### Request Cancellation

```typescript
// Cancel requests that take too long
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000); // Cancel after 5 seconds

try {
  const weather = await client.getCurrentWeather(40.7128, -74.0060, {
    signal: controller.signal,
    timeout: 3000  // 3 second timeout
  });
} catch (error) {
  if (error.code === ErrorCode.NETWORK_ERROR) {
    console.log('Request timed out or was cancelled');
  }
}
```

## Practical Examples

### Weather Dashboard

```typescript
async function createWeatherDashboard() {
  const client = await createOpenWeatherClient();
  
  // Major world cities
  const cities = [
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { name: 'Sydney', lat: -33.8688, lon: 151.2093 }
  ];
  
  console.log('🌍 Global Weather Dashboard');
  console.log('==========================\n');
  
  for (const city of cities) {
    try {
      const weather = await client.getCurrentWeather(city.lat, city.lon);
      
      console.log(`📍 ${city.name}`);
      console.log(`   Temperature: ${weather.current.temperature}°C`);
      console.log(`   Weather: ${weather.current.weather[0].description}`);
      console.log(`   Humidity: ${weather.current.humidity}%`);
      console.log('');
      
      // Respectful delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.error(`❌ Failed to get weather for ${city.name}:`, error.message);
    }
  }
}

createWeatherDashboard();
```

### Weather Alerts

```typescript
async function checkWeatherAlerts(lat: number, lon: number) {
  const client = await createOpenWeatherClient();
  
  try {
    const weather = await client.getCurrentWeather(lat, lon);
    const temp = weather.current.temperature;
    const conditions = weather.current.weather[0].main;
    
    // Temperature alerts
    if (temp > 35) {
      console.log('🔥 HEAT WARNING: Very hot weather detected!');
    } else if (temp < -10) {
      console.log('🧊 COLD WARNING: Very cold weather detected!');
    }
    
    // Weather condition alerts
    if (['Thunderstorm', 'Tornado'].includes(conditions)) {
      console.log('⚡ SEVERE WEATHER: Dangerous conditions detected!');
    } else if (['Snow', 'Blizzard'].includes(conditions)) {
      console.log('❄️ WINTER WEATHER: Snow conditions detected!');
    }
    
    return weather;
    
  } catch (error) {
    console.error('Failed to check weather alerts:', error.message);
    return null;
  }
}

// Check alerts for your location
checkWeatherAlerts(40.7128, -74.0060); // New York
```

## Next Steps

Now that you have the basics working, explore these advanced topics:

### 1. Advanced Configuration
- Read [Configuration Guide](./CONFIGURATION.md) for production settings
- Learn about rate limiting and circuit breaker patterns
- Set up monitoring and alerting

### 2. Error Handling
- Review [Error Handling Guide](./ERROR_HANDLING.md) for comprehensive error patterns
- Implement retry logic and fallback strategies
- Set up error monitoring

### 3. Testing
- Run the full test suite: `npm test`
- Review test patterns in the `tests/` directory
- Create your own test scenarios

### 4. Advanced Usage
- Explore the [API Reference](./API.md) for all available methods
- Check out [examples/](../examples/) for more usage patterns
- Review the schema documentation for data structures

### 5. Production Deployment
- Configure rate limiting for your use case
- Set up monitoring and health checks
- Implement caching strategies for frequently requested locations

### Common Next Steps

```bash
# Explore examples
npm run example:basic
npm run example:transformation

# Run comprehensive tests
npm test
npm run test:performance

# Check API documentation
cat docs/API.md

# Review configuration options
cat docs/CONFIGURATION.md
```

## Troubleshooting

### Common Issues

**1. API Key Not Working**
```bash
# Test API key manually
curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY"
```

**2. Rate Limit Errors**
```typescript
// Use more conservative settings
const client = new OpenWeatherClient({
  apiKey: process.env.OPENWEATHER_API_KEY!,
  rateLimit: { requestsPerMinute: 20 }
});
```

**3. Network Timeouts**
```typescript
// Increase timeout
const weather = await client.getCurrentWeather(lat, lon, {
  timeout: 10000  // 10 seconds
});
```

**4. TypeScript Errors**
```bash
# Check TypeScript configuration
npm run typecheck

# Make sure you have the right types
npm install @types/node
```

### Getting Help

- Check the [API documentation](./API.md) for method details
- Review [error codes](./ERROR_HANDLING.md) for troubleshooting
- Run `npm run test:offline` to test without API calls
- Check the [examples](../examples/) directory for usage patterns

---

**🎉 Congratulations!** You now have a working OpenWeather connector. The connector handles rate limiting, error recovery, and provides a production-ready foundation for weather-based applications.