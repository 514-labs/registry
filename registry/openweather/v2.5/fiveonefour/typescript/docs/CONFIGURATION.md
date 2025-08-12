# OpenWeather v2.5 Configuration Reference

Complete guide to configuring the OpenWeather connector for optimal performance and compliance with API limits.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Configuration Object](#configuration-object)
- [Rate Limiting Configuration](#rate-limiting-configuration)
- [Circuit Breaker Configuration](#circuit-breaker-configuration)
- [Retry Configuration](#retry-configuration)
- [Request Options](#request-options)
- [Production Configurations](#production-configurations)
- [Development Configurations](#development-configurations)

## Environment Variables

The connector uses environment variables for secure and flexible configuration.

### Required Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `OPENWEATHER_API_KEY` | ✅ | Your OpenWeather API key | `abc123def456ghi789` |

### Optional Variables

| Variable | Default | Description | Valid Values |
|----------|---------|-------------|--------------|
| `OPENWEATHER_BASE_URL` | `https://api.openweathermap.org/data/2.5` | API base URL | Any valid URL |
| `OPENWEATHER_UNITS` | `metric` | Temperature units | `standard`, `metric`, `imperial` |
| `OPENWEATHER_LANGUAGE` | `en` | Language for descriptions | ISO 639-1 codes |

### Setting Environment Variables

#### Development (.env file)
```bash
# .env.local or .env
OPENWEATHER_API_KEY=your_api_key_here
OPENWEATHER_UNITS=metric
OPENWEATHER_LANGUAGE=en
```

#### Production (Docker)
```dockerfile
ENV OPENWEATHER_API_KEY=your_api_key_here
ENV OPENWEATHER_UNITS=metric
```

#### Production (Kubernetes)
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: openweather-config
data:
  OPENWEATHER_API_KEY: <base64-encoded-key>
---
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
      - name: app
        envFrom:
        - secretRef:
            name: openweather-config
```

#### Cloud Platforms

**Vercel:**
```bash
vercel env add OPENWEATHER_API_KEY
```

**Netlify:**
```bash
netlify env:set OPENWEATHER_API_KEY your_api_key_here
```

**AWS Lambda:**
```yaml
# serverless.yml
provider:
  environment:
    OPENWEATHER_API_KEY: ${env:OPENWEATHER_API_KEY}
```

## Configuration Object

### Complete Interface

```typescript
interface OpenWeatherConfig {
  // Required
  apiKey: string;

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

### Basic Configuration

```typescript
import { OpenWeatherClient } from './src/client';

const basicConfig = {
  apiKey: process.env.OPENWEATHER_API_KEY!
};

const client = new OpenWeatherClient(basicConfig);
```

### Custom Configuration

```typescript
const customConfig = {
  apiKey: process.env.OPENWEATHER_API_KEY!,
  units: 'imperial' as const,
  language: 'es',
  timeout: 15000,
  defaultHeaders: {
    'X-App-Name': 'MyWeatherApp',
    'X-App-Version': '1.0.0'
  }
};

const client = new OpenWeatherClient(customConfig);
```

## Rate Limiting Configuration

Critical for staying within OpenWeather's 1,000 calls/day free tier limit.

### Default Rate Limiting

```typescript
const defaultRateLimit = {
  requestsPerMinute: 60,             // Conservative for daily limit
  burstCapacity: 10,                 // Allow short bursts
  adaptiveFromHeaders: true          // Adjust based on API responses
};
```

### Conservative Rate Limiting (Production)

```typescript
const conservativeRateLimit = {
  requestsPerMinute: 40,             // Even more conservative
  burstCapacity: 5,                  // Smaller bursts
  adaptiveFromHeaders: true
};
```

### Aggressive Rate Limiting (Development)

```typescript
const aggressiveRateLimit = {
  requestsPerMinute: 20,             // Very conservative for testing
  burstCapacity: 3,                  // Minimal bursts
  adaptiveFromHeaders: false         // Fixed rate
};
```

### Rate Limit Calculations

**Daily Usage Planning:**
```typescript
// For 1,000 calls/day limit
const dailyLimit = 1000;
const hoursPerDay = 24;
const minutesPerHour = 60;

// Conservative rate: use 80% of limit
const conservativeDaily = dailyLimit * 0.8; // 800 calls
const callsPerMinute = conservativeDaily / (hoursPerDay * minutesPerHour); // ~0.56 calls/minute

// Burst allowance: 5% of daily limit
const burstCapacity = dailyLimit * 0.05; // 50 calls

const safeRateLimit = {
  requestsPerMinute: Math.floor(callsPerMinute * 60), // 33 calls/minute
  burstCapacity: Math.floor(burstCapacity),           // 50 calls
  adaptiveFromHeaders: true
};
```

### Monitoring Rate Limits

```typescript
const client = new OpenWeatherClient({
  apiKey: process.env.OPENWEATHER_API_KEY!,
  rateLimit: {
    requestsPerMinute: 60,
    burstCapacity: 10,
    adaptiveFromHeaders: true
  }
});

// Monitor rate limit usage
const weather = await client.getCurrentWeather(40.7128, -74.0060);
if (weather.meta.rateLimit) {
  console.log(`Remaining calls: ${weather.meta.rateLimit.remaining}`);
  console.log(`Limit resets: ${weather.meta.rateLimit.reset}`);
}
```

## Circuit Breaker Configuration

Prevents wasted API calls during outages and protects against cascading failures.

### Default Circuit Breaker

```typescript
const defaultCircuitBreaker = {
  failureThreshold: 5,               // Open after 5 consecutive failures
  resetTimeout: 60000,               // Try again after 60 seconds
  successThreshold: 3                // Close after 3 consecutive successes
};
```

### Sensitive Circuit Breaker (Production)

```typescript
const sensitiveCircuitBreaker = {
  failureThreshold: 3,               // Open after 3 failures
  resetTimeout: 120000,              // Wait 2 minutes
  successThreshold: 5                // Need 5 successes to close
};
```

### Tolerant Circuit Breaker (Development)

```typescript
const tolerantCircuitBreaker = {
  failureThreshold: 10,              // Allow more failures
  resetTimeout: 30000,               // Shorter reset time
  successThreshold: 2                // Easier to close
};
```

### Circuit Breaker States

```typescript
enum CircuitState {
  CLOSED = 'CLOSED',      // Normal operation
  OPEN = 'OPEN',          // Blocking requests after failures
  HALF_OPEN = 'HALF_OPEN' // Testing recovery
}
```

### Monitoring Circuit Breaker

```typescript
// Circuit breaker state is internal, but errors indicate state
try {
  const weather = await client.getCurrentWeather(40.7128, -74.0060);
} catch (error) {
  if (error instanceof ConnectorError && error.code === ErrorCode.CIRCUIT_BREAKER_OPEN) {
    console.log('Circuit breaker is open - API calls are being blocked');
    console.log('Wait for reset timeout before trying again');
  }
}
```

## Retry Configuration

Handles transient failures with exponential backoff.

### Default Retry Configuration

```typescript
const defaultRetries = {
  maxRetries: 3,                     // Total retry attempts
  baseDelay: 1000,                   // Initial delay (1 second)
  maxDelay: 30000                    // Maximum delay (30 seconds)
};
```

### Conservative Retry (API Call Preservation)

```typescript
const conservativeRetries = {
  maxRetries: 2,                     // Fewer retries to save API calls
  baseDelay: 2000,                   // Longer initial delay
  maxDelay: 10000                    // Shorter max delay
};
```

### Aggressive Retry (Development)

```typescript
const aggressiveRetries = {
  maxRetries: 5,                     // More retry attempts
  baseDelay: 500,                    // Shorter initial delay
  maxDelay: 60000                    // Longer max delay
};
```

### Retry Logic Example

```typescript
// Retry delays: 1s, 2s, 4s (with jitter)
const retryDelays = [];
for (let attempt = 1; attempt <= 3; attempt++) {
  const delay = Math.min(
    1000 * Math.pow(2, attempt - 1) + Math.random() * 1000, // Exponential + jitter
    30000 // Max delay
  );
  retryDelays.push(delay);
}
console.log('Retry delays:', retryDelays); // [~1500ms, ~3200ms, ~5800ms]
```

### Retryable Errors

Only specific error types are retried:

```typescript
const retryableErrors = [
  ErrorCode.NETWORK_ERROR,           // Network/timeout issues
  ErrorCode.RATE_LIMITED,            // Rate limit exceeded
  ErrorCode.SERVER_ERROR,            // API server errors (5xx)
  ErrorCode.CIRCUIT_BREAKER_OPEN     // Circuit breaker issues
];

// Non-retryable errors (fail immediately)
const nonRetryableErrors = [
  ErrorCode.AUTHENTICATION_FAILED,   // Invalid API key
  ErrorCode.VALIDATION_ERROR,        // Invalid parameters
  ErrorCode.FORBIDDEN,               // Access denied
  ErrorCode.INVALID_COORDINATES,     // Invalid lat/lon
  ErrorCode.SUBSCRIPTION_EXPIRED     // Premium feature on free tier
];
```

## Request Options

Per-request configuration that overrides defaults.

### WeatherRequestOptions Interface

```typescript
interface WeatherRequestOptions {
  timeout?: number;                  // Override default timeout
  signal?: AbortSignal;             // For request cancellation
  units?: 'standard' | 'metric' | 'imperial';  // Override default units
  language?: string;                // Override default language
}
```

### Using Request Options

```typescript
// Request with custom timeout
const weather = await client.getCurrentWeather(40.7128, -74.0060, {
  timeout: 5000  // 5 second timeout
});

// Request with cancellation
const controller = new AbortController();
setTimeout(() => controller.abort(), 10000); // Cancel after 10 seconds

const weather = await client.getCurrentWeather(40.7128, -74.0060, {
  signal: controller.signal
});

// Request with different units and language
const weather = await client.getCurrentWeather(40.7128, -74.0060, {
  units: 'imperial',  // Fahrenheit
  language: 'es'      // Spanish descriptions
});
```

## Production Configurations

### High-Traffic Production

```typescript
const highTrafficConfig = {
  apiKey: process.env.OPENWEATHER_API_KEY!,
  timeout: 15000,
  
  // Conservative rate limiting
  rateLimit: {
    requestsPerMinute: 30,           // Very conservative
    burstCapacity: 5,
    adaptiveFromHeaders: true
  },
  
  // Sensitive circuit breaker
  circuitBreaker: {
    failureThreshold: 3,
    resetTimeout: 120000,            // 2 minutes
    successThreshold: 5
  },
  
  // Minimal retries to preserve API calls
  retries: {
    maxRetries: 2,
    baseDelay: 2000,
    maxDelay: 8000
  },
  
  // Monitoring headers
  defaultHeaders: {
    'X-Environment': 'production',
    'X-Service': 'weather-service'
  }
};
```

### Low-Traffic Production

```typescript
const lowTrafficConfig = {
  apiKey: process.env.OPENWEATHER_API_KEY!,
  timeout: 30000,
  
  // More permissive rate limiting
  rateLimit: {
    requestsPerMinute: 60,
    burstCapacity: 15,
    adaptiveFromHeaders: true
  },
  
  // Standard circuit breaker
  circuitBreaker: {
    failureThreshold: 5,
    resetTimeout: 60000,
    successThreshold: 3
  },
  
  // Standard retries
  retries: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 30000
  }
};
```

### Microservice Configuration

```typescript
const microserviceConfig = {
  apiKey: process.env.OPENWEATHER_API_KEY!,
  timeout: 10000,                    // Faster timeout for microservices
  
  // Rate limiting with service coordination
  rateLimit: {
    requestsPerMinute: 20,           // Assuming multiple services
    burstCapacity: 3,
    adaptiveFromHeaders: true
  },
  
  // Fast-fail circuit breaker
  circuitBreaker: {
    failureThreshold: 3,
    resetTimeout: 30000,             // Quick recovery
    successThreshold: 2
  },
  
  // Minimal retries in microservice chains
  retries: {
    maxRetries: 1,
    baseDelay: 1000,
    maxDelay: 5000
  },
  
  // Service identification
  defaultHeaders: {
    'X-Service': 'weather-microservice',
    'X-Instance': process.env.HOSTNAME || 'unknown'
  }
};
```

## Development Configurations

### Local Development

```typescript
const localDevConfig = {
  apiKey: process.env.OPENWEATHER_API_KEY!,
  timeout: 10000,
  
  // Very conservative for development
  rateLimit: {
    requestsPerMinute: 10,           // Minimal usage
    burstCapacity: 2,
    adaptiveFromHeaders: false       // Fixed rate for predictability
  },
  
  // Tolerant circuit breaker
  circuitBreaker: {
    failureThreshold: 10,
    resetTimeout: 15000,             // Quick reset for testing
    successThreshold: 1
  },
  
  // More aggressive retries for testing
  retries: {
    maxRetries: 5,
    baseDelay: 500,
    maxDelay: 5000
  },
  
  // Development headers
  defaultHeaders: {
    'X-Environment': 'development',
    'X-Developer': process.env.USER || 'unknown'
  }
};
```

### Testing Configuration

```typescript
const testingConfig = {
  apiKey: process.env.OPENWEATHER_API_KEY || 'test-key',
  timeout: 5000,                     // Fast timeout for tests
  
  // Minimal rate limiting for tests
  rateLimit: {
    requestsPerMinute: 5,            // Very limited for tests
    burstCapacity: 1,
    adaptiveFromHeaders: false
  },
  
  // Disabled circuit breaker for predictable tests
  circuitBreaker: {
    failureThreshold: 100,           // Effectively disabled
    resetTimeout: 1000,
    successThreshold: 1
  },
  
  // No retries for deterministic tests
  retries: {
    maxRetries: 0,                   // No retries in tests
    baseDelay: 0,
    maxDelay: 0
  },
  
  // Test identification
  defaultHeaders: {
    'X-Environment': 'test',
    'X-Test-Suite': 'integration'
  }
};
```

### CI/CD Configuration

```typescript
const ciConfig = {
  apiKey: process.env.OPENWEATHER_API_KEY!,
  timeout: 15000,                    // Longer timeout for CI
  
  // Minimal rate limiting
  rateLimit: {
    requestsPerMinute: 3,            // Very conservative for CI
    burstCapacity: 1,
    adaptiveFromHeaders: true
  },
  
  // Sensitive circuit breaker
  circuitBreaker: {
    failureThreshold: 2,
    resetTimeout: 30000,
    successThreshold: 1
  },
  
  // Single retry only
  retries: {
    maxRetries: 1,
    baseDelay: 2000,
    maxDelay: 5000
  },
  
  // CI identification
  defaultHeaders: {
    'X-Environment': 'ci',
    'X-Build-ID': process.env.BUILD_ID || 'unknown'
  }
};
```

## Configuration Validation

### Validating Configuration

```typescript
function validateConfig(config: OpenWeatherConfig): void {
  if (!config.apiKey) {
    throw new Error('OPENWEATHER_API_KEY is required');
  }
  
  if (config.apiKey.length < 10) {
    throw new Error('API key appears to be invalid (too short)');
  }
  
  if (config.timeout && config.timeout < 1000) {
    console.warn('Timeout below 1 second may cause frequent failures');
  }
  
  if (config.rateLimit?.requestsPerMinute && config.rateLimit.requestsPerMinute > 100) {
    console.warn('Rate limit above 100 requests/minute may exceed API limits');
  }
}

// Use validation
const config = createConfigFromEnv();
validateConfig(config);
const client = new OpenWeatherClient(config);
```

### Environment-Specific Configuration Factory

```typescript
function createEnvironmentConfig(): OpenWeatherConfig {
  const env = process.env.NODE_ENV || 'development';
  const baseConfig = {
    apiKey: process.env.OPENWEATHER_API_KEY!
  };
  
  switch (env) {
    case 'production':
      return { ...baseConfig, ...highTrafficConfig };
    case 'staging':
      return { ...baseConfig, ...lowTrafficConfig };
    case 'test':
      return { ...baseConfig, ...testingConfig };
    default:
      return { ...baseConfig, ...localDevConfig };
  }
}

// Usage
const config = createEnvironmentConfig();
const client = new OpenWeatherClient(config);
```

## Configuration Validation and Best Practices

### Environment-Specific Configuration Validation

```typescript
interface EnvironmentConfig {
  name: string;
  apiKey: string;
  expectedCallVolume: 'low' | 'medium' | 'high';
  toleranceLevel: 'strict' | 'balanced' | 'tolerant';
}

function createValidatedConfig(env: EnvironmentConfig): OpenWeatherConfig {
  // Validate API key format
  if (!env.apiKey || env.apiKey.length < 20) {
    throw new Error('Invalid OpenWeather API key format');
  }
  
  // Environment-specific configurations
  const baseConfigs = {
    low: {
      rateLimit: { requestsPerMinute: 20, burstCapacity: 3 },
      circuitBreaker: { failureThreshold: 5, resetTimeout: 60000 },
      retries: { maxRetries: 3, baseDelay: 1000 }
    },
    medium: {
      rateLimit: { requestsPerMinute: 40, burstCapacity: 8 },
      circuitBreaker: { failureThreshold: 4, resetTimeout: 45000 },
      retries: { maxRetries: 2, baseDelay: 1500 }
    },
    high: {
      rateLimit: { requestsPerMinute: 60, burstCapacity: 15 },
      circuitBreaker: { failureThreshold: 3, resetTimeout: 30000 },
      retries: { maxRetries: 1, baseDelay: 2000 }
    }
  };
  
  const tolerance = {
    strict: { multiplier: 0.7, timeoutReduction: 0.8 },
    balanced: { multiplier: 1.0, timeoutReduction: 1.0 },
    tolerant: { multiplier: 1.3, timeoutReduction: 1.2 }
  };
  
  const baseConfig = baseConfigs[env.expectedCallVolume];
  const toleranceConfig = tolerance[env.toleranceLevel];
  
  return {
    apiKey: env.apiKey,
    timeout: 30000 * toleranceConfig.timeoutReduction,
    rateLimit: {
      requestsPerMinute: Math.floor(baseConfig.rateLimit.requestsPerMinute * toleranceConfig.multiplier),
      burstCapacity: Math.floor(baseConfig.rateLimit.burstCapacity * toleranceConfig.multiplier),
      adaptiveFromHeaders: true
    },
    circuitBreaker: baseConfig.circuitBreaker,
    retries: baseConfig.retries,
    defaultHeaders: {
      'X-Environment': env.name,
      'X-Call-Volume': env.expectedCallVolume,
      'X-Tolerance': env.toleranceLevel
    }
  };
}

// Usage examples
const productionConfig = createValidatedConfig({
  name: 'production',
  apiKey: process.env.OPENWEATHER_API_KEY!,
  expectedCallVolume: 'high',
  toleranceLevel: 'strict'
});

const developmentConfig = createValidatedConfig({
  name: 'development',
  apiKey: process.env.OPENWEATHER_API_KEY!,
  expectedCallVolume: 'low',
  toleranceLevel: 'tolerant'
});
```

### Dynamic Configuration Management

```typescript
class DynamicConfigManager {
  private config: OpenWeatherConfig;
  private metrics: {
    successRate: number;
    averageResponseTime: number;
    rateLimitHits: number;
    circuitBreakerTrips: number;
  };
  
  constructor(initialConfig: OpenWeatherConfig) {
    this.config = { ...initialConfig };
    this.metrics = {
      successRate: 1.0,
      averageResponseTime: 0,
      rateLimitHits: 0,
      circuitBreakerTrips: 0
    };
  }
  
  updateMetrics(responseTime: number, success: boolean, rateLimited: boolean, circuitTripped: boolean): void {
    // Update success rate (exponential moving average)
    this.metrics.successRate = 0.9 * this.metrics.successRate + 0.1 * (success ? 1 : 0);
    
    // Update average response time
    this.metrics.averageResponseTime = 0.8 * this.metrics.averageResponseTime + 0.2 * responseTime;
    
    // Count rate limit hits and circuit breaker trips
    if (rateLimited) this.metrics.rateLimitHits++;
    if (circuitTripped) this.metrics.circuitBreakerTrips++;
  }
  
  getAdaptiveConfig(): OpenWeatherConfig {
    const adaptedConfig = { ...this.config };
    
    // Adapt rate limiting based on performance
    if (this.metrics.rateLimitHits > 5) {
      // Reduce rate if hitting limits frequently
      adaptedConfig.rateLimit!.requestsPerMinute = Math.max(
        10, 
        Math.floor(adaptedConfig.rateLimit!.requestsPerMinute! * 0.8)
      );
      console.log('🔽 Reducing rate limit due to frequent rate limit hits');
    }
    
    // Adapt timeout based on response times
    if (this.metrics.averageResponseTime > 5000) {
      adaptedConfig.timeout = Math.max(10000, adaptedConfig.timeout! * 1.2);
      console.log('⏰ Increasing timeout due to slow responses');
    }
    
    // Adapt circuit breaker based on success rate
    if (this.metrics.successRate < 0.8) {
      adaptedConfig.circuitBreaker!.failureThreshold = Math.max(
        2,
        adaptedConfig.circuitBreaker!.failureThreshold! - 1
      );
      console.log('⚡ Making circuit breaker more sensitive due to low success rate');
    }
    
    return adaptedConfig;
  }
  
  getMetricsSummary(): string {
    return `
📊 Configuration Metrics Summary:
- Success Rate: ${(this.metrics.successRate * 100).toFixed(1)}%
- Avg Response Time: ${this.metrics.averageResponseTime.toFixed(0)}ms
- Rate Limit Hits: ${this.metrics.rateLimitHits}
- Circuit Breaker Trips: ${this.metrics.circuitBreakerTrips}
    `.trim();
  }
  
  resetMetrics(): void {
    this.metrics = {
      successRate: 1.0,
      averageResponseTime: 0,
      rateLimitHits: 0,
      circuitBreakerTrips: 0
    };
  }
}
```

### Multi-Region Configuration

```typescript
interface RegionConfig {
  region: string;
  primaryApiKey: string;
  fallbackApiKey?: string;
  baseURL?: string;
  expectedLatency: number;
  rateLimitMultiplier: number;
}

class MultiRegionConfigManager {
  private regionConfigs: Map<string, RegionConfig> = new Map();
  
  addRegion(config: RegionConfig): void {
    this.regionConfigs.set(config.region, config);
  }
  
  getConfigForRegion(region: string, fallbackRegion = 'us-east'): OpenWeatherConfig {
    const regionConfig = this.regionConfigs.get(region) || this.regionConfigs.get(fallbackRegion);
    
    if (!regionConfig) {
      throw new Error(`No configuration found for region: ${region}`);
    }
    
    return {
      apiKey: regionConfig.primaryApiKey,
      baseURL: regionConfig.baseURL || 'https://api.openweathermap.org/data/2.5',
      timeout: Math.max(5000, regionConfig.expectedLatency * 3),
      rateLimit: {
        requestsPerMinute: Math.floor(60 * regionConfig.rateLimitMultiplier),
        burstCapacity: Math.floor(10 * regionConfig.rateLimitMultiplier),
        adaptiveFromHeaders: true
      },
      circuitBreaker: {
        failureThreshold: 5,
        resetTimeout: 60000,
        successThreshold: 3
      },
      retries: {
        maxRetries: 3,
        baseDelay: Math.max(1000, regionConfig.expectedLatency),
        maxDelay: 30000
      },
      defaultHeaders: {
        'X-Region': region,
        'X-Fallback-Key': regionConfig.fallbackApiKey ? 'available' : 'none'
      }
    };
  }
}

// Setup multi-region configuration
const multiRegion = new MultiRegionConfigManager();

multiRegion.addRegion({
  region: 'us-east',
  primaryApiKey: process.env.OPENWEATHER_US_EAST_KEY!,
  fallbackApiKey: process.env.OPENWEATHER_FALLBACK_KEY,
  expectedLatency: 200,
  rateLimitMultiplier: 1.0
});

multiRegion.addRegion({
  region: 'eu-west',
  primaryApiKey: process.env.OPENWEATHER_EU_WEST_KEY!,
  baseURL: 'https://api.openweathermap.org/data/2.5', // Could be EU-specific endpoint
  expectedLatency: 150,
  rateLimitMultiplier: 0.8  // More conservative in EU
});

multiRegion.addRegion({
  region: 'asia-pacific',
  primaryApiKey: process.env.OPENWEATHER_APAC_KEY!,
  expectedLatency: 300,
  rateLimitMultiplier: 0.6  // Very conservative for APAC
});

// Use region-specific configuration
const config = multiRegion.getConfigForRegion('eu-west');
const client = new OpenWeatherClient(config);
```

### Configuration Security Best Practices

```typescript
class SecureConfigManager {
  private static readonly REQUIRED_ENV_VARS = [
    'OPENWEATHER_API_KEY'
  ];
  
  private static readonly SENSITIVE_KEYS = [
    'apiKey',
    'defaultHeaders.Authorization',
    'defaultHeaders.X-API-Key'
  ];
  
  static validateEnvironment(): void {
    const missing = this.REQUIRED_ENV_VARS.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    
    // Validate API key format (OpenWeather keys are typically 32 characters)
    const apiKey = process.env.OPENWEATHER_API_KEY!;
    if (!/^[a-f0-9]{32}$/i.test(apiKey)) {
      console.warn('⚠️ API key format looks unusual - ensure it\'s correct');
    }
  }
  
  static sanitizeConfigForLogging(config: OpenWeatherConfig): any {
    const sanitized = JSON.parse(JSON.stringify(config));
    
    // Redact sensitive information
    if (sanitized.apiKey) {
      sanitized.apiKey = `${sanitized.apiKey.substring(0, 8)}...${sanitized.apiKey.substring(-4)}`;
    }
    
    // Redact sensitive headers
    if (sanitized.defaultHeaders) {
      Object.keys(sanitized.defaultHeaders).forEach(key => {
        if (key.toLowerCase().includes('auth') || key.toLowerCase().includes('key')) {
          sanitized.defaultHeaders[key] = '[REDACTED]';
        }
      });
    }
    
    return sanitized;
  }
  
  static createSecureConfig(): OpenWeatherConfig {
    this.validateEnvironment();
    
    const config: OpenWeatherConfig = {
      apiKey: process.env.OPENWEATHER_API_KEY!,
      timeout: parseInt(process.env.OPENWEATHER_TIMEOUT || '30000'),
      units: (process.env.OPENWEATHER_UNITS as any) || 'metric',
      language: process.env.OPENWEATHER_LANGUAGE || 'en',
      
      rateLimit: {
        requestsPerMinute: parseInt(process.env.OPENWEATHER_RATE_LIMIT || '60'),
        burstCapacity: parseInt(process.env.OPENWEATHER_BURST_CAPACITY || '10'),
        adaptiveFromHeaders: process.env.OPENWEATHER_ADAPTIVE_RATE !== 'false'
      },
      
      // Security headers
      defaultHeaders: {
        'User-Agent': 'OpenWeatherConnector/2.5',
        'X-Request-Source': 'connector-factory',
        ...(process.env.NODE_ENV === 'production' && {
          'X-Environment': 'production'
        })
      }
    };
    
    // Log sanitized configuration (safe for logs)
    console.log('🔧 Configuration loaded:', this.sanitizeConfigForLogging(config));
    
    return config;
  }
}

// Usage
try {
  const secureConfig = SecureConfigManager.createSecureConfig();
  const client = new OpenWeatherClient(secureConfig);
} catch (error) {
  console.error('❌ Configuration error:', error.message);
  process.exit(1);
}
```

### Production Monitoring Configuration

```typescript
interface MonitoringConfig {
  healthCheckInterval: number;
  alertThresholds: {
    errorRate: number;
    responseTime: number;
    rateLimitUsage: number;
  };
  notificationWebhook?: string;
}

class ProductionConfigManager {
  private config: OpenWeatherConfig;
  private monitoring: MonitoringConfig;
  private healthMetrics = {
    totalRequests: 0,
    errors: 0,
    totalResponseTime: 0,
    rateLimitHits: 0
  };
  
  constructor(config: OpenWeatherConfig, monitoring: MonitoringConfig) {
    this.config = config;
    this.monitoring = monitoring;
    
    // Start health monitoring
    setInterval(() => this.performHealthCheck(), monitoring.healthCheckInterval);
  }
  
  recordRequest(responseTime: number, error?: Error, rateLimited = false): void {
    this.healthMetrics.totalRequests++;
    this.healthMetrics.totalResponseTime += responseTime;
    
    if (error) {
      this.healthMetrics.errors++;
    }
    
    if (rateLimited) {
      this.healthMetrics.rateLimitHits++;
    }
  }
  
  private async performHealthCheck(): Promise<void> {
    const metrics = this.getHealthMetrics();
    
    // Check error rate
    if (metrics.errorRate > this.monitoring.alertThresholds.errorRate) {
      await this.sendAlert(`High error rate: ${(metrics.errorRate * 100).toFixed(1)}%`);
    }
    
    // Check average response time
    if (metrics.averageResponseTime > this.monitoring.alertThresholds.responseTime) {
      await this.sendAlert(`Slow response time: ${metrics.averageResponseTime.toFixed(0)}ms`);
    }
    
    // Check rate limit usage
    const rateLimitUsage = this.healthMetrics.rateLimitHits / this.healthMetrics.totalRequests;
    if (rateLimitUsage > this.monitoring.alertThresholds.rateLimitUsage) {
      await this.sendAlert(`High rate limit usage: ${(rateLimitUsage * 100).toFixed(1)}%`);
    }
    
    // Reset metrics after check
    this.resetHealthMetrics();
  }
  
  private getHealthMetrics() {
    return {
      errorRate: this.healthMetrics.totalRequests > 0 
        ? this.healthMetrics.errors / this.healthMetrics.totalRequests 
        : 0,
      averageResponseTime: this.healthMetrics.totalRequests > 0
        ? this.healthMetrics.totalResponseTime / this.healthMetrics.totalRequests
        : 0,
      totalRequests: this.healthMetrics.totalRequests,
      errors: this.healthMetrics.errors,
      rateLimitHits: this.healthMetrics.rateLimitHits
    };
  }
  
  private async sendAlert(message: string): Promise<void> {
    console.error(`🚨 ALERT: ${message}`);
    
    if (this.monitoring.notificationWebhook) {
      try {
        await fetch(this.monitoring.notificationWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `OpenWeather Connector Alert: ${message}`,
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Failed to send webhook alert:', error);
      }
    }
  }
  
  private resetHealthMetrics(): void {
    this.healthMetrics = {
      totalRequests: 0,
      errors: 0,
      totalResponseTime: 0,
      rateLimitHits: 0
    };
  }
}

// Production monitoring setup
const productionConfig = SecureConfigManager.createSecureConfig();
const monitoringConfig: MonitoringConfig = {
  healthCheckInterval: 5 * 60 * 1000, // 5 minutes
  alertThresholds: {
    errorRate: 0.05,        // 5% error rate
    responseTime: 5000,     // 5 second response time
    rateLimitUsage: 0.1     // 10% rate limit hits
  },
  notificationWebhook: process.env.SLACK_WEBHOOK_URL
};

const prodManager = new ProductionConfigManager(productionConfig, monitoringConfig);
```

This enhanced configuration reference provides comprehensive guidance for optimizing the OpenWeather connector for your specific use case while respecting API limits and maintaining reliability across different environments and scales.