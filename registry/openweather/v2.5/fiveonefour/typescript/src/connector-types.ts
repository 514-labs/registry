// OpenWeather Connector Types - Production-ready interfaces
// Built using connector-client-builder patterns from ADS-B experience

import { Connector } from '@workspace/connector-types';

// Core connector interface following specification
export interface OpenWeatherConnector extends Partial<Connector> {
  // Weather-specific methods
  getCurrentWeather(lat: number, lon: number, options?: WeatherRequestOptions): Promise<WeatherResponse>;
  getForecast(lat: number, lon: number, days?: number, options?: WeatherRequestOptions): Promise<ForecastResponse>;
  getHourlyForecast(lat: number, lon: number, hours?: number, options?: WeatherRequestOptions): Promise<HourlyForecastResponse>;
  getMinutelyForecast(lat: number, lon: number, options?: WeatherRequestOptions): Promise<MinutelyForecastResponse>;
  getHistoricalWeather(lat: number, lon: number, date: Date, options?: WeatherRequestOptions): Promise<HistoricalWeatherResponse>;
  getDailySummary(lat: number, lon: number, date: Date, options?: WeatherRequestOptions): Promise<DailySummaryResponse>;
  
  // Location-based convenience methods
  findByCity(city: string, country?: string): Promise<WeatherResponse>;
  findByZipCode(zipCode: string, country?: string): Promise<WeatherResponse>;
}

// Configuration interface with OpenWeather-specific options
export interface OpenWeatherConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  userAgent?: string;
  units?: 'standard' | 'metric' | 'imperial';
  language?: string;
  
  // Rate limiting configuration (critical for 1k/day limit)
  rateLimit?: {
    requestsPerMinute?: number;
    burstCapacity?: number;
    adaptiveFromHeaders?: boolean;
  };
  
  // Circuit breaker configuration
  circuitBreaker?: {
    failureThreshold?: number;
    resetTimeout?: number;
    successThreshold?: number;
  };
  
  // Retry configuration
  retries?: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
  };
  
  // Default request headers
  defaultHeaders?: Record<string, string>;
}

// Request options for weather queries
export interface WeatherRequestOptions {
  timeout?: number;
  signal?: AbortSignal;
  units?: 'standard' | 'metric' | 'imperial';
  language?: string;
  excludeParts?: ('current' | 'minutely' | 'hourly' | 'daily' | 'alerts')[];
}

// Geographic coordinate interface with validation
export interface Coordinates {
  latitude: number;  // -90 to 90
  longitude: number; // -180 to 180
}

// Response envelope pattern (from ADS-B success)
export interface ResponseEnvelope<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
  meta: {
    timestamp: string;
    duration: number;
    retryCount: number;
    requestId: string;
    rateLimit?: RateLimitInfo;
    location?: Coordinates;
  };
}

// Rate limiting information
export interface RateLimitInfo {
  remaining: number;
  reset: Date;
  limit: number;
  used: number;
}

// Weather response interfaces
export interface WeatherResponse {
  location: LocationInfo;
  current: CurrentWeather;
  alerts?: WeatherAlert[];
}

export interface ForecastResponse {
  location: LocationInfo;
  current?: CurrentWeather;
  daily: DailyWeather[];
  alerts?: WeatherAlert[];
}

export interface HourlyForecastResponse {
  location: LocationInfo;
  current?: CurrentWeather;
  hourly: HourlyWeather[];
}

export interface MinutelyForecastResponse {
  location: LocationInfo;
  current?: CurrentWeather;
  minutely: MinutelyWeather[];
}

export interface HistoricalWeatherResponse {
  location: LocationInfo;
  data: HistoricalWeatherData[];
}

export interface DailySummaryResponse {
  location: LocationInfo;
  date: string;
  summary: DailySummary;
}

// Location information
export interface LocationInfo {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_offset: number;
  name?: string; // For city-based queries
  country?: string;
}

// Current weather data
export interface CurrentWeather {
  timestamp: Date;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure?: number;
  dew_point?: number;
  uvi?: number;
  clouds?: number;
  visibility?: number;
  wind?: WindInfo;
  weather: WeatherCondition[];
  sun?: SunInfo;
}

// Wind information
export interface WindInfo {
  speed: number;
  direction?: number; // 0-360 degrees
  gust?: number;
}

// Sun/Moon information
export interface SunInfo {
  sunrise?: Date;
  sunset?: Date;
  moonrise?: Date;
  moonset?: Date;
  moon_phase?: number; // 0-1
}

// Weather condition
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

// Daily weather forecast
export interface DailyWeather {
  date: Date;
  summary?: string;
  temperature: {
    day: number;
    min: number;
    max: number;
    night?: number;
    evening?: number;
    morning?: number;
  };
  feels_like?: {
    day: number;
    night?: number;
    evening?: number;
    morning?: number;
  };
  humidity: number;
  pressure?: number;
  wind?: WindInfo;
  weather: WeatherCondition[];
  clouds?: number;
  precipitation?: {
    probability: number;
    rain?: number;
    snow?: number;
  };
  uvi?: number;
  sun?: SunInfo;
}

// Hourly weather forecast
export interface HourlyWeather {
  timestamp: Date;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure?: number;
  dew_point?: number;
  uvi?: number;
  clouds?: number;
  visibility?: number;
  wind?: WindInfo;
  weather: WeatherCondition[];
  precipitation?: {
    probability: number;
    rain?: number;
    snow?: number;
  };
}

// Minutely precipitation forecast
export interface MinutelyWeather {
  timestamp: Date;
  precipitation: number; // mm
}

// Historical weather data
export interface HistoricalWeatherData {
  timestamp: Date;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure?: number;
  dew_point?: number;
  uvi?: number;
  clouds?: number;
  visibility?: number;
  wind?: WindInfo;
  weather: WeatherCondition[];
}

// Daily summary data
export interface DailySummary {
  cloud_cover?: AggregatedData;
  humidity?: AggregatedData;
  pressure?: AggregatedData;
  temperature?: TemperatureAggregated;
  wind?: WindAggregated;
  precipitation?: PrecipitationAggregated;
}

export interface AggregatedData {
  afternoon?: number;
  day?: number;
  evening?: number;
  morning?: number;
  night?: number;
}

export interface TemperatureAggregated extends AggregatedData {
  min: number;
  max: number;
}

export interface WindAggregated {
  max?: {
    speed: number;
    direction: number;
  };
}

export interface PrecipitationAggregated {
  total: number;
}

// Weather alert
export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: Date;
  end: Date;
  description: string;
  tags?: string[];
}

// Error types (following ADS-B structured error pattern)
export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  RATE_LIMITED = 'RATE_LIMITED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CIRCUIT_BREAKER_OPEN = 'CIRCUIT_BREAKER_OPEN',
  SERVER_ERROR = 'SERVER_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_COORDINATES = 'INVALID_COORDINATES',
  SUBSCRIPTION_EXPIRED = 'SUBSCRIPTION_EXPIRED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED'
}

export enum ErrorSource {
  REQUEST = 'REQUEST',
  RESPONSE = 'RESPONSE',
  CONFIGURATION = 'CONFIGURATION',
  VALIDATION = 'VALIDATION',
  RATE_LIMITER = 'RATE_LIMITER',
  CIRCUIT_BREAKER = 'CIRCUIT_BREAKER'
}

// Structured error class (from ADS-B success pattern)
export class ConnectorError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode?: number;
  public readonly requestId?: string;
  public readonly source?: ErrorSource;
  public readonly details?: any;

  constructor(
    message: string,
    code: ErrorCode,
    options: {
      statusCode?: number;
      requestId?: string;
      source?: ErrorSource;
      cause?: Error;
      details?: any;
    } = {}
  ) {
    super(message);
    this.name = 'ConnectorError';
    this.code = code;
    this.statusCode = options.statusCode;
    this.requestId = options.requestId;
    this.source = options.source;
    this.details = options.details;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConnectorError);
    }
  }

  get retryable(): boolean {
    return [
      ErrorCode.NETWORK_ERROR,
      ErrorCode.RATE_LIMITED,
      ErrorCode.SERVER_ERROR,
      ErrorCode.CIRCUIT_BREAKER_OPEN
    ].includes(this.code);
  }

  // Type guards for error handling
  isRateLimit(): this is ConnectorError & { code: ErrorCode.RATE_LIMITED } {
    return this.code === ErrorCode.RATE_LIMITED;
  }

  isAuthError(): this is ConnectorError & { code: ErrorCode.AUTHENTICATION_FAILED } {
    return this.code === ErrorCode.AUTHENTICATION_FAILED;
  }

  isValidationError(): this is ConnectorError & { code: ErrorCode.VALIDATION_ERROR } {
    return this.code === ErrorCode.VALIDATION_ERROR;
  }

  static fromHttpStatus(status: number, message: string, requestId?: string): ConnectorError {
    let code: ErrorCode;
    
    switch (status) {
      case 401:
        code = ErrorCode.AUTHENTICATION_FAILED;
        break;
      case 403:
        code = ErrorCode.FORBIDDEN;
        break;
      case 429:
        code = ErrorCode.RATE_LIMITED;
        break;
      case 400:
        code = ErrorCode.VALIDATION_ERROR;
        break;
      case 402:
        code = ErrorCode.SUBSCRIPTION_EXPIRED;
        break;
      default:
        code = status >= 500 ? ErrorCode.SERVER_ERROR : ErrorCode.NETWORK_ERROR;
    }

    return new ConnectorError(message, code, { statusCode: status, requestId });
  }
}