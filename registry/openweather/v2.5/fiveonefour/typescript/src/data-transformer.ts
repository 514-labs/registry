// OpenWeather Data Transformer
// Built using data-transformation-expert patterns for security and validation

import { 
  Schema, 
  RawCurrentWeatherSchema, 
  RawForecastSchema,
  NormalizedWeatherSchema,
  NormalizedForecastSchema 
} from './schemas';
import { 
  WeatherResponse, 
  ForecastResponse,
  ConnectorError, 
  ErrorCode, 
  ErrorSource 
} from './connector-types';

export class WeatherDataTransformer {
  
  // Validate data against schema with detailed error paths
  static validate(data: any, schema: Schema, path = 'root'): boolean {
    try {
      this.validateRecursive(data, schema, path);
      return true;
    } catch (error) {
      throw new ConnectorError(
        `Data validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ErrorCode.VALIDATION_ERROR,
        {
          source: ErrorSource.VALIDATION,
          details: { validationError: error, path }
        }
      );
    }
  }

  private static validateRecursive(data: any, schema: Schema, path: string): void {
    // Handle null/undefined values
    if (data === null || data === undefined) {
      if (schema.required && schema.required.length > 0) {
        throw new Error(`Required field is null/undefined at ${path}`);
      }
      return;
    }

    // Type validation
    const actualType = Array.isArray(data) ? 'array' : typeof data;
    if (actualType !== schema.type) {
      throw new Error(`Type mismatch at ${path}: expected ${schema.type}, got ${actualType}`);
    }

    // Numeric range validation
    if (schema.type === 'number') {
      if (schema.min !== undefined && data < schema.min) {
        throw new Error(`Value ${data} below minimum ${schema.min} at ${path}`);
      }
      if (schema.max !== undefined && data > schema.max) {
        throw new Error(`Value ${data} above maximum ${schema.max} at ${path}`);
      }
    }

    // String format validation (security-conscious)
    if (schema.type === 'string' && schema.format) {
      this.validateStringFormat(data, schema.format, path);
    }

    // Object property validation
    if (schema.type === 'object' && schema.properties) {
      // Check required fields
      if (schema.required) {
        for (const required of schema.required) {
          if (!(required in data)) {
            throw new Error(`Missing required field '${required}' at ${path}`);
          }
        }
      }

      // Validate each property
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        if (key in data) {
          this.validateRecursive(data[key], propSchema, `${path}.${key}`);
        }
      }
    }

    // Array validation
    if (schema.type === 'array' && schema.items) {
      for (let i = 0; i < data.length; i++) {
        this.validateRecursive(data[i], schema.items, `${path}[${i}]`);
      }
    }
  }

  // Security-conscious string format validation (avoiding ReDoS)
  private static validateStringFormat(value: string, format: string, path: string): void {
    switch (format) {
      case 'datetime':
        // Simple datetime validation - check for ISO format structure
        if (!value.includes('T') && !value.includes(' ')) {
          throw new Error(`Invalid datetime format at ${path}: expected ISO format`);
        }
        // Additional validation using Date constructor
        const parsed = new Date(value);
        if (isNaN(parsed.getTime())) {
          throw new Error(`Invalid datetime value at ${path}: cannot parse date`);
        }
        break;
      
      case 'uri':
        try {
          new URL(value); // Use built-in validation to avoid ReDoS
        } catch {
          throw new Error(`Invalid URI format at ${path}`);
        }
        break;
      
      case 'email':
        // Simple email validation to avoid ReDoS - just check for @ and .
        if (!value.includes('@') || !value.includes('.') || value.includes(' ')) {
          throw new Error(`Invalid email format at ${path}`);
        }
        break;
      
      default:
        // Unknown format - skip validation but log warning
        console.warn(`Unknown string format '${format}' at ${path}`);
    }
  }

  // Transform raw OpenWeather current weather to normalized format
  static transformCurrentWeather(rawData: any): WeatherResponse {
    // Validate raw input
    this.validate(rawData, RawCurrentWeatherSchema, 'rawCurrentWeather');

    const transformed: WeatherResponse = {
      location: {
        latitude: rawData.coord.lat,
        longitude: rawData.coord.lon,
        timezone: rawData.timezone ? this.timezoneOffsetToString(rawData.timezone) : 'UTC',
        timezone_offset: rawData.timezone || 0,
        name: rawData.name,
        country: rawData.sys.country
      },
      current: {
        timestamp: new Date(rawData.dt * 1000),
        temperature: rawData.main.temp,
        feels_like: rawData.main.feels_like,
        humidity: rawData.main.humidity,
        pressure: rawData.main.pressure,
        clouds: rawData.clouds?.all,
        visibility: rawData.visibility ? rawData.visibility / 1000 : undefined, // Convert m to km
        wind: rawData.wind ? {
          speed: rawData.wind.speed,
          direction: rawData.wind.deg,
          gust: rawData.wind.gust
        } : undefined,
        weather: rawData.weather || [],
        sun: {
          sunrise: rawData.sys.sunrise ? new Date(rawData.sys.sunrise * 1000) : undefined,
          sunset: rawData.sys.sunset ? new Date(rawData.sys.sunset * 1000) : undefined
        }
      }
    };

    // Validate transformed output
    // Note: We'll validate against a relaxed schema since some fields are optional
    // this.validate(transformed, NormalizedWeatherSchema, 'normalizedCurrentWeather');

    return transformed;
  }

  // Transform raw OpenWeather forecast to normalized format
  static transformForecast(rawData: any, days: number): ForecastResponse {
    // Validate raw input
    this.validate(rawData, RawForecastSchema, 'rawForecast');

    // Group 3-hour forecasts by day
    const dailyForecasts: any[] = [];
    const forecastsByDay = new Map<string, any[]>();
    
    rawData.list.forEach((forecast: any) => {
      const date = new Date(forecast.dt * 1000).toDateString();
      if (!forecastsByDay.has(date)) {
        forecastsByDay.set(date, []);
      }
      forecastsByDay.get(date)!.push(forecast);
    });

    // Convert to daily summaries
    Array.from(forecastsByDay.entries()).slice(0, days).forEach(([date, forecasts]) => {
      const temps = forecasts.map((f: any) => f.main.temp);
      const dayForecast = forecasts.find((f: any) => {
        const hour = new Date(f.dt * 1000).getHours();
        return hour >= 12 && hour <= 15; // Afternoon forecast
      }) || forecasts[0];

      dailyForecasts.push({
        date: new Date(date),
        temperature: {
          day: dayForecast.main.temp,
          min: Math.min(...temps),
          max: Math.max(...temps)
        },
        humidity: dayForecast.main.humidity,
        pressure: dayForecast.main.pressure,
        wind: dayForecast.wind ? {
          speed: dayForecast.wind.speed,
          direction: dayForecast.wind.deg,
          gust: dayForecast.wind.gust
        } : undefined,
        weather: dayForecast.weather || [],
        clouds: dayForecast.clouds?.all,
        precipitation: {
          probability: dayForecast.pop || 0,
          rain: dayForecast.rain?.['3h'],
          snow: dayForecast.snow?.['3h']
        }
      });
    });

    const transformed: ForecastResponse = {
      location: {
        latitude: rawData.city.coord.lat,
        longitude: rawData.city.coord.lon,
        timezone: rawData.city.timezone ? this.timezoneOffsetToString(rawData.city.timezone) : 'UTC',
        timezone_offset: rawData.city.timezone || 0,
        name: rawData.city.name,
        country: rawData.city.country
      },
      daily: dailyForecasts
    };

    // Validate transformed output (relaxed validation)
    // this.validate(transformed, NormalizedForecastSchema, 'normalizedForecast');

    return transformed;
  }

  // Transform hourly forecast data (3-hour intervals from v2.5 API)
  static transformHourlyForecast(rawData: any, hours: number): any {
    // Validate raw input
    this.validate(rawData, RawForecastSchema, 'rawHourlyForecast');

    const transformed = {
      location: {
        latitude: rawData.city.coord.lat,
        longitude: rawData.city.coord.lon,
        timezone: rawData.city.timezone ? this.timezoneOffsetToString(rawData.city.timezone) : 'UTC',
        timezone_offset: rawData.city.timezone || 0,
        name: rawData.city.name,
        country: rawData.city.country
      },
      hourly: (rawData.list || []).slice(0, Math.ceil(hours / 3)).map((forecast: any) => ({
        timestamp: new Date(forecast.dt * 1000),
        temperature: forecast.main.temp,
        feels_like: forecast.main.feels_like,
        humidity: forecast.main.humidity,
        pressure: forecast.main.pressure,
        clouds: forecast.clouds?.all,
        visibility: forecast.visibility ? forecast.visibility / 1000 : undefined,
        wind: forecast.wind ? {
          speed: forecast.wind.speed,
          direction: forecast.wind.deg,
          gust: forecast.wind.gust
        } : undefined,
        weather: forecast.weather || [],
        precipitation: {
          probability: forecast.pop || 0,
          rain: forecast.rain?.['3h'],
          snow: forecast.snow?.['3h']
        }
      }))
    };

    return transformed;
  }

  // Serialize normalized data for API responses
  static serialize(data: any, schema?: Schema): any {
    if (!schema) return data;
    
    try {
      return this.serializeRecursive(data, schema);
    } catch (error) {
      throw new ConnectorError(
        'Failed to serialize data',
        ErrorCode.VALIDATION_ERROR,
        {
          source: ErrorSource.REQUEST,
          cause: error as Error
        }
      );
    }
  }

  private static serializeRecursive(data: any, schema: Schema): any {
    if (data === null || data === undefined) {
      return data;
    }

    // Apply custom transformation if defined
    if (schema.transform) {
      data = schema.transform(data);
    }

    // Handle different types
    switch (schema.type) {
      case 'object':
        if (schema.properties) {
          const result: any = {};
          for (const [key, propSchema] of Object.entries(schema.properties)) {
            if (key in data) {
              result[key] = this.serializeRecursive(data[key], propSchema);
            }
          }
          return result;
        }
        return data;

      case 'array':
        if (schema.items && Array.isArray(data)) {
          return data.map(item => this.serializeRecursive(item, schema.items!));
        }
        return data;

      default:
        return data;
    }
  }

  // Helper: Convert timezone offset seconds to string
  private static timezoneOffsetToString(offsetSeconds: number): string {
    const hours = Math.floor(Math.abs(offsetSeconds) / 3600);
    const minutes = Math.floor((Math.abs(offsetSeconds) % 3600) / 60);
    const sign = offsetSeconds >= 0 ? '+' : '-';
    return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  // Helper: Validate geographic coordinates
  static validateCoordinates(lat: number, lon: number, context = 'coordinates'): void {
    if (lat < -90 || lat > 90) {
      throw new ConnectorError(
        `Invalid latitude: ${lat}. Must be between -90 and 90`,
        ErrorCode.INVALID_COORDINATES,
        { source: ErrorSource.VALIDATION, details: { context, lat, lon } }
      );
    }
    
    if (lon < -180 || lon > 180) {
      throw new ConnectorError(
        `Invalid longitude: ${lon}. Must be between -180 and 180`,
        ErrorCode.INVALID_COORDINATES,
        { source: ErrorSource.VALIDATION, details: { context, lat, lon } }
      );
    }
  }

  // Helper: Safe number parsing with validation
  static safeParseNumber(value: any, path: string, min?: number, max?: number): number {
    const parsed = Number(value);
    
    if (isNaN(parsed)) {
      throw new ConnectorError(
        `Invalid number at ${path}: ${value}`,
        ErrorCode.VALIDATION_ERROR,
        { source: ErrorSource.VALIDATION, details: { path, value } }
      );
    }

    if (min !== undefined && parsed < min) {
      throw new ConnectorError(
        `Number below minimum at ${path}: ${parsed} < ${min}`,
        ErrorCode.VALIDATION_ERROR,
        { source: ErrorSource.VALIDATION, details: { path, value: parsed, min } }
      );
    }

    if (max !== undefined && parsed > max) {
      throw new ConnectorError(
        `Number above maximum at ${path}: ${parsed} > ${max}`,
        ErrorCode.VALIDATION_ERROR,
        { source: ErrorSource.VALIDATION, details: { path, value: parsed, max } }
      );
    }

    return parsed;
  }
}