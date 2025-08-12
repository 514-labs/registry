// OpenWeather configuration helper
// Loads configuration from environment variables with sensible defaults

import { OpenWeatherConfig } from './connector-types';

export function createConfigFromEnv(): OpenWeatherConfig {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      'OPENWEATHER_API_KEY environment variable is required. ' +
      'Get your free API key at: https://openweathermap.org/api'
    );
  }

  return {
    apiKey,
    baseURL: process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5',
    units: (process.env.OPENWEATHER_UNITS as 'standard' | 'metric' | 'imperial') || 'metric',
    language: process.env.OPENWEATHER_LANGUAGE || 'en',
    timeout: 30000,
    userAgent: 'OpenWeatherConnector/2.5',
    
    // Production-ready rate limiting for 1k/day free tier
    rateLimit: {
      requestsPerMinute: 60, // Conservative for daily limit
      burstCapacity: 10,
      adaptiveFromHeaders: true
    },
    
    // Circuit breaker for API resilience
    circuitBreaker: {
      failureThreshold: 5,
      resetTimeout: 60000,
      successThreshold: 3
    },
    
    // Retry configuration
    retries: {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 30000
    }
  };
}

// Quick setup function for testing
export function createOpenWeatherClient() {
  const config = createConfigFromEnv();
  
  // Dynamic import to avoid bundling issues
  return import('./client').then(module => new module.OpenWeatherClient(config));
}