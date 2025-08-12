# OpenWeather v2.5 API Documentation

Complete reference for all methods, interfaces, and configuration options with real-world usage examples.

## Table of Contents

- [Client Creation](#client-creation)
- [Core Weather Methods](#core-weather-methods)
- [Lifecycle Methods](#lifecycle-methods)
- [Configuration](#configuration)
- [Response Types](#response-types)
- [Error Handling](#error-handling)
- [Advanced Usage Patterns](#advanced-usage-patterns)
- [Performance Optimization](#performance-optimization)
- [Real-World Examples](#real-world-examples)

## Client Creation

### `createOpenWeatherClient()`

Creates a configured OpenWeather client using environment variables.

```typescript
import { createOpenWeatherClient } from './src/config';

const client = await createOpenWeatherClient();
```

**Environment Variables Required:**
- `OPENWEATHER_API_KEY`: Your OpenWeather API key

**Returns:** `Promise<OpenWeatherClient>`

### `new OpenWeatherClient(config)`

Creates a client with custom configuration.

```typescript
import { OpenWeatherClient } from './src/client';

const client = new OpenWeatherClient({
  apiKey: 'your-api-key',
  units: 'metric',
  language: 'en',
  rateLimit: {
    requestsPerMinute: 60,
    burstCapacity: 10
  }
});
```

## Core Weather Methods

### `getCurrentWeather(lat, lon, options?)`

Retrieves current weather conditions for specified coordinates.

```typescript
getCurrentWeather(
  lat: number,      // Latitude (-90 to 90)
  lon: number,      // Longitude (-180 to 180)
  options?: WeatherRequestOptions
): Promise<WeatherResponse>
```

**Example:**
```typescript
const weather = await client.getCurrentWeather(40.7128, -74.0060);

console.log(`Location: ${weather.location.name}`);
console.log(`Temperature: ${weather.current.temperature}°C`);
console.log(`Feels like: ${weather.current.feels_like}°C`);
console.log(`Humidity: ${weather.current.humidity}%`);
console.log(`Wind: ${weather.current.wind?.speed || 0} m/s`);
console.log(`Weather: ${weather.current.weather[0].description}`);
```

**Response Structure:**
```typescript
interface WeatherResponse {
  location: LocationInfo;
  current: CurrentWeather;
  alerts?: WeatherAlert[];
}
```

### `getForecast(lat, lon, days?, options?)`

Retrieves daily weather forecast for up to 5 days.

```typescript
getForecast(
  lat: number,      // Latitude (-90 to 90)
  lon: number,      // Longitude (-180 to 180)
  days?: number,    // Number of days (1-5, default: 5)
  options?: WeatherRequestOptions
): Promise<ForecastResponse>
```

**Example:**
```typescript
const forecast = await client.getForecast(51.5074, -0.1278, 3);

console.log(`Location: ${forecast.location.name}`);
forecast.daily.forEach((day, index) => {
  const date = day.date.toLocaleDateString();
  const high = day.temperature.max;
  const low = day.temperature.min;
  const weather = day.weather[0].description;
  
  console.log(`Day ${index + 1} (${date}): ${high}°C / ${low}°C - ${weather}`);
});
```

**Response Structure:**
```typescript
interface ForecastResponse {
  location: LocationInfo;
  current?: CurrentWeather;
  daily: DailyWeather[];
  alerts?: WeatherAlert[];
}
```

### `getHourlyForecast(lat, lon, hours?, options?)`

Retrieves hourly weather forecast (3-hour intervals in v2.5).

```typescript
getHourlyForecast(
  lat: number,      // Latitude (-90 to 90)
  lon: number,      // Longitude (-180 to 180)  
  hours?: number,   // Number of hours (1-120, default: 24)
  options?: WeatherRequestOptions
): Promise<HourlyForecastResponse>
```

**Example:**
```typescript
const hourly = await client.getHourlyForecast(35.6762, 139.6503, 24);

console.log(`Location: ${hourly.location.name}`);
console.log('Next 24 hours (3-hour intervals):');

hourly.hourly.forEach((hour, index) => {
  const time = hour.timestamp.toLocaleTimeString();
  const temp = hour.temperature;
  const weather = hour.weather[0].description;
  
  console.log(`${time}: ${temp}°C - ${weather}`);
});
```

**Note:** OpenWeather v2.5 provides forecasts in 3-hour intervals, not true hourly data.

**Response Structure:**
```typescript
interface HourlyForecastResponse {
  location: LocationInfo;
  current?: CurrentWeather;
  hourly: HourlyWeather[];
}
```

### Premium Methods (Not Available in Free Tier)

#### `getMinutelyForecast(lat, lon, options?)`

```typescript
// Throws ConnectorError - not available in v2.5 free tier
await client.getMinutelyForecast(40.7128, -74.0060);
// Error: Minutely forecasts not available in OpenWeather v2.5 free tier
```

#### `getHistoricalWeather(lat, lon, date, options?)`

```typescript
// Throws ConnectorError - requires paid subscription
await client.getHistoricalWeather(40.7128, -74.0060, new Date('2023-01-01'));
// Error: Historical weather data requires paid subscription
```

#### `getDailySummary(lat, lon, date, options?)`

```typescript
// Throws ConnectorError - requires paid subscription
await client.getDailySummary(40.7128, -74.0060, new Date('2023-01-01'));
// Error: Daily summary data requires paid subscription
```

## Lifecycle Methods

### `initialize()`

Initializes the connector and validates API key with a test request.

```typescript
await client.initialize();
console.log('Client initialized and API key validated');
```

**Throws:** `ConnectorError` if API key is invalid or API is unreachable.

### `connect()`

Establishes connection (calls initialize if not already connected).

```typescript
await client.connect();
console.log('Connected:', client.isConnected()); // true
```

### `disconnect()`

Cleanly disconnects the client.

```typescript
await client.disconnect();
console.log('Connected:', client.isConnected()); // false
```

### `isConnected()`

Returns current connection status.

```typescript
const connected = client.isConnected(); // boolean
```

## Configuration

### OpenWeatherConfig Interface

```typescript
interface OpenWeatherConfig {
  // Required
  apiKey: string;                    // OpenWeather API key
  
  // API Configuration
  baseURL?: string;                  // Default: 'https://api.openweathermap.org/data/2.5'
  timeout?: number;                  // Request timeout (ms, default: 30000)
  userAgent?: string;                // User agent string
  units?: 'standard' | 'metric' | 'imperial';  // Default: 'metric'
  language?: string;                 // Default: 'en'
  
  // Rate Limiting (Critical for 1k/day limit)
  rateLimit?: {
    requestsPerMinute?: number;      // Default: 60
    burstCapacity?: number;          // Default: 10
    adaptiveFromHeaders?: boolean;   // Default: true
  };
  
  // Circuit Breaker
  circuitBreaker?: {
    failureThreshold?: number;       // Default: 5
    resetTimeout?: number;           // Default: 60000ms
    successThreshold?: number;       // Default: 3
  };
  
  // Retry Logic
  retries?: {
    maxRetries?: number;             // Default: 3
    baseDelay?: number;              // Default: 1000ms
    maxDelay?: number;               // Default: 30000ms
  };
  
  // Request Headers
  defaultHeaders?: Record<string, string>;
}
```

### WeatherRequestOptions Interface

```typescript
interface WeatherRequestOptions {
  timeout?: number;                  // Override default timeout
  signal?: AbortSignal;             // For request cancellation
  units?: 'standard' | 'metric' | 'imperial';  // Override default units
  language?: string;                // Override default language
}
```

### Example Configurations

#### Production Configuration
```typescript
const productionConfig: OpenWeatherConfig = {
  apiKey: process.env.OPENWEATHER_API_KEY!,
  timeout: 30000,
  rateLimit: {
    requestsPerMinute: 50,           // Conservative for production
    burstCapacity: 5,
    adaptiveFromHeaders: true
  },
  circuitBreaker: {
    failureThreshold: 3,             // More sensitive in production
    resetTimeout: 120000,            // 2 minutes
    successThreshold: 5
  },
  retries: {
    maxRetries: 2,                   // Fewer retries to save API calls
    baseDelay: 2000,
    maxDelay: 10000
  }
};
```

#### Development Configuration
```typescript
const devConfig: OpenWeatherConfig = {
  apiKey: process.env.OPENWEATHER_API_KEY!,
  timeout: 10000,                    // Faster timeout for dev
  rateLimit: {
    requestsPerMinute: 30,           // More conservative for testing
    burstCapacity: 3
  },
  defaultHeaders: {
    'X-Environment': 'development'
  }
};
```

## Response Types

### LocationInfo

```typescript
interface LocationInfo {
  latitude: number;                  // Geographic latitude
  longitude: number;                 // Geographic longitude
  timezone: string;                  // Timezone identifier (e.g., "UTC+00:00")
  timezone_offset: number;           // Timezone offset in seconds
  name?: string;                     // City name (if available)
  country?: string;                  // Country code (ISO 3166)
}
```

### CurrentWeather

```typescript
interface CurrentWeather {
  timestamp: Date;                   // Observation time
  temperature: number;               // Temperature in specified units
  feels_like: number;                // Perceived temperature
  humidity: number;                  // Humidity percentage (0-100)
  pressure?: number;                 // Atmospheric pressure (hPa)
  dew_point?: number;                // Dew point temperature
  uvi?: number;                      // UV Index (not available in v2.5)
  clouds?: number;                   // Cloud coverage percentage (0-100)
  visibility?: number;               // Visibility in kilometers
  wind?: WindInfo;                   // Wind information
  weather: WeatherCondition[];       // Weather conditions array
  sun?: SunInfo;                     // Sunrise/sunset information
}
```

### DailyWeather

```typescript
interface DailyWeather {
  date: Date;                        // Forecast date
  summary?: string;                  // Weather summary
  temperature: {
    day: number;                     // Day temperature
    min: number;                     // Minimum temperature
    max: number;                     // Maximum temperature
    night?: number;                  // Night temperature
    evening?: number;                // Evening temperature
    morning?: number;                // Morning temperature
  };
  feels_like?: {
    day: number;                     // Day perceived temperature
    night?: number;                  // Night perceived temperature
    evening?: number;                // Evening perceived temperature
    morning?: number;                // Morning perceived temperature
  };
  humidity: number;                  // Humidity percentage
  pressure?: number;                 // Atmospheric pressure
  wind?: WindInfo;                   // Wind information
  weather: WeatherCondition[];       // Weather conditions
  clouds?: number;                   // Cloud coverage percentage
  precipitation?: {
    probability: number;             // Precipitation probability (0-1)
    rain?: number;                   // Rain amount (mm)
    snow?: number;                   // Snow amount (mm)
  };
  uvi?: number;                      // UV Index
  sun?: SunInfo;                     // Sun/moon information
}
```

### HourlyWeather

```typescript
interface HourlyWeather {
  timestamp: Date;                   // Forecast time
  temperature: number;               // Temperature
  feels_like: number;                // Perceived temperature
  humidity: number;                  // Humidity percentage
  pressure?: number;                 // Atmospheric pressure
  dew_point?: number;                // Dew point temperature
  uvi?: number;                      // UV Index
  clouds?: number;                   // Cloud coverage percentage
  visibility?: number;               // Visibility in kilometers
  wind?: WindInfo;                   // Wind information
  weather: WeatherCondition[];       // Weather conditions
  precipitation?: {
    probability: number;             // Precipitation probability (0-1)
    rain?: number;                   // Rain amount (mm)
    snow?: number;                   // Snow amount (mm)
  };
}
```

### Supporting Types

#### WindInfo
```typescript
interface WindInfo {
  speed: number;                     // Wind speed in m/s
  direction?: number;                // Wind direction (0-360 degrees)
  gust?: number;                     // Wind gust speed in m/s
}
```

#### SunInfo
```typescript
interface SunInfo {
  sunrise?: Date;                    // Sunrise time
  sunset?: Date;                     // Sunset time
  moonrise?: Date;                   // Moonrise time (premium)
  moonset?: Date;                    // Moonset time (premium)
  moon_phase?: number;               // Moon phase (0-1, premium)
}
```

#### WeatherCondition
```typescript
interface WeatherCondition {
  id: number;                        // Weather condition ID
  main: string;                      // Main weather category
  description: string;               // Weather description
  icon: string;                      // Weather icon code
}
```

## Error Handling

### ConnectorError Class

All errors thrown by the connector extend the `ConnectorError` class:

```typescript
class ConnectorError extends Error {
  code: ErrorCode;                   // Structured error code
  statusCode?: number;               // HTTP status code (if applicable)
  requestId?: string;                // Unique request identifier
  source?: ErrorSource;              // Error source category
  details?: any;                     // Additional error details
  
  // Type guards
  isAuthError(): boolean;            // Authentication errors
  isRateLimit(): boolean;            // Rate limiting errors
  isValidationError(): boolean;      // Input validation errors
  
  // Properties
  retryable: boolean;                // Whether error is retryable
}
```

### Error Codes

```typescript
enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',                    // Network/timeout issues
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',   // Invalid API key
  RATE_LIMITED = 'RATE_LIMITED',                      // Rate limit exceeded
  VALIDATION_ERROR = 'VALIDATION_ERROR',              // Invalid parameters
  CIRCUIT_BREAKER_OPEN = 'CIRCUIT_BREAKER_OPEN',     // Circuit breaker activated
  SERVER_ERROR = 'SERVER_ERROR',                      // API server errors
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',        // Configuration issues
  FORBIDDEN = 'FORBIDDEN',                            // Access denied
  INVALID_COORDINATES = 'INVALID_COORDINATES',        // Invalid lat/lon
  SUBSCRIPTION_EXPIRED = 'SUBSCRIPTION_EXPIRED',      // Premium feature on free tier
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED'                   // Daily limit reached
}
```

### Error Handling Examples

#### Basic Error Handling
```typescript
try {
  const weather = await client.getCurrentWeather(40.7128, -74.0060);
  console.log(`Temperature: ${weather.current.temperature}°C`);
} catch (error) {
  if (error instanceof ConnectorError) {
    console.error(`Weather API Error: ${error.message}`);
    console.error(`Error Code: ${error.code}`);
    console.error(`Request ID: ${error.requestId}`);
    
    if (error.retryable) {
      console.log('This error can be retried');
    }
  } else {
    console.error('Unexpected error:', error);
  }
}
```

#### Specific Error Type Handling
```typescript
try {
  const weather = await client.getCurrentWeather(91, -200); // Invalid coordinates
} catch (error) {
  if (error instanceof ConnectorError) {
    if (error.isAuthError()) {
      console.error('API key is invalid or expired');
      // Prompt for new API key
    } else if (error.isRateLimit()) {
      console.error('Rate limit exceeded');
      // Implement backoff strategy
    } else if (error.isValidationError()) {
      console.error('Input validation failed');
      // Show user-friendly validation message
    } else if (error.code === ErrorCode.INVALID_COORDINATES) {
      console.error('Coordinates must be: lat (-90 to 90), lon (-180 to 180)');
    }
  }
}
```

#### Request Cancellation
```typescript
const controller = new AbortController();

// Cancel request after 5 seconds
setTimeout(() => controller.abort(), 5000);

try {
  const weather = await client.getCurrentWeather(40.7128, -74.0060, {
    signal: controller.signal
  });
} catch (error) {
  if (error instanceof ConnectorError && error.code === ErrorCode.NETWORK_ERROR) {
    console.log('Request was cancelled or timed out');
  }
}
```

#### Retry Logic with Exponential Backoff
```typescript
async function getWeatherWithRetry(lat: number, lon: number, maxRetries = 3): Promise<WeatherResponse> {
  let lastError: ConnectorError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await client.getCurrentWeather(lat, lon);
    } catch (error) {
      lastError = error as ConnectorError;
      
      if (!lastError.retryable || attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt - 1) * 1000;
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}
```

## Advanced Usage

### Request Correlation and Monitoring

```typescript
const weather = await client.getCurrentWeather(40.7128, -74.0060);

// Access request metadata
console.log(`Request ID: ${weather.meta.requestId}`);
console.log(`Duration: ${weather.meta.duration}ms`);
console.log(`Retry count: ${weather.meta.retryCount}`);
console.log(`Timestamp: ${weather.meta.timestamp}`);
```

### Rate Limit Monitoring

```typescript
// The client automatically manages rate limits, but you can monitor usage
const weather = await client.getCurrentWeather(40.7128, -74.0060);

if (weather.meta.rateLimit) {
  console.log(`API calls remaining: ${weather.meta.rateLimit.remaining}`);
  console.log(`Rate limit resets: ${weather.meta.rateLimit.reset}`);
  console.log(`Total limit: ${weather.meta.rateLimit.limit}`);
}
```

### Custom Request Configuration

```typescript
// Override default configuration per request
const weather = await client.getCurrentWeather(40.7128, -74.0060, {
  timeout: 10000,           // 10 second timeout
  units: 'imperial',        // Fahrenheit
  language: 'es'            // Spanish descriptions
});

console.log(`Temperature: ${weather.current.temperature}°F`);
console.log(`Weather: ${weather.current.weather[0].description}`); // In Spanish
```

## Advanced Usage Patterns

### Batch Weather Requests

When requesting weather for multiple locations, use proper pacing to respect rate limits:

```typescript
interface LocationWeather {
  location: string;
  coordinates: { lat: number; lon: number };
  weather?: WeatherResponse;
  error?: string;
}

async function getBatchWeather(locations: LocationWeather[]): Promise<LocationWeather[]> {
  const client = await createOpenWeatherClient();
  const results: LocationWeather[] = [...locations];
  
  for (let i = 0; i < results.length; i++) {
    try {
      const { lat, lon } = results[i].coordinates;
      results[i].weather = await client.getCurrentWeather(lat, lon);
      
      // Rate limiting: wait 1.5 seconds between requests
      if (i < results.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } catch (error) {
      results[i].error = error instanceof Error ? error.message : 'Unknown error';
    }
  }
  
  return results;
}

// Usage
const cities = [
  { location: 'New York', coordinates: { lat: 40.7128, lon: -74.0060 } },
  { location: 'London', coordinates: { lat: 51.5074, lon: -0.1278 } },
  { location: 'Tokyo', coordinates: { lat: 35.6762, lon: 139.6503 } }
];

const weatherData = await getBatchWeather(cities);
weatherData.forEach(city => {
  if (city.weather) {
    console.log(`${city.location}: ${city.weather.current.temperature}°C`);
  } else {
    console.log(`${city.location}: Error - ${city.error}`);
  }
});
```

### Concurrent Requests with Rate Limiting

For advanced use cases requiring concurrent requests:

```typescript
import { OpenWeatherClient } from '../src/client';

class WeatherService {
  private client: OpenWeatherClient;
  private requestQueue: Promise<any>[] = [];
  private readonly maxConcurrent = 3;
  
  constructor(client: OpenWeatherClient) {
    this.client = client;
  }
  
  async getWeatherConcurrent(locations: Array<{lat: number, lon: number}>): Promise<WeatherResponse[]> {
    const chunks = this.chunkArray(locations, this.maxConcurrent);
    const allResults: WeatherResponse[] = [];
    
    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async (location) => {
        return this.client.getCurrentWeather(location.lat, location.lon);
      });
      
      const chunkResults = await Promise.allSettled(chunkPromises);
      
      chunkResults.forEach(result => {
        if (result.status === 'fulfilled') {
          allResults.push(result.value);
        }
      });
      
      // Wait between chunks to respect rate limits
      if (chunks.indexOf(chunk) < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    return allResults;
  }
  
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
```

### Caching Strategy

Implement intelligent caching to reduce API calls:

```typescript
interface CachedWeatherData {
  data: WeatherResponse;
  timestamp: number;
  coordinates: string;
}

class CachedWeatherService {
  private cache = new Map<string, CachedWeatherData>();
  private readonly cacheTTL = 10 * 60 * 1000; // 10 minutes
  private client: OpenWeatherClient;
  
  constructor(client: OpenWeatherClient) {
    this.client = client;
  }
  
  async getWeatherWithCache(lat: number, lon: number): Promise<WeatherResponse> {
    const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
    const cached = this.cache.get(key);
    
    // Return cached data if still valid
    if (cached && (Date.now() - cached.timestamp) < this.cacheTTL) {
      console.log(`Cache hit for ${key}`);
      return cached.data;
    }
    
    // Fetch fresh data
    console.log(`Cache miss for ${key}, fetching from API`);
    const weather = await this.client.getCurrentWeather(lat, lon);
    
    // Cache the result
    this.cache.set(key, {
      data: weather,
      timestamp: Date.now(),
      coordinates: key
    });
    
    return weather;
  }
  
  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTTL) {
        this.cache.delete(key);
      }
    }
  }
  
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0 // Implement hit rate tracking if needed
    };
  }
}
```

### Weather Alerts and Notifications

Create a weather monitoring system:

```typescript
interface WeatherAlert {
  location: string;
  alertType: 'temperature' | 'weather' | 'wind';
  threshold: number | string;
  condition: 'above' | 'below' | 'equals';
}

class WeatherMonitor {
  private client: OpenWeatherClient;
  private alerts: WeatherAlert[] = [];
  
  constructor(client: OpenWeatherClient) {
    this.client = client;
  }
  
  addAlert(alert: WeatherAlert): void {
    this.alerts.push(alert);
  }
  
  async checkAlerts(lat: number, lon: number): Promise<string[]> {
    const weather = await this.client.getCurrentWeather(lat, lon);
    const triggeredAlerts: string[] = [];
    
    for (const alert of this.alerts) {
      let triggered = false;
      
      switch (alert.alertType) {
        case 'temperature':
          const temp = weather.current.temperature;
          triggered = this.checkCondition(temp, alert.threshold as number, alert.condition);
          if (triggered) {
            triggeredAlerts.push(`Temperature alert: ${temp}°C (${alert.condition} ${alert.threshold}°C)`);
          }
          break;
          
        case 'weather':
          const condition = weather.current.weather[0].main;
          triggered = condition === alert.threshold;
          if (triggered) {
            triggeredAlerts.push(`Weather alert: ${condition} detected`);
          }
          break;
          
        case 'wind':
          const windSpeed = weather.current.wind?.speed || 0;
          triggered = this.checkCondition(windSpeed, alert.threshold as number, alert.condition);
          if (triggered) {
            triggeredAlerts.push(`Wind alert: ${windSpeed} m/s (${alert.condition} ${alert.threshold} m/s)`);
          }
          break;
      }
    }
    
    return triggeredAlerts;
  }
  
  private checkCondition(value: number, threshold: number, condition: string): boolean {
    switch (condition) {
      case 'above': return value > threshold;
      case 'below': return value < threshold;
      case 'equals': return value === threshold;
      default: return false;
    }
  }
}

// Usage
const monitor = new WeatherMonitor(client);
monitor.addAlert({
  location: 'New York',
  alertType: 'temperature',
  threshold: 30,
  condition: 'above'
});

const alerts = await monitor.checkAlerts(40.7128, -74.0060);
alerts.forEach(alert => console.log(`🚨 ${alert}`));
```

## Performance Optimization

### Request Optimization

```typescript
// Optimize requests for minimal API usage
class EfficientWeatherService {
  private client: OpenWeatherClient;
  private lastRequestTime = 0;
  private readonly minInterval = 1000; // Minimum 1 second between requests
  
  constructor(client: OpenWeatherClient) {
    this.client = client;
  }
  
  async getWeatherEfficient(lat: number, lon: number): Promise<WeatherResponse> {
    // Ensure minimum interval between requests
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
    return this.client.getCurrentWeather(lat, lon);
  }
  
  // Get multiple forecasts in single request when possible
  async getComprehensiveWeather(lat: number, lon: number): Promise<{
    current: WeatherResponse;
    forecast: ForecastResponse;
  }> {
    // Note: This makes 2 API calls but gets both current and forecast data
    const [current, forecast] = await Promise.all([
      this.client.getCurrentWeather(lat, lon),
      this.client.getForecast(lat, lon, 5)
    ]);
    
    return { current, forecast };
  }
}
```

### Memory Optimization

```typescript
// Efficient data handling for large-scale applications
class MemoryEfficientWeatherService {
  private client: OpenWeatherClient;
  private readonly maxCacheSize = 100;
  private cache = new LRUCache<string, WeatherResponse>(this.maxCacheSize);
  
  constructor(client: OpenWeatherClient) {
    this.client = client;
  }
  
  async getWeatherOptimized(lat: number, lon: number): Promise<WeatherResponse> {
    const key = `${lat},${lon}`;
    
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }
    
    // Fetch and cache
    const weather = await this.client.getCurrentWeather(lat, lon);
    this.cache.set(key, weather);
    
    return weather;
  }
  
  // Process only essential data for high-volume scenarios
  async getEssentialWeather(lat: number, lon: number): Promise<{
    temperature: number;
    description: string;
    humidity: number;
  }> {
    const weather = await this.client.getCurrentWeather(lat, lon);
    
    // Return only essential data to reduce memory usage
    return {
      temperature: weather.current.temperature,
      description: weather.current.weather[0].description,
      humidity: weather.current.humidity
    };
  }
}

// Simple LRU Cache implementation
class LRUCache<K, V> {
  private maxSize: number;
  private cache = new Map<K, V>();
  
  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }
  
  get(key: K): V | undefined {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)!;
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return undefined;
  }
  
  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
  
  has(key: K): boolean {
    return this.cache.has(key);
  }
}
```

## Real-World Examples

### Weather Dashboard Application

```typescript
interface DashboardLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
  favorite: boolean;
}

class WeatherDashboard {
  private client: OpenWeatherClient;
  private locations: DashboardLocation[] = [];
  private weatherData = new Map<string, WeatherResponse>();
  
  constructor(client: OpenWeatherClient) {
    this.client = client;
  }
  
  addLocation(location: DashboardLocation): void {
    this.locations.push(location);
  }
  
  async refreshAllWeather(): Promise<void> {
    console.log('🔄 Refreshing weather data for all locations...');
    
    for (const location of this.locations) {
      try {
        const weather = await this.client.getCurrentWeather(location.lat, location.lon);
        this.weatherData.set(location.id, weather);
        console.log(`✅ Updated ${location.name}: ${weather.current.temperature}°C`);
        
        // Rate limiting delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
      } catch (error) {
        console.error(`❌ Failed to update ${location.name}:`, error);
      }
    }
  }
  
  getDashboardData(): Array<{
    location: DashboardLocation;
    weather?: WeatherResponse;
    status: 'loaded' | 'error' | 'loading';
  }> {
    return this.locations.map(location => ({
      location,
      weather: this.weatherData.get(location.id),
      status: this.weatherData.has(location.id) ? 'loaded' : 'loading'
    }));
  }
  
  getFavoriteWeather(): Array<{location: DashboardLocation; weather: WeatherResponse}> {
    return this.locations
      .filter(loc => loc.favorite)
      .map(location => ({
        location,
        weather: this.weatherData.get(location.id)!
      }))
      .filter(item => item.weather);
  }
}

// Usage
const dashboard = new WeatherDashboard(client);
dashboard.addLocation({
  id: 'nyc',
  name: 'New York City',
  lat: 40.7128,
  lon: -74.0060,
  favorite: true
});

await dashboard.refreshAllWeather();
const data = dashboard.getDashboardData();
```

### Travel Weather Planner

```typescript
interface TravelDestination {
  name: string;
  lat: number;
  lon: number;
  plannedDate: Date;
}

class TravelWeatherPlanner {
  private client: OpenWeatherClient;
  
  constructor(client: OpenWeatherClient) {
    this.client = client;
  }
  
  async planTrip(destinations: TravelDestination[]): Promise<{
    destination: TravelDestination;
    forecast: ForecastResponse;
    recommendation: string;
  }[]> {
    const plans = [];
    
    for (const destination of destinations) {
      try {
        const forecast = await this.client.getForecast(destination.lat, destination.lon, 5);
        const recommendation = this.generateRecommendation(forecast, destination.plannedDate);
        
        plans.push({
          destination,
          forecast,
          recommendation
        });
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1500));
        
      } catch (error) {
        console.error(`Failed to get weather for ${destination.name}:`, error);
      }
    }
    
    return plans;
  }
  
  private generateRecommendation(forecast: ForecastResponse, plannedDate: Date): string {
    const targetDay = forecast.daily.find(day => 
      day.date.toDateString() === plannedDate.toDateString()
    );
    
    if (!targetDay) {
      return 'Weather forecast not available for planned date';
    }
    
    const temp = targetDay.temperature.max;
    const condition = targetDay.weather[0].main;
    const precipitation = targetDay.precipitation?.probability || 0;
    
    let recommendation = `Expected: ${temp}°C, ${targetDay.weather[0].description}. `;
    
    if (precipitation > 0.7) {
      recommendation += '🌧️ High chance of rain - pack umbrella!';
    } else if (temp > 30) {
      recommendation += '☀️ Very hot - bring sun protection!';
    } else if (temp < 0) {
      recommendation += '❄️ Freezing - pack warm clothes!';
    } else if (condition === 'Clear') {
      recommendation += '☀️ Perfect weather for outdoor activities!';
    } else {
      recommendation += '👍 Generally pleasant conditions expected.';
    }
    
    return recommendation;
  }
}

// Usage
const planner = new TravelWeatherPlanner(client);
const trip = await planner.planTrip([
  { name: 'Paris', lat: 48.8566, lon: 2.3522, plannedDate: new Date('2024-06-15') },
  { name: 'Rome', lat: 41.9028, lon: 12.4964, plannedDate: new Date('2024-06-18') }
]);

trip.forEach(plan => {
  console.log(`${plan.destination.name}: ${plan.recommendation}`);
});
```

### Agriculture Weather Monitor

```typescript
class AgricultureWeatherMonitor {
  private client: OpenWeatherClient;
  private crops: Array<{
    name: string;
    location: { lat: number; lon: number };
    criticalTemp: { min: number; max: number };
    moistureNeeds: number;
  }> = [];
  
  constructor(client: OpenWeatherClient) {
    this.client = client;
  }
  
  addCrop(crop: {
    name: string;
    location: { lat: number; lon: number };
    criticalTemp: { min: number; max: number };
    moistureNeeds: number;
  }): void {
    this.crops.push(crop);
  }
  
  async generateFarmReport(): Promise<string> {
    let report = '🌾 Agricultural Weather Report\n';
    report += '================================\n\n';
    
    for (const crop of this.crops) {
      try {
        const weather = await this.client.getCurrentWeather(
          crop.location.lat, 
          crop.location.lon
        );
        
        const forecast = await this.client.getForecast(
          crop.location.lat, 
          crop.location.lon, 
          3
        );
        
        report += this.analyzeCropConditions(crop, weather, forecast);
        report += '\n';
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        report += `❌ Failed to get weather data for ${crop.name}\n\n`;
      }
    }
    
    return report;
  }
  
  private analyzeCropConditions(
    crop: any, 
    current: WeatherResponse, 
    forecast: ForecastResponse
  ): string {
    let analysis = `🌱 ${crop.name}\n`;
    analysis += `📍 Location: ${current.location.name}\n`;
    analysis += `🌡️ Current: ${current.current.temperature}°C\n`;
    analysis += `💧 Humidity: ${current.current.humidity}%\n`;
    
    // Temperature analysis
    const temp = current.current.temperature;
    if (temp < crop.criticalTemp.min) {
      analysis += `⚠️ Temperature below critical minimum (${crop.criticalTemp.min}°C)\n`;
    } else if (temp > crop.criticalTemp.max) {
      analysis += `⚠️ Temperature above critical maximum (${crop.criticalTemp.max}°C)\n`;
    } else {
      analysis += `✅ Temperature within optimal range\n`;
    }
    
    // Moisture analysis
    if (current.current.humidity < crop.moistureNeeds) {
      analysis += `💧 Consider irrigation - humidity below needs (${crop.moistureNeeds}%)\n`;
    } else {
      analysis += `✅ Adequate moisture levels\n`;
    }
    
    // Weather alerts
    const condition = current.current.weather[0].main;
    if (['Thunderstorm', 'Tornado'].includes(condition)) {
      analysis += `⚠️ Severe weather warning: ${condition}\n`;
    }
    
    // 3-day forecast summary
    const avgTemp = forecast.daily.slice(0, 3).reduce((sum, day) => 
      sum + day.temperature.max, 0) / 3;
    analysis += `📈 3-day avg temperature: ${avgTemp.toFixed(1)}°C\n`;
    
    return analysis;
  }
}
```

This comprehensive API documentation provides both reference information and practical, real-world usage patterns for the OpenWeather v2.5 connector. For additional implementation examples, see the [examples](../examples/) directory.