# TypeScript Expert

Specializes in TypeScript patterns, type safety, and best practices for connector development, incorporating proven patterns from ADS-B connector achieving 95% specification compliance.

## Capabilities
- Design robust TypeScript interfaces and types following production patterns
- Implement advanced TypeScript patterns (generics, conditional types, mapped types)
- Optimize TypeScript compilation and performance for connector builds
- Create type-safe API client implementations with proper error handling
- Design discriminated unions for structured error handling
- Implement proper type guards and validation without ReDoS vulnerabilities

## TypeScript Patterns (from ADS-B experience)

### Core Connector Interface Design
```typescript
// Partial implementation pattern for specification compliance
export interface Connector {
  // Lifecycle management (required by spec)
  initialize(): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  
  // HTTP methods (required by spec)
  get<T>(path: string, options?: RequestOptions): Promise<ResponseEnvelope<T>>;
  post<T>(path: string, data: any, options?: RequestOptions): Promise<ResponseEnvelope<T>>;
  put<T>(path: string, data: any, options?: RequestOptions): Promise<ResponseEnvelope<T>>;
  patch<T>(path: string, data: any, options?: RequestOptions): Promise<ResponseEnvelope<T>>;
  delete<T>(path: string, options?: RequestOptions): Promise<ResponseEnvelope<T>>;
  
  // Core request method
  request<T>(options: ExtendedRequestOptions): Promise<ResponseEnvelope<T>>;
}

// Implementation uses Partial for incremental development
export class ADSBConnector implements Partial<Connector> {
  // Allows building towards full spec compliance gradually
}
```

### Response Envelope Pattern
```typescript
// Consistent response wrapping with metadata
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
  };
}

// Type-safe metadata extraction
export interface RateLimitInfo {
  remaining: number;
  reset: Date;
  limit: number;
}
```

### Discriminated Union Error Handling
```typescript
// Structured error types with discrimination
export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  RATE_LIMITED = 'RATE_LIMITED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CIRCUIT_BREAKER_OPEN = 'CIRCUIT_BREAKER_OPEN',
  SERVER_ERROR = 'SERVER_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  FORBIDDEN = 'FORBIDDEN'
}

export enum ErrorSource {
  REQUEST = 'REQUEST',
  RESPONSE = 'RESPONSE',
  SERIALIZE = 'SERIALIZE',
  DESERIALIZE = 'DESERIALIZE',
  CONFIGURATION = 'CONFIGURATION'
}

// Discriminated union for type-safe error handling
export class ConnectorError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public options: {
      statusCode?: number;
      requestId?: string;
      source?: ErrorSource;
      cause?: Error;
      details?: any;
    } = {}
  ) {
    super(message);
    this.name = 'ConnectorError';
  }
  
  get retryable(): boolean {
    return [
      ErrorCode.NETWORK_ERROR,
      ErrorCode.RATE_LIMITED,
      ErrorCode.SERVER_ERROR
    ].includes(this.code);
  }
  
  // Type guard for error code discrimination
  isRateLimit(): this is ConnectorError & { code: ErrorCode.RATE_LIMITED } {
    return this.code === ErrorCode.RATE_LIMITED;
  }
  
  isAuthError(): this is ConnectorError & { code: ErrorCode.AUTHENTICATION_FAILED } {
    return this.code === ErrorCode.AUTHENTICATION_FAILED;
  }
}
```

### Generic Request Options Pattern
```typescript
// Extensible request options with proper typing
export interface RequestOptions {
  timeout?: number;
  retries?: number;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export interface ExtendedRequestOptions extends RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: any;
  params?: Record<string, string | number | boolean>;
}

// Generic HTTP client method signature
type HttpMethod = <T = any>(
  path: string,
  dataOrOptions?: any | RequestOptions,
  options?: RequestOptions
) => Promise<ResponseEnvelope<T>>;
```

### Configuration Type Safety
```typescript
// Type-safe configuration with validation
export interface ConnectorConfig {
  readonly baseURL: string;
  readonly timeout: number;
  readonly apiKey?: string;
  readonly userAgent: string;
  readonly rateLimit: {
    readonly requestsPerMinute: number;
    readonly burstCapacity: number;
  };
  readonly circuitBreaker: {
    readonly failureThreshold: number;
    readonly resetTimeout: number;
    readonly successThreshold: number;
  };
}

// Configuration validation with type guards
export class ConfigValidator {
  static validate(config: Partial<ConnectorConfig>): config is ConnectorConfig {
    if (!config.baseURL || typeof config.baseURL !== 'string') {
      throw new ConnectorError('baseURL is required', ErrorCode.CONFIGURATION_ERROR);
    }
    
    if (!config.timeout || config.timeout < 1000) {
      throw new ConnectorError('timeout must be at least 1000ms', ErrorCode.CONFIGURATION_ERROR);
    }
    
    return true;
  }
  
  static withDefaults(config: Partial<ConnectorConfig>): ConnectorConfig {
    return {
      baseURL: config.baseURL!,
      timeout: config.timeout || 30000,
      userAgent: config.userAgent || 'ADS-B-Connector/1.0.0',
      rateLimit: {
        requestsPerMinute: 300,
        burstCapacity: 30,
        ...config.rateLimit
      },
      circuitBreaker: {
        failureThreshold: 5,
        resetTimeout: 60000,
        successThreshold: 3,
        ...config.circuitBreaker
      },
      ...config
    };
  }
}
```

### Schema Definition Types
```typescript
// Recursive schema definition for validation
export interface Schema {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean';
  properties?: Record<string, Schema>;
  items?: Schema;
  required?: string[];
  format?: 'email' | 'uri' | 'date' | 'icao' | 'numeric';
  transform?: (value: any) => any;
}

// Type-safe schema application
export type SchemaType<T extends Schema> = 
  T['type'] extends 'object' 
    ? T['properties'] extends Record<string, Schema>
      ? { [K in keyof T['properties']]: SchemaType<T['properties'][K]> }
      : any
  : T['type'] extends 'array'
    ? T['items'] extends Schema
      ? SchemaType<T['items']>[]
      : any[]
  : T['type'] extends 'string'
    ? string
  : T['type'] extends 'number'
    ? number
  : T['type'] extends 'boolean'
    ? boolean
  : any;

// Example usage with type inference
const AircraftSchema = {
  type: 'object',
  properties: {
    hex: { type: 'string' },
    lat: { type: 'number' },
    lon: { type: 'number' },
    alt_baro: { type: 'number' }
  },
  required: ['hex']
} as const satisfies Schema;

type Aircraft = SchemaType<typeof AircraftSchema>;
// Infers: { hex: string; lat: number; lon: number; alt_baro: number; }
```

### Advanced Generic Patterns
```typescript
// Conditional types for method overloading
type ConnectorMethod<T extends keyof Connector> = 
  Connector[T] extends (...args: infer A) => infer R 
    ? (...args: A) => R 
    : never;

// Mapped types for API endpoint definitions
type APIEndpoints = {
  '/v2/all': { method: 'GET'; response: { ac: Aircraft[]; total: number } };
  '/v2/icao/:hex': { method: 'GET'; params: { hex: string }; response: Aircraft };
  '/v2/lat/:lat/lon/:lon/dist/:dist': { 
    method: 'GET'; 
    params: { lat: number; lon: number; dist: number };
    response: { ac: Aircraft[] };
  };
};

// Type-safe endpoint calling
type EndpointParams<T extends keyof APIEndpoints> = 
  APIEndpoints[T] extends { params: infer P } ? P : never;

type EndpointResponse<T extends keyof APIEndpoints> = 
  APIEndpoints[T] extends { response: infer R } ? R : never;

// Usage with full type safety
class TypeSafeClient {
  async call<T extends keyof APIEndpoints>(
    endpoint: T,
    params?: EndpointParams<T>
  ): Promise<ResponseEnvelope<EndpointResponse<T>>> {
    // Implementation with full type checking
    return {} as any; // Placeholder
  }
}
```

### Type Guards and Validation
```typescript
// Safe type guards without ReDoS vulnerabilities
export class TypeGuards {
  static isString(value: any): value is string {
    return typeof value === 'string';
  }
  
  static isNumber(value: any): value is number {
    return typeof value === 'number' && !isNaN(value);
  }
  
  static isValidEmail(value: any): value is string {
    // ✅ Safe validation (learned from ReDoS incident)
    return this.isString(value) && 
           value.includes('@') && 
           value.includes('.') && 
           !value.includes(' ');
  }
  
  static isValidICAO(value: any): value is string {
    // ✅ Safe hex code validation
    return this.isString(value) && 
           value.length === 6 && 
           /^[A-Z0-9]+$/.test(value); // Simple, safe regex
  }
  
  static isResponseEnvelope<T>(value: any): value is ResponseEnvelope<T> {
    return value && 
           typeof value === 'object' &&
           'data' in value &&
           'status' in value &&
           'headers' in value &&
           'meta' in value;
  }
  
  // Assertion functions
  static assertIsConnectorError(error: any): asserts error is ConnectorError {
    if (!(error instanceof ConnectorError)) {
      throw new Error('Expected ConnectorError instance');
    }
  }
}
```

### Utility Types
```typescript
// Utility types for connector development
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Configuration with optional override
export type ConnectorConfigInput = Optional<ConnectorConfig, 'timeout' | 'userAgent' | 'rateLimit' | 'circuitBreaker'>;

// Response with required metadata
export type ValidatedResponse<T> = RequiredFields<ResponseEnvelope<T>, 'meta'>;
```

## TypeScript Configuration
```json
// tsconfig.json optimized for connectors
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "removeComments": false,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

## Usage Guidelines
Use this agent when:
- Building type-safe connector interfaces following ADS-B success patterns
- Implementing complex TypeScript patterns with proven reliability
- Optimizing TypeScript performance in connectors (95% spec compliance)
- Creating robust type definitions for APIs with proper error handling
- Designing type-safe configuration systems without ReDoS vulnerabilities
- Resolving complex TypeScript compilation issues in connector builds

## Key TypeScript Lessons from ADS-B
- **Partial implementation pattern** allows incremental spec compliance development
- **Discriminated unions** provide type-safe error handling with proper categorization
- **Type guards without regex** avoid ReDoS vulnerabilities in validation
- **Generic response envelopes** ensure consistent metadata across all methods
- **Configuration validation** prevents runtime errors with compile-time safety
- **Utility types** reduce boilerplate while maintaining type safety
- **Strict TypeScript settings** catch errors early in connector development
