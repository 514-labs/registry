# OpenWeather v2.5 Error Handling Guide

Comprehensive guide to error handling patterns, error codes, and recovery strategies for the OpenWeather connector.

## Table of Contents

- [Error Types Overview](#error-types-overview)
- [ConnectorError Class](#connectorerror-class)
- [Error Codes Reference](#error-codes-reference)
- [Error Handling Patterns](#error-handling-patterns)
- [Recovery Strategies](#recovery-strategies)
- [Production Error Handling](#production-error-handling)
- [Debugging and Monitoring](#debugging-and-monitoring)

## Error Types Overview

The OpenWeather connector uses structured error handling with specific error types for different failure scenarios:

### Error Categories

1. **Authentication Errors** - Invalid API key or access issues
2. **Rate Limiting Errors** - API usage limits exceeded
3. **Validation Errors** - Invalid input parameters
4. **Network Errors** - Connection and timeout issues
5. **Server Errors** - OpenWeather API server problems
6. **Circuit Breaker Errors** - Protection mechanism activated
7. **Configuration Errors** - Invalid connector setup

## ConnectorError Class

All errors thrown by the connector extend the `ConnectorError` class, providing structured error information.

### Class Definition

```typescript
class ConnectorError extends Error {
  public readonly code: ErrorCode;           // Structured error code
  public readonly statusCode?: number;       // HTTP status code (if applicable)
  public readonly requestId?: string;        // Unique request identifier
  public readonly source?: ErrorSource;      // Error source category
  public readonly details?: any;             // Additional error details

  constructor(
    message: string,
    code: ErrorCode,
    options?: {
      statusCode?: number;
      requestId?: string;
      source?: ErrorSource;
      cause?: Error;
      details?: any;
    }
  )

  // Properties
  get retryable(): boolean;                  // Whether error is retryable

  // Type guards
  isAuthError(): boolean;                    // Authentication errors
  isRateLimit(): boolean;                    // Rate limiting errors
  isValidationError(): boolean;              // Input validation errors
}
```

### Error Properties

```typescript
// Basic error information
error.message          // Human-readable error message
error.code            // Structured error code (ErrorCode enum)
error.name            // Always 'ConnectorError'

// HTTP context (when applicable)
error.statusCode      // HTTP status code (401, 429, 500, etc.)
error.requestId       // Unique request identifier for debugging

// Error metadata
error.source          // Error source (REQUEST, RESPONSE, VALIDATION, etc.)
error.details         // Additional context-specific details
error.retryable       // Boolean indicating if error can be retried

// Original error (when wrapping)
error.cause           // Original error that caused this ConnectorError
```

## Error Codes Reference

### Complete Error Code Enumeration

```typescript
enum ErrorCode {
  // Network and connection errors
  NETWORK_ERROR = 'NETWORK_ERROR',                    // Network/timeout issues
  
  // Authentication and authorization
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',   // Invalid API key
  FORBIDDEN = 'FORBIDDEN',                           // Access denied
  
  // Rate limiting and quotas
  RATE_LIMITED = 'RATE_LIMITED',                     // Rate limit exceeded
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',                 // Daily limit reached
  
  // Input validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',             // Invalid parameters
  INVALID_COORDINATES = 'INVALID_COORDINATES',       // Invalid lat/lon
  
  // API server issues
  SERVER_ERROR = 'SERVER_ERROR',                     // API server errors (5xx)
  
  // Connector protection mechanisms
  CIRCUIT_BREAKER_OPEN = 'CIRCUIT_BREAKER_OPEN',    // Circuit breaker activated
  
  // Configuration and subscription
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',       // Configuration issues
  SUBSCRIPTION_EXPIRED = 'SUBSCRIPTION_EXPIRED'      // Premium feature on free tier
}
```

### Error Code Details

| Code | HTTP Status | Retryable | Description | Common Causes |
|------|-------------|-----------|-------------|---------------|
| `NETWORK_ERROR` | N/A | ✅ | Network connectivity issues, timeouts | Poor internet, request timeout, DNS issues |
| `AUTHENTICATION_FAILED` | 401 | ❌ | Invalid or expired API key | Wrong API key, expired subscription |
| `FORBIDDEN` | 403 | ❌ | Access denied by API | Blocked IP, terms violation |
| `RATE_LIMITED` | 429 | ✅ | API rate limit exceeded | Too many requests per minute |
| `QUOTA_EXCEEDED` | 402 | ❌ | Daily API limit reached | 1000+ calls in 24 hours |
| `VALIDATION_ERROR` | 400 | ❌ | Invalid input parameters | Invalid forecast days, malformed request |
| `INVALID_COORDINATES` | N/A | ❌ | Geographic coordinates out of bounds | lat not in [-90,90], lon not in [-180,180] |
| `SERVER_ERROR` | 5xx | ✅ | OpenWeather API server issues | API downtime, server overload |
| `CIRCUIT_BREAKER_OPEN` | N/A | ✅ | Circuit breaker protection active | Multiple consecutive API failures |
| `CONFIGURATION_ERROR` | N/A | ❌ | Invalid connector configuration | Missing API key, invalid URL |
| `SUBSCRIPTION_EXPIRED` | 402 | ❌ | Premium feature accessed on free tier | Historical data, alerts on free plan |

## Error Handling Patterns

### Basic Error Handling

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

### Type-Safe Error Handling

```typescript
try {
  const weather = await client.getCurrentWeather(40.7128, -74.0060);
  return weather;
} catch (error) {
  if (error instanceof ConnectorError) {
    // Use type guards for specific error types
    if (error.isAuthError()) {
      throw new Error('API authentication failed. Check your API key.');
    } else if (error.isRateLimit()) {
      throw new Error('Rate limit exceeded. Please wait before retrying.');
    } else if (error.isValidationError()) {
      throw new Error('Invalid input parameters provided.');
    } else if (error.code === ErrorCode.INVALID_COORDINATES) {
      throw new Error('Coordinates must be: latitude (-90 to 90), longitude (-180 to 180)');
    } else if (error.code === ErrorCode.QUOTA_EXCEEDED) {
      throw new Error('Daily API quota of 1000 calls exceeded. Upgrade plan or wait 24 hours.');
    }
    
    // Generic fallback
    throw new Error(`Weather service error: ${error.message}`);
  }
  
  // Re-throw unexpected errors
  throw error;
}
```

### Specific Error Code Handling

```typescript
async function getWeatherWithErrorHandling(lat: number, lon: number): Promise<WeatherResponse | null> {
  try {
    return await client.getCurrentWeather(lat, lon);
  } catch (error) {
    if (!(error instanceof ConnectorError)) {
      throw error; // Re-throw unexpected errors
    }
    
    switch (error.code) {
      case ErrorCode.AUTHENTICATION_FAILED:
        console.error('Invalid API key. Please check your OpenWeather API key.');
        return null;
        
      case ErrorCode.RATE_LIMITED:
        console.warn('Rate limit exceeded. Waiting 60 seconds...');
        await new Promise(resolve => setTimeout(resolve, 60000));
        return getWeatherWithErrorHandling(lat, lon); // Retry after delay
        
      case ErrorCode.INVALID_COORDINATES:
        console.error(`Invalid coordinates: lat=${lat}, lon=${lon}`);
        return null;
        
      case ErrorCode.QUOTA_EXCEEDED:
        console.error('Daily quota exceeded. API calls will be blocked for 24 hours.');
        return null;
        
      case ErrorCode.SERVER_ERROR:
        console.warn('OpenWeather API server error. This may be temporary.');
        return null;
        
      case ErrorCode.CIRCUIT_BREAKER_OPEN:
        console.warn('Circuit breaker is open. API calls are being blocked due to recent failures.');
        return null;
        
      case ErrorCode.SUBSCRIPTION_EXPIRED:
        console.error('Attempted to access premium feature on free tier.');
        return null;
        
      default:
        console.error(`Unhandled error: ${error.code} - ${error.message}`);
        return null;
    }
  }
}
```

### Request Cancellation Handling

```typescript
async function getWeatherWithTimeout(lat: number, lon: number, timeoutMs: number): Promise<WeatherResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const weather = await client.getCurrentWeather(lat, lon, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return weather;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof ConnectorError && error.code === ErrorCode.NETWORK_ERROR) {
      // Check if it was a timeout/cancellation
      if (controller.signal.aborted) {
        throw new Error(`Request timed out after ${timeoutMs}ms`);
      }
    }
    
    throw error;
  }
}
```

## Recovery Strategies

### Automatic Retry with Exponential Backoff

```typescript
async function getWeatherWithRetry(
  lat: number, 
  lon: number, 
  maxRetries = 3
): Promise<WeatherResponse> {
  let lastError: ConnectorError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await client.getCurrentWeather(lat, lon);
    } catch (error) {
      lastError = error as ConnectorError;
      
      // Don't retry non-retryable errors
      if (!lastError.retryable || attempt === maxRetries) {
        throw lastError;
      }
      
      // Calculate delay with exponential backoff and jitter
      const baseDelay = 1000; // 1 second
      const maxDelay = 30000; // 30 seconds
      const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 1000; // Up to 1 second jitter
      const delay = Math.min(exponentialDelay + jitter, maxDelay);
      
      console.log(`Attempt ${attempt} failed: ${lastError.message}`);
      console.log(`Retrying in ${Math.round(delay)}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}
```

### Rate Limit Recovery

```typescript
async function getWeatherWithRateLimitHandling(lat: number, lon: number): Promise<WeatherResponse> {
  try {
    return await client.getCurrentWeather(lat, lon);
  } catch (error) {
    if (error instanceof ConnectorError && error.isRateLimit()) {
      // Extract retry-after header if available
      const retryAfter = error.details?.retryAfter || 60; // Default 60 seconds
      
      console.log(`Rate limited. Waiting ${retryAfter} seconds before retry...`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      
      // Retry once after rate limit delay
      return client.getCurrentWeather(lat, lon);
    }
    
    throw error;
  }
}
```

### Circuit Breaker Recovery

```typescript
async function getWeatherWithCircuitBreakerHandling(lat: number, lon: number): Promise<WeatherResponse | null> {
  try {
    return await client.getCurrentWeather(lat, lon);
  } catch (error) {
    if (error instanceof ConnectorError && error.code === ErrorCode.CIRCUIT_BREAKER_OPEN) {
      console.log('Circuit breaker is open. Using cached/fallback data...');
      
      // Return cached data or null to indicate service unavailable
      return getCachedWeather(lat, lon) || null;
    }
    
    throw error;
  }
}

function getCachedWeather(lat: number, lon: number): WeatherResponse | null {
  // Implementation would retrieve cached weather data
  // This is a placeholder for cache integration
  return null;
}
```

### Fallback Data Strategy

```typescript
async function getWeatherWithFallback(lat: number, lon: number): Promise<WeatherResponse> {
  try {
    return await client.getCurrentWeather(lat, lon);
  } catch (error) {
    if (error instanceof ConnectorError) {
      switch (error.code) {
        case ErrorCode.QUOTA_EXCEEDED:
        case ErrorCode.CIRCUIT_BREAKER_OPEN:
        case ErrorCode.SERVER_ERROR:
          // Use fallback data source for non-critical failures
          return getFallbackWeather(lat, lon);
          
        default:
          throw error; // Re-throw for critical errors
      }
    }
    
    throw error;
  }
}

async function getFallbackWeather(lat: number, lon: number): Promise<WeatherResponse> {
  // Fallback to cached data, alternative API, or default values
  return {
    location: {
      latitude: lat,
      longitude: lon,
      timezone: 'UTC',
      timezone_offset: 0
    },
    current: {
      timestamp: new Date(),
      temperature: 20, // Default temperature
      feels_like: 20,
      humidity: 50,
      weather: [{
        id: 800,
        main: 'Unknown',
        description: 'Weather data temporarily unavailable',
        icon: '01d'
      }]
    }
  };
}
```

## Production Error Handling

### Centralized Error Handler

```typescript
class WeatherErrorHandler {
  private logger: Logger;
  private metrics: MetricsCollector;
  
  constructor(logger: Logger, metrics: MetricsCollector) {
    this.logger = logger;
    this.metrics = metrics;
  }
  
  async handleWeatherError(error: unknown, context: { lat: number; lon: number; requestId?: string }): Promise<void> {
    if (error instanceof ConnectorError) {
      // Log structured error information
      this.logger.error('Weather API Error', {
        code: error.code,
        message: error.message,
        requestId: error.requestId,
        statusCode: error.statusCode,
        retryable: error.retryable,
        coordinates: { lat: context.lat, lon: context.lon },
        timestamp: new Date().toISOString()
      });
      
      // Record metrics
      this.metrics.increment('weather_api_errors', {
        error_code: error.code,
        retryable: error.retryable.toString()
      });
      
      // Alert on critical errors
      if (this.isCriticalError(error)) {
        await this.sendAlert(error, context);
      }
    } else {
      // Handle unexpected errors
      this.logger.error('Unexpected Weather Error', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        context
      });
    }
  }
  
  private isCriticalError(error: ConnectorError): boolean {
    return [
      ErrorCode.AUTHENTICATION_FAILED,
      ErrorCode.QUOTA_EXCEEDED,
      ErrorCode.SUBSCRIPTION_EXPIRED
    ].includes(error.code);
  }
  
  private async sendAlert(error: ConnectorError, context: any): Promise<void> {
    // Implementation would send alerts via email, Slack, PagerDuty, etc.
    console.log(`ALERT: Critical weather API error - ${error.code}`);
  }
}
```

### Error Monitoring and Alerting

```typescript
interface ErrorMetrics {
  totalErrors: number;
  errorsByCode: Record<ErrorCode, number>;
  retryableErrors: number;
  nonRetryableErrors: number;
  averageRetryCount: number;
}

class WeatherErrorMonitor {
  private errors: ConnectorError[] = [];
  private readonly maxErrorHistory = 1000;
  
  recordError(error: ConnectorError): void {
    this.errors.push(error);
    
    // Keep only recent errors
    if (this.errors.length > this.maxErrorHistory) {
      this.errors = this.errors.slice(-this.maxErrorHistory);
    }
    
    this.checkErrorThresholds();
  }
  
  getErrorMetrics(timeWindowMs = 3600000): ErrorMetrics { // 1 hour default
    const cutoff = Date.now() - timeWindowMs;
    const recentErrors = this.errors.filter(e => 
      e.details?.timestamp && new Date(e.details.timestamp).getTime() > cutoff
    );
    
    const errorsByCode = recentErrors.reduce((acc, error) => {
      acc[error.code] = (acc[error.code] || 0) + 1;
      return acc;
    }, {} as Record<ErrorCode, number>);
    
    return {
      totalErrors: recentErrors.length,
      errorsByCode,
      retryableErrors: recentErrors.filter(e => e.retryable).length,
      nonRetryableErrors: recentErrors.filter(e => !e.retryable).length,
      averageRetryCount: this.calculateAverageRetryCount(recentErrors)
    };
  }
  
  private checkErrorThresholds(): void {
    const metrics = this.getErrorMetrics(300000); // 5 minutes
    
    // Alert on high error rates
    if (metrics.totalErrors > 50) {
      console.warn(`High error rate detected: ${metrics.totalErrors} errors in 5 minutes`);
    }
    
    // Alert on specific error patterns
    const authErrors = metrics.errorsByCode[ErrorCode.AUTHENTICATION_FAILED] || 0;
    if (authErrors > 5) {
      console.error('Multiple authentication failures detected - check API key');
    }
    
    const quotaErrors = metrics.errorsByCode[ErrorCode.QUOTA_EXCEEDED] || 0;
    if (quotaErrors > 0) {
      console.error('API quota exceeded - daily limit reached');
    }
  }
  
  private calculateAverageRetryCount(errors: ConnectorError[]): number {
    const retriedErrors = errors.filter(e => e.details?.retryCount > 0);
    if (retriedErrors.length === 0) return 0;
    
    const totalRetries = retriedErrors.reduce((sum, e) => sum + (e.details?.retryCount || 0), 0);
    return totalRetries / retriedErrors.length;
  }
}
```

## Debugging and Monitoring

### Error Correlation and Debugging

```typescript
async function debugWeatherRequest(lat: number, lon: number): Promise<void> {
  console.log(`Starting weather request for coordinates: ${lat}, ${lon}`);
  console.log(`Request timestamp: ${new Date().toISOString()}`);
  
  try {
    const weather = await client.getCurrentWeather(lat, lon);
    
    console.log('✅ Request successful');
    console.log(`Request ID: ${weather.meta.requestId}`);
    console.log(`Duration: ${weather.meta.duration}ms`);
    console.log(`Retry count: ${weather.meta.retryCount}`);
    
    if (weather.meta.rateLimit) {
      console.log(`Rate limit - Remaining: ${weather.meta.rateLimit.remaining}/${weather.meta.rateLimit.limit}`);
      console.log(`Rate limit resets: ${weather.meta.rateLimit.reset}`);
    }
    
  } catch (error) {
    console.log('❌ Request failed');
    
    if (error instanceof ConnectorError) {
      console.log(`Error code: ${error.code}`);
      console.log(`Error message: ${error.message}`);
      console.log(`Request ID: ${error.requestId}`);
      console.log(`HTTP status: ${error.statusCode}`);
      console.log(`Retryable: ${error.retryable}`);
      console.log(`Error source: ${error.source}`);
      
      if (error.details) {
        console.log('Error details:', JSON.stringify(error.details, null, 2));
      }
      
      if (error.cause) {
        console.log('Underlying cause:', error.cause);
      }
    }
  }
}
```

### Health Check Implementation

```typescript
async function checkWeatherServiceHealth(): Promise<{ healthy: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  try {
    // Test basic connectivity with minimal API usage
    const weather = await client.getCurrentWeather(40.7128, -74.0060); // NYC
    
    // Validate response structure
    if (!weather.location || !weather.current) {
      errors.push('Invalid response structure');
    }
    
    if (typeof weather.current.temperature !== 'number') {
      errors.push('Invalid temperature data');
    }
    
  } catch (error) {
    if (error instanceof ConnectorError) {
      switch (error.code) {
        case ErrorCode.AUTHENTICATION_FAILED:
          errors.push('Authentication failed - invalid API key');
          break;
        case ErrorCode.QUOTA_EXCEEDED:
          errors.push('API quota exceeded');
          break;
        case ErrorCode.CIRCUIT_BREAKER_OPEN:
          errors.push('Circuit breaker is open - service degraded');
          break;
        default:
          errors.push(`API error: ${error.message}`);
      }
    } else {
      errors.push(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  return {
    healthy: errors.length === 0,
    errors
  };
}
```

### Error Reporting Integration

```typescript
interface ErrorReport {
  timestamp: string;
  requestId: string;
  errorCode: ErrorCode;
  message: string;
  coordinates: { lat: number; lon: number };
  userAgent: string;
  environment: string;
}

class WeatherErrorReporter {
  async reportError(error: ConnectorError, context: { lat: number; lon: number }): Promise<void> {
    const report: ErrorReport = {
      timestamp: new Date().toISOString(),
      requestId: error.requestId || 'unknown',
      errorCode: error.code,
      message: error.message,
      coordinates: context,
      userAgent: 'OpenWeatherConnector/2.5',
      environment: process.env.NODE_ENV || 'unknown'
    };
    
    // Send to error tracking service (Sentry, Bugsnag, etc.)
    await this.sendToErrorTracking(report);
    
    // Log to application logs
    console.error('Weather Error Report:', JSON.stringify(report, null, 2));
  }
  
  private async sendToErrorTracking(report: ErrorReport): Promise<void> {
    // Implementation would integrate with error tracking service
    // Example: Sentry.captureException(error, { extra: report });
  }
}
```

## Production Error Recovery Patterns

### Enterprise Error Handling Strategy

```typescript
interface ErrorRecoveryStrategy {
  retryable: boolean;
  fallbackData?: any;
  escalationLevel: 'info' | 'warn' | 'error' | 'critical';
  userMessage: string;
  technicalAction: string;
}

class EnterpriseErrorHandler {
  private strategies = new Map<ErrorCode, ErrorRecoveryStrategy>();
  private circuitBreakerStates = new Map<string, { failures: number; lastFailure: number }>();
  
  constructor() {
    this.initializeStrategies();
  }
  
  private initializeStrategies(): void {
    this.strategies.set(ErrorCode.AUTHENTICATION_FAILED, {
      retryable: false,
      escalationLevel: 'critical',
      userMessage: 'Weather service is temporarily unavailable due to authentication issues.',
      technicalAction: 'Check API key configuration and refresh credentials'
    });
    
    this.strategies.set(ErrorCode.RATE_LIMITED, {
      retryable: true,
      escalationLevel: 'warn',
      userMessage: 'Weather service is experiencing high demand. Please wait a moment.',
      technicalAction: 'Implement exponential backoff and reduce request frequency'
    });
    
    this.strategies.set(ErrorCode.QUOTA_EXCEEDED, {
      retryable: false,
      escalationLevel: 'critical',
      userMessage: 'Weather service quota exceeded. Service will resume tomorrow.',
      technicalAction: 'Switch to cached data or upgrade API plan'
    });
    
    this.strategies.set(ErrorCode.NETWORK_ERROR, {
      retryable: true,
      escalationLevel: 'error',
      userMessage: 'Weather data temporarily unavailable due to connectivity issues.',
      technicalAction: 'Check network connectivity and retry with backoff'
    });
    
    this.strategies.set(ErrorCode.SERVER_ERROR, {
      retryable: true,
      escalationLevel: 'error',
      userMessage: 'Weather service is experiencing technical difficulties.',
      technicalAction: 'Retry with exponential backoff or switch to fallback service'
    });
  }
  
  async handleError(error: ConnectorError, context: {
    operation: string;
    coordinates?: { lat: number; lon: number };
    userId?: string;
    sessionId?: string;
  }): Promise<{
    shouldRetry: boolean;
    userMessage: string;
    fallbackData?: any;
    escalationNeeded: boolean;
  }> {
    const strategy = this.strategies.get(error.code);
    
    if (!strategy) {
      return {
        shouldRetry: false,
        userMessage: 'An unexpected error occurred. Please try again later.',
        escalationNeeded: true
      };
    }
    
    // Log structured error for monitoring
    this.logStructuredError(error, context, strategy);
    
    // Check circuit breaker state
    const circuitBreakerKey = `${context.operation}_${error.code}`;
    const shouldRetry = this.shouldRetryWithCircuitBreaker(circuitBreakerKey, strategy.retryable);
    
    // Get fallback data if available
    const fallbackData = await this.getFallbackData(error.code, context);
    
    return {
      shouldRetry,
      userMessage: strategy.userMessage,
      fallbackData,
      escalationNeeded: strategy.escalationLevel === 'critical'
    };
  }
  
  private logStructuredError(error: ConnectorError, context: any, strategy: ErrorRecoveryStrategy): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: strategy.escalationLevel,
      errorCode: error.code,
      message: error.message,
      requestId: error.requestId,
      context,
      strategy: {
        retryable: strategy.retryable,
        technicalAction: strategy.technicalAction
      },
      stack: error.stack
    };
    
    // Log to appropriate system based on escalation level
    switch (strategy.escalationLevel) {
      case 'critical':
        console.error('🚨 CRITICAL ERROR:', JSON.stringify(logEntry, null, 2));
        break;
      case 'error':
        console.error('❌ ERROR:', JSON.stringify(logEntry, null, 2));
        break;
      case 'warn':
        console.warn('⚠️ WARNING:', JSON.stringify(logEntry, null, 2));
        break;
      default:
        console.info('ℹ️ INFO:', JSON.stringify(logEntry, null, 2));
    }
  }
  
  private shouldRetryWithCircuitBreaker(key: string, baseRetryable: boolean): boolean {
    if (!baseRetryable) return false;
    
    const state = this.circuitBreakerStates.get(key) || { failures: 0, lastFailure: 0 };
    const now = Date.now();
    
    // Reset circuit breaker after 5 minutes
    if (now - state.lastFailure > 5 * 60 * 1000) {
      state.failures = 0;
    }
    
    // Open circuit breaker after 5 consecutive failures
    if (state.failures >= 5) {
      console.log(`🔌 Circuit breaker OPEN for ${key}`);
      return false;
    }
    
    // Update failure count
    state.failures++;
    state.lastFailure = now;
    this.circuitBreakerStates.set(key, state);
    
    return true;
  }
  
  private async getFallbackData(errorCode: ErrorCode, context: any): Promise<any> {
    // Return cached or default data based on error type
    switch (errorCode) {
      case ErrorCode.QUOTA_EXCEEDED:
      case ErrorCode.SERVER_ERROR:
        return this.getCachedWeatherData(context.coordinates);
        
      case ErrorCode.NETWORK_ERROR:
        return this.getDefaultWeatherData(context.coordinates);
        
      default:
        return null;
    }
  }
  
  private async getCachedWeatherData(coordinates?: { lat: number; lon: number }): Promise<any> {
    // Implementation would retrieve cached weather data
    // This is a placeholder for cache integration
    if (coordinates) {
      return {
        location: { latitude: coordinates.lat, longitude: coordinates.lon, name: 'Cached Location' },
        current: {
          temperature: 20,
          weather: [{ description: 'Data from cache', main: 'Cached' }],
          timestamp: new Date(),
          humidity: 50
        },
        source: 'cache'
      };
    }
    return null;
  }
  
  private async getDefaultWeatherData(coordinates?: { lat: number; lon: number }): Promise<any> {
    // Return safe default data when all else fails
    if (coordinates) {
      return {
        location: { latitude: coordinates.lat, longitude: coordinates.lon, name: 'Unknown Location' },
        current: {
          temperature: 20,
          weather: [{ description: 'Weather data temporarily unavailable', main: 'Unknown' }],
          timestamp: new Date(),
          humidity: 50
        },
        source: 'default'
      };
    }
    return null;
  }
}
```

### Resilient Service Implementation

```typescript
class ResilientWeatherService {
  private client: OpenWeatherClient;
  private errorHandler: EnterpriseErrorHandler;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly cacheTTL = 15 * 60 * 1000; // 15 minutes
  
  constructor(client: OpenWeatherClient) {
    this.client = client;
    this.errorHandler = new EnterpriseErrorHandler();
  }
  
  async getWeatherWithResilience(lat: number, lon: number, userId?: string): Promise<{
    data: WeatherResponse;
    source: 'api' | 'cache' | 'fallback';
    userMessage?: string;
  }> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const context = {
      operation: 'getCurrentWeather',
      coordinates: { lat, lon },
      userId,
      sessionId
    };
    
    try {
      // Try primary API call
      const weather = await this.client.getCurrentWeather(lat, lon);
      
      // Cache successful result
      const cacheKey = `${lat},${lon}`;
      this.cache.set(cacheKey, { data: weather, timestamp: Date.now() });
      
      return { data: weather, source: 'api' };
      
    } catch (error) {
      if (error instanceof ConnectorError) {
        const recovery = await this.errorHandler.handleError(error, context);
        
        // Try fallback data if available
        if (recovery.fallbackData) {
          return {
            data: recovery.fallbackData,
            source: recovery.fallbackData.source || 'fallback',
            userMessage: recovery.userMessage
          };
        }
        
        // Try cached data as last resort
        const cachedData = this.getCachedData(lat, lon);
        if (cachedData) {
          return {
            data: cachedData,
            source: 'cache',
            userMessage: recovery.userMessage
          };
        }
        
        // If retry is suggested and this is first attempt, try once more
        if (recovery.shouldRetry) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          try {
            const retryWeather = await this.client.getCurrentWeather(lat, lon);
            return { data: retryWeather, source: 'api' };
          } catch (retryError) {
            // Fall through to final error
          }
        }
        
        // Final fallback - throw with user-friendly message
        throw new Error(recovery.userMessage);
      }
      
      throw error;
    }
  }
  
  private getCachedData(lat: number, lon: number): any {
    const cacheKey = `${lat},${lon}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheTTL) {
      return { ...cached.data, source: 'cache' };
    }
    
    return null;
  }
  
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Array<{ name: string; status: string; lastCheck: string }>;
  }> {
    const services = [];
    
    try {
      // Test API connectivity with a lightweight request
      await this.client.getCurrentWeather(40.7128, -74.0060);
      services.push({
        name: 'OpenWeather API',
        status: 'healthy',
        lastCheck: new Date().toISOString()
      });
    } catch (error) {
      services.push({
        name: 'OpenWeather API',
        status: error instanceof ConnectorError ? error.code : 'error',
        lastCheck: new Date().toISOString()
      });
    }
    
    // Check cache status
    services.push({
      name: 'Cache',
      status: `${this.cache.size} entries`,
      lastCheck: new Date().toISOString()
    });
    
    const unhealthyServices = services.filter(s => 
      s.status !== 'healthy' && !s.status.includes('entries')
    );
    
    return {
      status: unhealthyServices.length === 0 ? 'healthy' : 
              unhealthyServices.length < services.length ? 'degraded' : 'unhealthy',
      services
    };
  }
}
```

### Error Analytics and Monitoring

```typescript
interface ErrorMetrics {
  errorCode: ErrorCode;
  count: number;
  lastOccurrence: Date;
  averageResponseTime?: number;
  userImpact: 'low' | 'medium' | 'high';
}

class ErrorAnalytics {
  private errors: ConnectorError[] = [];
  private readonly maxErrorHistory = 1000;
  private metrics = new Map<ErrorCode, ErrorMetrics>();
  
  recordError(error: ConnectorError, responseTime?: number): void {
    this.errors.push(error);
    
    // Maintain error history limit
    if (this.errors.length > this.maxErrorHistory) {
      this.errors = this.errors.slice(-this.maxErrorHistory);
    }
    
    // Update metrics
    const existing = this.metrics.get(error.code);
    if (existing) {
      existing.count++;
      existing.lastOccurrence = new Date();
      if (responseTime && existing.averageResponseTime) {
        existing.averageResponseTime = (existing.averageResponseTime + responseTime) / 2;
      }
    } else {
      this.metrics.set(error.code, {
        errorCode: error.code,
        count: 1,
        lastOccurrence: new Date(),
        averageResponseTime: responseTime,
        userImpact: this.calculateUserImpact(error.code)
      });
    }
  }
  
  private calculateUserImpact(errorCode: ErrorCode): 'low' | 'medium' | 'high' {
    switch (errorCode) {
      case ErrorCode.AUTHENTICATION_FAILED:
      case ErrorCode.QUOTA_EXCEEDED:
        return 'high';
      case ErrorCode.RATE_LIMITED:
      case ErrorCode.SERVER_ERROR:
        return 'medium';
      default:
        return 'low';
    }
  }
  
  getErrorReport(timeRange = 3600000): string { // Default 1 hour
    const cutoff = Date.now() - timeRange;
    const recentErrors = this.errors.filter(e => 
      e.details?.timestamp && new Date(e.details.timestamp).getTime() > cutoff
    );
    
    let report = '📊 Error Analytics Report\n';
    report += '========================\n\n';
    
    if (recentErrors.length === 0) {
      report += '✅ No errors in the specified time range\n';
      return report;
    }
    
    // Group errors by type
    const errorCounts = recentErrors.reduce((acc, error) => {
      acc[error.code] = (acc[error.code] || 0) + 1;
      return acc;
    }, {} as Record<ErrorCode, number>);
    
    // Sort by frequency
    const sortedErrors = Object.entries(errorCounts)
      .sort(([,a], [,b]) => b - a);
    
    report += `Total Errors: ${recentErrors.length}\n`;
    report += `Unique Error Types: ${sortedErrors.length}\n`;
    report += `Time Range: ${Math.floor(timeRange / 60000)} minutes\n\n`;
    
    sortedErrors.forEach(([code, count]) => {
      const metric = this.metrics.get(code as ErrorCode);
      const percentage = ((count / recentErrors.length) * 100).toFixed(1);
      
      report += `❌ ${code}\n`;
      report += `   Count: ${count} (${percentage}%)\n`;
      report += `   User Impact: ${metric?.userImpact || 'unknown'}\n`;
      report += `   Last Seen: ${metric?.lastOccurrence.toLocaleString() || 'unknown'}\n`;
      
      if (metric?.averageResponseTime) {
        report += `   Avg Response: ${metric.averageResponseTime.toFixed(0)}ms\n`;
      }
      
      report += '\n';
    });
    
    // Recommendations
    report += '💡 Recommendations:\n';
    if (errorCounts[ErrorCode.RATE_LIMITED] > 0) {
      report += '- Consider reducing request frequency or upgrading API plan\n';
    }
    if (errorCounts[ErrorCode.NETWORK_ERROR] > 0) {
      report += '- Check network connectivity and consider timeout adjustments\n';
    }
    if (errorCounts[ErrorCode.AUTHENTICATION_FAILED] > 0) {
      report += '- Verify API key configuration and rotation policies\n';
    }
    
    return report;
  }
  
  getTopErrorsByImpact(limit = 5): ErrorMetrics[] {
    return Array.from(this.metrics.values())
      .sort((a, b) => {
        const impactWeight = { high: 3, medium: 2, low: 1 };
        return (impactWeight[b.userImpact] * b.count) - (impactWeight[a.userImpact] * a.count);
      })
      .slice(0, limit);
  }
  
  exportErrorData(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify({
        summary: {
          totalErrors: this.errors.length,
          uniqueErrorTypes: this.metrics.size,
          exportTime: new Date().toISOString()
        },
        metrics: Array.from(this.metrics.values()),
        recentErrors: this.errors.slice(-50) // Last 50 errors
      }, null, 2);
    } else {
      // CSV format
      let csv = 'ErrorCode,Count,LastOccurrence,UserImpact,AverageResponseTime\n';
      this.metrics.forEach(metric => {
        csv += `${metric.errorCode},${metric.count},${metric.lastOccurrence.toISOString()},${metric.userImpact},${metric.averageResponseTime || 'N/A'}\n`;
      });
      return csv;
    }
  }
}
```

### Integration with External Systems

```typescript
// Integration with external monitoring and alerting systems
class ExternalSystemIntegration {
  private errorAnalytics: ErrorAnalytics;
  private webhookUrl?: string;
  private slackToken?: string;
  
  constructor(errorAnalytics: ErrorAnalytics, config: {
    webhookUrl?: string;
    slackToken?: string;
  }) {
    this.errorAnalytics = errorAnalytics;
    this.webhookUrl = config.webhookUrl;
    this.slackToken = config.slackToken;
  }
  
  async sendCriticalAlert(error: ConnectorError, context: any): Promise<void> {
    const alert = {
      timestamp: new Date().toISOString(),
      severity: 'CRITICAL',
      service: 'OpenWeather Connector',
      error: {
        code: error.code,
        message: error.message,
        requestId: error.requestId
      },
      context,
      metrics: this.errorAnalytics.getTopErrorsByImpact(3)
    };
    
    // Send to webhook
    if (this.webhookUrl) {
      try {
        await fetch(this.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alert)
        });
      } catch (err) {
        console.error('Failed to send webhook alert:', err);
      }
    }
    
    // Send to Slack
    if (this.slackToken) {
      await this.sendSlackAlert(alert);
    }
  }
  
  private async sendSlackAlert(alert: any): Promise<void> {
    const message = {
      text: `🚨 Critical Error in OpenWeather Connector`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Critical Error Detected*\n*Service:* ${alert.service}\n*Error:* ${alert.error.code}\n*Message:* ${alert.error.message}\n*Time:* ${alert.timestamp}`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Request ID:* ${alert.error.requestId}\n*Context:* ${JSON.stringify(alert.context)}`
          }
        }
      ]
    };
    
    try {
      await fetch('https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });
    } catch (err) {
      console.error('Failed to send Slack alert:', err);
    }
  }
  
  async generateDailyReport(): Promise<void> {
    const report = this.errorAnalytics.getErrorReport(24 * 60 * 60 * 1000); // 24 hours
    const csvData = this.errorAnalytics.exportErrorData('csv');
    
    // Send daily report
    if (this.webhookUrl) {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'daily_report',
          report,
          csvData,
          timestamp: new Date().toISOString()
        })
      });
    }
  }
}

// Usage example
const errorAnalytics = new ErrorAnalytics();
const externalIntegration = new ExternalSystemIntegration(errorAnalytics, {
  webhookUrl: process.env.MONITORING_WEBHOOK_URL,
  slackToken: process.env.SLACK_BOT_TOKEN
});

// In your error handling code
try {
  const weather = await client.getCurrentWeather(40.7128, -74.0060);
} catch (error) {
  if (error instanceof ConnectorError) {
    errorAnalytics.recordError(error);
    
    // Send critical alerts for high-impact errors
    if (['AUTHENTICATION_FAILED', 'QUOTA_EXCEEDED'].includes(error.code)) {
      await externalIntegration.sendCriticalAlert(error, {
        operation: 'getCurrentWeather',
        coordinates: { lat: 40.7128, lon: -74.0060 }
      });
    }
  }
  throw error;
}
```

This comprehensive error handling guide provides the tools and patterns needed to build robust applications with the OpenWeather connector, ensuring graceful degradation and proper error recovery in production environments. The enhanced patterns include enterprise-grade error recovery, analytics, and integration with external monitoring systems for complete observability.