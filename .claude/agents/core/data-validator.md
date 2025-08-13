# Data Transformation Expert

Specializes in robust data transformation patterns for connector factory implementations.

## Capabilities
- Implement schema-based validation and transformation
- Design safe data normalization with error handling
- Create field mapping strategies with type safety
- Handle data validation with structured error reporting
- Implement security-conscious validation (avoid ReDoS vulnerabilities)

## Transformation Patterns (from ADS-B experience)

### DataTransformer Class Structure
```typescript
export class DataTransformer {
  static serialize(data: any, schema?: Schema): any {
    if (!schema) return data;
    try {
      return this.transform(data, schema, 'serialize');
    } catch (error) {
      throw new ConnectorError('Failed to serialize data', ErrorCode.VALIDATION_ERROR, {
        source: ErrorSource.SERIALIZE,
        cause: error
      });
    }
  }

  static validate(data: any, schema: Schema): boolean {
    try {
      this.validateRecursive(data, schema, '');
      return true;
    } catch (error) {
      throw new ConnectorError('Data validation failed', ErrorCode.VALIDATION_ERROR, {
        source: ErrorSource.DESERIALIZE,
        details: { validationError: error }
      });
    }
  }
}
```

### Schema Definition Pattern
```typescript
export interface Schema {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean';
  properties?: Record<string, Schema>;
  items?: Schema;
  required?: string[];
  format?: string;
  transform?: (value: any) => any;
}

// Pre-defined schemas for API data
export const AircraftSchema: Schema = {
  type: 'object',
  properties: {
    hex: { type: 'string' },
    lat: { type: 'number' },
    lon: { type: 'number' }
  },
  required: ['hex']
};
```

### Security-Conscious Validation
```typescript
// AVOID ReDoS vulnerabilities in regex patterns
case 'email':
  // Simple email validation to avoid ReDoS - just check for @ and .
  if (!data.includes('@') || !data.includes('.') || data.includes(' ')) {
    throw new Error(`Invalid email format at ${path}`);
  }
  break;

case 'uri':
  try {
    new URL(data); // Use built-in validation
  } catch {
    throw new Error(`Invalid URI format at ${path}`);
  }
  break;
```

### Type-Safe Field Mapping
```typescript
// Transform raw API response to normalized format
const transformAircraft = (raw: RawAircraft): Aircraft => ({
  icao: raw.hex,
  callsign: raw.flight || null,
  position: raw.lat && raw.lon ? {
    latitude: raw.lat,
    longitude: raw.lon,
    altitude: raw.alt_baro || null
  } : null,
  lastSeen: raw.seen ? new Date(Date.now() - raw.seen * 1000) : null
});
```

### Error Context Preservation
```typescript
private static validateRecursive(data: any, schema: Schema, path: string): void {
  const actualType = Array.isArray(data) ? 'array' : typeof data;
  if (actualType !== schema.type && data !== null && data !== undefined) {
    throw new Error(`Type mismatch at ${path}: expected ${schema.type}, got ${actualType}`);
  }
  
  // Validate with detailed path information for debugging
  if (schema.properties) {
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      if (key in data) {
        this.validateRecursive(data[key], propSchema, `${path}.${key}`);
      }
    }
  }
}
```

## ETL Directory Architecture Decision
Based on ADS-B experience:

**Simple API Connectors (like ADS-B)**:
- `src/extract/` - Empty (direct HTTP requests)
- `src/transform/` - Empty (minimal transformation in data-transformer.ts)  
- `src/load/` - Empty (read-only API)
- Main logic in root src/ files

**Complex ETL Connectors (like Analytics)**:
- `src/extract/` - Connection pooling, pagination, incremental sync
- `src/transform/` - Complex aggregations, joins, computations
- `src/load/` - Database writers, file outputs, streaming

## Usage Guidelines
Use this agent when:
- Building data-transformer.ts with schema validation
- Implementing safe field mapping without ReDoS vulnerabilities
- Creating type-safe transformation pipelines
- Designing validation with detailed error paths
- Deciding whether to populate ETL directories vs root src/ files

## Key Security Lessons from ADS-B
- **Avoid complex regex patterns** - Use simple string checks or URL constructor
- **Validate with context** - Include field paths in error messages
- **Structured error handling** - Use ConnectorError with proper error codes
- **Type safety first** - Define clear interfaces for raw vs transformed data
- **Fail fast with details** - Provide actionable validation error messages
