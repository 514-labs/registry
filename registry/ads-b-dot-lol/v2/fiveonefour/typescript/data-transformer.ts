import { ConnectorError, ErrorCode, ErrorSource } from './types';

export interface Schema {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean';
  properties?: Record<string, Schema>;
  items?: Schema;
  required?: string[];
  format?: string;
  transform?: (value: any) => any;
}

export class DataTransformer {
  static serialize(data: any, schema?: Schema): any {
    if (!schema) return data;
    
    try {
      return this.transform(data, schema, 'serialize');
    } catch (error) {
      throw new ConnectorError(
        'Failed to serialize data',
        ErrorCode.VALIDATION_ERROR,
        {
          source: ErrorSource.DESERIALIZE,
          details: { data, schema },
          cause: error as Error
        }
      );
    }
  }

  static deserialize(data: any, schema?: Schema): any {
    if (!schema) return data;
    
    try {
      return this.transform(data, schema, 'deserialize');
    } catch (error) {
      throw new ConnectorError(
        'Failed to deserialize data',
        ErrorCode.PARSING_ERROR,
        {
          source: ErrorSource.DESERIALIZE,
          details: { data, schema },
          cause: error as Error
        }
      );
    }
  }

  static validate(data: any, schema: Schema): boolean {
    try {
      this.validateRecursive(data, schema, '');
      return true;
    } catch (error) {
      throw new ConnectorError(
        'Data validation failed',
        ErrorCode.VALIDATION_ERROR,
        {
          source: ErrorSource.DESERIALIZE,
          details: { data, schema, validationError: error },
          cause: error as Error
        }
      );
    }
  }

  private static transform(data: any, schema: Schema, direction: 'serialize' | 'deserialize'): any {
    // Apply custom transform if provided
    if (schema.transform && direction === 'deserialize') {
      return schema.transform(data);
    }

    switch (schema.type) {
      case 'object':
        if (!data || typeof data !== 'object') return data;
        
        const result: any = {};
        if (schema.properties) {
          for (const [key, propSchema] of Object.entries(schema.properties)) {
            if (data[key] !== undefined) {
              result[key] = this.transform(data[key], propSchema, direction);
            }
          }
        }
        
        // Copy any additional properties not in schema
        for (const key in data) {
          if (!schema.properties || !(key in schema.properties)) {
            result[key] = data[key];
          }
        }
        
        return result;

      case 'array':
        if (!Array.isArray(data)) return data;
        
        if (schema.items) {
          return data.map(item => this.transform(item, schema.items!, direction));
        }
        return data;

      case 'string':
        if (direction === 'deserialize' && schema.format) {
          switch (schema.format) {
            case 'date-time':
              return new Date(data);
            case 'date':
              return new Date(data + 'T00:00:00Z');
            default:
              return data;
          }
        }
        return data;

      case 'number':
        if (direction === 'deserialize' && typeof data === 'string') {
          const num = parseFloat(data);
          if (!isNaN(num)) return num;
        }
        return data;

      case 'boolean':
        if (direction === 'deserialize' && typeof data === 'string') {
          return data === 'true' || data === '1';
        }
        return data;

      default:
        return data;
    }
  }

  private static validateRecursive(data: any, schema: Schema, path: string): void {
    // Type validation
    const actualType = Array.isArray(data) ? 'array' : typeof data;
    if (actualType !== schema.type && data !== null && data !== undefined) {
      throw new Error(`Type mismatch at ${path}: expected ${schema.type}, got ${actualType}`);
    }

    switch (schema.type) {
      case 'object':
        if (!data || typeof data !== 'object') break;
        
        // Check required fields
        if (schema.required) {
          for (const field of schema.required) {
            if (!(field in data) || data[field] === undefined) {
              throw new Error(`Required field missing at ${path}.${field}`);
            }
          }
        }
        
        // Validate properties
        if (schema.properties) {
          for (const [key, propSchema] of Object.entries(schema.properties)) {
            if (key in data) {
              this.validateRecursive(data[key], propSchema, `${path}.${key}`);
            }
          }
        }
        break;

      case 'array':
        if (!Array.isArray(data)) break;
        
        if (schema.items) {
          data.forEach((item, index) => {
            this.validateRecursive(item, schema.items!, `${path}[${index}]`);
          });
        }
        break;

      case 'string':
        if (typeof data !== 'string' && data !== null && data !== undefined) {
          throw new Error(`Type mismatch at ${path}: expected string`);
        }
        
        if (schema.format && data) {
          switch (schema.format) {
            case 'date-time':
              if (isNaN(Date.parse(data))) {
                throw new Error(`Invalid date-time format at ${path}`);
              }
              break;
            case 'email':
              // Simple email validation to avoid ReDoS - just check for @ and .
              if (!data.includes('@') || !data.includes('.') || data.includes(' ')) {
                throw new Error(`Invalid email format at ${path}`);
              }
              break;
            case 'uri':
              try {
                new URL(data);
              } catch {
                throw new Error(`Invalid URI format at ${path}`);
              }
              break;
          }
        }
        break;

      case 'number':
        if (typeof data !== 'number' && data !== null && data !== undefined) {
          throw new Error(`Type mismatch at ${path}: expected number`);
        }
        break;

      case 'boolean':
        if (typeof data !== 'boolean' && data !== null && data !== undefined) {
          throw new Error(`Type mismatch at ${path}: expected boolean`);
        }
        break;
    }
  }
}

// Pre-defined schemas for ADS-B data
export const AircraftSchema: Schema = {
  type: 'object',
  properties: {
    hex: { type: 'string' },
    type: { type: 'string' },
    flight: { type: 'string' },
    r: { type: 'string' },
    t: { type: 'string' },
    alt_baro: { type: 'number' },
    alt_geom: { type: 'number' },
    gs: { type: 'number' },
    track: { type: 'number' },
    baro_rate: { type: 'number' },
    squawk: { type: 'string' },
    emergency: { type: 'string' },
    category: { type: 'string' },
    lat: { type: 'number' },
    lon: { type: 'number' },
    seen: { type: 'number' },
    rssi: { type: 'number' }
  },
  required: ['hex']
};

export const AircraftResponseSchema: Schema = {
  type: 'object',
  properties: {
    ac: {
      type: 'array',
      items: AircraftSchema
    },
    total: { type: 'number' },
    ctime: { type: 'number' },
    ptime: { type: 'number' }
  },
  required: ['ac', 'total']
};