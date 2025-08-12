// OpenWeather v2.5 HTTP Client - Production-ready implementation for free tier
// Built using connector-client-builder patterns from ADS-B experience

import { 
  OpenWeatherConnector, 
  OpenWeatherConfig, 
  WeatherRequestOptions,
  WeatherResponse,
  ForecastResponse,
  HourlyForecastResponse,
  MinutelyForecastResponse,
  HistoricalWeatherResponse,
  DailySummaryResponse,
  ResponseEnvelope,
  ConnectorError,
  ErrorCode,
  ErrorSource,
  RateLimitInfo,
  Coordinates
} from './connector-types';
import { WeatherDataTransformer } from './data-transformer';

// Rate limiter implementation
class TokenBucketRateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly capacity: number;
  private readonly refillRate: number;
  private readonly adaptiveFromHeaders: boolean;

  constructor(config: {
    requestsPerMinute: number;
    burstCapacity: number;
    adaptiveFromHeaders: boolean;
  }) {
    this.capacity = config.burstCapacity;
    this.refillRate = config.requestsPerMinute / 60; // per second
    this.adaptiveFromHeaders = config.adaptiveFromHeaders;
    this.tokens = this.capacity;
    this.lastRefill = Date.now();
  }

  async waitForSlot(): Promise<void> {
    this.refillTokens();
    
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return;
    }

    // Wait for next token
    const waitTime = (1 / this.refillRate) * 1000;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return this.waitForSlot();
  }

  private refillTokens(): void {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000;
    const tokensToAdd = Math.min(this.capacity, timePassed * this.refillRate);
    
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  updateFromHeaders(headers: Record<string, string>): void {
    if (!this.adaptiveFromHeaders) return;

    // OpenWeather doesn't provide rate limit headers in standard format
    // but we can adapt if they add them in the future
    const remaining = headers['x-ratelimit-remaining'];
    const reset = headers['x-ratelimit-reset'];
    
    if (remaining && reset) {
      this.tokens = Math.min(parseInt(remaining), this.capacity);
    }
  }
}

// Circuit breaker implementation
enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

class CircuitBreaker {
  private state = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;

  constructor(private config: {
    failureThreshold: number;
    resetTimeout: number;
    successThreshold: number;
  }) {}

  canProceed(): boolean {
    if (this.state === CircuitState.CLOSED) {
      return true;
    }

    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime >= this.config.resetTimeout) {
        this.state = CircuitState.HALF_OPEN;
        this.successCount = 0;
        return true;
      }
      return false;
    }

    // HALF_OPEN state
    return true;
  }

  recordSuccess(): void {
    this.failureCount = 0;
    
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.state = CircuitState.CLOSED;
      }
    }
  }

  recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN;
    }
  }
}

// Main OpenWeather client implementation
export class OpenWeatherClient implements OpenWeatherConnector {
  private config: Required<OpenWeatherConfig>;
  private connected = false;
  private rateLimiter: TokenBucketRateLimiter;
  private circuitBreaker: CircuitBreaker;
  private concurrentRequests = 0;
  private requestIdCounter = 0;

  constructor(config: OpenWeatherConfig) {
    this.config = {
      baseURL: 'https://api.openweathermap.org/data/2.5',
      timeout: 30000,
      userAgent: 'OpenWeatherConnector/2.5',
      units: 'metric',
      language: 'en',
      rateLimit: {
        requestsPerMinute: 60, // Conservative for 1k/day limit
        burstCapacity: 10,
        adaptiveFromHeaders: true
      },
      circuitBreaker: {
        failureThreshold: 5,
        resetTimeout: 60000,
        successThreshold: 3
      },
      retries: {
        maxRetries: 3,
        baseDelay: 1000,
        maxDelay: 30000
      },
      defaultHeaders: {},
      ...config
    };

    this.rateLimiter = new TokenBucketRateLimiter(this.config.rateLimit);
    this.circuitBreaker = new CircuitBreaker(this.config.circuitBreaker);
  }

  // Lifecycle management
  async initialize(): Promise<void> {
    // Validate API key and basic connectivity with minimal request
    try {
      const testResponse = await this.getCurrentWeather(40.7128, -74.0060); // NYC test
      if (testResponse.location) {
        this.connected = true;
      }
    } catch (error) {
      throw new ConnectorError(
        'Failed to initialize OpenWeather connector',
        ErrorCode.AUTHENTICATION_FAILED,
        { cause: error as Error }
      );
    }
  }

  async connect(): Promise<void> {
    if (!this.connected) {
      await this.initialize();
    }
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  // Core request method with all resilience patterns
  private async request<T>(
    endpoint: string,
    options: WeatherRequestOptions & { params?: Record<string, any> } = {}
  ): Promise<ResponseEnvelope<T>> {
    const requestId = `req_${++this.requestIdCounter}_${Date.now()}`;
    const startTime = Date.now();
    let retryCount = 0;

    // Circuit breaker check
    if (!this.circuitBreaker.canProceed()) {
      throw new ConnectorError(
        'Circuit breaker is open',
        ErrorCode.CIRCUIT_BREAKER_OPEN,
        { requestId }
      );
    }

    // Concurrent request limiting
    if (this.concurrentRequests >= 10) {
      throw new ConnectorError(
        'Too many concurrent requests',
        ErrorCode.RATE_LIMITED,
        { requestId }
      );
    }

    this.concurrentRequests++;

    try {
      // Rate limiting
      await this.rateLimiter.waitForSlot();

      const response = await this.executeRequest<T>(endpoint, options, requestId);
      
      this.circuitBreaker.recordSuccess();
      
      return {
        data: response.data,
        status: response.status,
        headers: response.headers,
        meta: {
          timestamp: new Date().toISOString(),
          duration: Date.now() - startTime,
          retryCount,
          requestId,
          rateLimit: response.rateLimit
        }
      };

    } catch (error) {
      this.circuitBreaker.recordFailure();
      
      if (error instanceof ConnectorError && error.retryable && retryCount < this.config.retries.maxRetries) {
        retryCount++;
        const delay = Math.min(
          this.config.retries.baseDelay * Math.pow(2, retryCount - 1) + Math.random() * 1000,
          this.config.retries.maxDelay
        );
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.request<T>(endpoint, options);
      }

      throw error;
    } finally {
      this.concurrentRequests--;
    }
  }

  private async executeRequest<T>(
    endpoint: string,
    options: WeatherRequestOptions & { params?: Record<string, any> },
    requestId: string
  ): Promise<{ data: T; status: number; headers: Record<string, string>; rateLimit?: RateLimitInfo }> {
    const url = new URL(endpoint, this.config.baseURL);
    
    // Add API key and default parameters
    url.searchParams.set('appid', this.config.apiKey);
    url.searchParams.set('units', options.units || this.config.units);
    url.searchParams.set('lang', options.language || this.config.language);

    // Add custom parameters
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
      });
    }

    const headers = {
      'User-Agent': this.config.userAgent,
      'X-Request-ID': requestId,
      ...this.config.defaultHeaders
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.config.timeout);

    if (options.signal) {
      options.signal.addEventListener('abort', () => controller.abort());
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Update rate limiter from headers
      this.rateLimiter.updateFromHeaders(responseHeaders);

      if (!response.ok) {
        const errorText = await response.text();
        throw ConnectorError.fromHttpStatus(response.status, errorText, requestId);
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
        headers: responseHeaders
      };

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ConnectorError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ConnectorError(
          'Request timed out',
          ErrorCode.NETWORK_ERROR,
          { requestId, cause: error }
        );
      }

      throw new ConnectorError(
        'Network request failed',
        ErrorCode.NETWORK_ERROR,
        { requestId, cause: error as Error }
      );
    }
  }

  // Coordinate validation helper (using data transformer)
  private validateCoordinates(lat: number, lon: number): void {
    WeatherDataTransformer.validateCoordinates(lat, lon, 'API request');
  }

  // Weather-specific methods (user-friendly API)
  async getCurrentWeather(lat: number, lon: number, options: WeatherRequestOptions = {}): Promise<WeatherResponse> {
    this.validateCoordinates(lat, lon);
    
    const response = await this.request<any>('/weather', {
      ...options,
      params: {
        lat,
        lon
      }
    });

    return WeatherDataTransformer.transformCurrentWeather(response.data);
  }

  async getForecast(lat: number, lon: number, days = 5, options: WeatherRequestOptions = {}): Promise<ForecastResponse> {
    this.validateCoordinates(lat, lon);
    
    if (days < 1 || days > 5) {
      throw new ConnectorError(
        `Invalid days parameter: ${days}. Must be between 1 and 5 for free tier`,
        ErrorCode.VALIDATION_ERROR
      );
    }

    const response = await this.request<any>('/forecast', {
      ...options,
      params: {
        lat,
        lon,
        cnt: days * 8 // 8 forecasts per day (3-hour intervals)
      }
    });

    return WeatherDataTransformer.transformForecast(response.data, days);
  }

  async getHourlyForecast(lat: number, lon: number, hours = 24, options: WeatherRequestOptions = {}): Promise<HourlyForecastResponse> {
    this.validateCoordinates(lat, lon);
    
    if (hours < 1 || hours > 120) {
      throw new ConnectorError(
        `Invalid hours parameter: ${hours}. Must be between 1 and 120 (5 days in 3-hour intervals)`,
        ErrorCode.VALIDATION_ERROR
      );
    }

    const response = await this.request<any>('/forecast', {
      ...options,
      params: {
        lat,
        lon,
        cnt: Math.ceil(hours / 3) // Convert to 3-hour intervals
      }
    });

    return WeatherDataTransformer.transformHourlyForecast(response.data, hours);
  }

  async getMinutelyForecast(lat: number, lon: number, options: WeatherRequestOptions = {}): Promise<MinutelyForecastResponse> {
    throw new ConnectorError(
      'Minutely forecasts not available in OpenWeather v2.5 free tier',
      ErrorCode.CONFIGURATION_ERROR
    );
  }

  async getHistoricalWeather(lat: number, lon: number, date: Date, options: WeatherRequestOptions = {}): Promise<HistoricalWeatherResponse> {
    throw new ConnectorError(
      'Historical weather data requires paid subscription',
      ErrorCode.SUBSCRIPTION_EXPIRED
    );
  }

  async getDailySummary(lat: number, lon: number, date: Date, options: WeatherRequestOptions = {}): Promise<DailySummaryResponse> {
    throw new ConnectorError(
      'Daily summary data requires paid subscription',
      ErrorCode.SUBSCRIPTION_EXPIRED
    );
  }

  // Location-based convenience methods
  async findByCity(city: string, country?: string): Promise<WeatherResponse> {
    // This would require geocoding - simplified for demo
    throw new ConnectorError(
      'City-based queries require geocoding integration',
      ErrorCode.CONFIGURATION_ERROR
    );
  }

  async findByZipCode(zipCode: string, country?: string): Promise<WeatherResponse> {
    // This would require geocoding - simplified for demo
    throw new ConnectorError(
      'Zip code queries require geocoding integration', 
      ErrorCode.CONFIGURATION_ERROR
    );
  }

  // Data transformation now handled by WeatherDataTransformer class
}

// Export default client
export default OpenWeatherClient;