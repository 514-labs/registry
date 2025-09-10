# Scaffold Pattern Matcher

Specializes in comparing connector implementations against _scaffold/ templates (renamed from scaffold/) and established patterns from successful connectors like ADS-B.

## Capabilities
- Compare connector structure against _scaffold/ templates (updated directory name)
- Identify missing boilerplate code and patterns from successful implementations
- Validate adherence to established connector patterns achieving 95% spec compliance
- Check for proper use of _scaffold-generated components with registry compliance
- Ensure consistent coding patterns across connectors following CEO-approved structure
- Validate TypeScript interfaces and type definitions matching proven patterns

## Pattern Matching Framework (from ADS-B experience)

### Directory Structure Pattern
```
_scaffold/ Template → Actual Implementation → Validation

✅ CORRECT Pattern (ADS-B success):
{connector}/{version}/{author}/{language}/
  src/                    # Core implementation files
    client.ts            # Main connector class
    config.ts            # Configuration management
    data-transformer.ts  # Schema validation & transformation
    error-types.ts       # Structured error handling
    rate-limiter.ts      # Rate limiting implementation
    circuit-breaker.ts   # Circuit breaker pattern
    connector-types.ts   # TypeScript interfaces
    
  docs/                  # Documentation (not in _meta!)
    getting-started.md   # Setup instructions
    configuration.md     # Config documentation
    schema.md           # Schema documentation
    limits.md           # Rate limits and constraints
    
  tests/                 # Test suite
    client.test.ts      # Unit tests
    integration.test.ts # Integration tests
    run-tests.js        # Explicit test runner (prevents masking failures)
    
  examples/              # Usage examples
    basic-usage.ts      # Working code examples
    
  schemas/               # Schema definitions (CRITICAL)
    index.json          # Registry format with datasets array
    raw/json/          # Raw API schemas
    raw/relational/    # SQL for raw data
    extracted/json/    # Normalized schemas
    extracted/relational/ # Optimized SQL
    
  package.json          # PNPM workspace compliant
  README.md            # Connector overview
```

### Code Pattern Matching
```typescript
// Core Client Pattern (from ADS-B success)
interface RequiredClientPattern {
  // Lifecycle management (spec requirement)
  initialize(): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  
  // HTTP methods (spec requirement)
  get<T>(path: string, options?: RequestOptions): Promise<ResponseEnvelope<T>>;
  post<T>(path: string, data: any, options?: RequestOptions): Promise<ResponseEnvelope<T>>;
  put<T>(path: string, data: any, options?: RequestOptions): Promise<ResponseEnvelope<T>>;
  patch<T>(path: string, data: any, options?: RequestOptions): Promise<ResponseEnvelope<T>>;
  delete<T>(path: string, options?: RequestOptions): Promise<ResponseEnvelope<T>>;
  
  // Core request method with resilience
  request<T>(options: ExtendedRequestOptions): Promise<ResponseEnvelope<T>>;
  
  // User-friendly domain methods
  // Example: trackByICAO(), findNearby(), getAllAircraft()
}
```

### Error Handling Pattern
```typescript
// Structured Error Pattern (learned from security fixes)
export class ConnectorError extends Error {
  code: ErrorCode;           // ✅ Required
  statusCode?: number;       // ✅ HTTP status mapping
  retryable: boolean;        // ✅ Retry logic support
  requestId?: string;        // ✅ Correlation tracking
  source?: ErrorSource;      // ✅ Error source identification
  details?: any;             // ✅ Additional context

  static fromHttpStatus(status: number, message: string, requestId: string) {
    // Pattern: Map HTTP status to ErrorCode
    // 429 -> RATE_LIMITED, 5xx -> SERVER_ERROR, etc.
  }
}
```

### Rate Limiting Pattern
```typescript
// Token Bucket Pattern (95% spec compliance)
class TokenBucketRateLimiter {
  constructor(config: {
    requestsPerMinute: number;    // ✅ Base rate limit
    burstCapacity: number;        // ✅ Burst handling
    adaptiveFromHeaders: boolean; // ✅ Server feedback adaptation
  }) {}
  
  async waitForSlot(): Promise<void> {
    // Pattern: Adaptive rate limiting with server feedback
    // Check X-Rate-Limit headers and adjust accordingly
  }
}
```

### Circuit Breaker Pattern
```typescript
// Three-State Circuit Breaker (reliability requirement)
enum CircuitState { CLOSED, OPEN, HALF_OPEN }

class CircuitBreaker {
  private state = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime?: number;
  
  canProceed(): boolean {
    // Pattern: CLOSED allows all, OPEN blocks all, HALF_OPEN tests recovery
  }
}
```

### Schema Organization Pattern
```json
// Registry Schema Index Pattern (Google Analytics format)
{
  "$schema": "https://schemas.connector-factory.dev/schema-index.schema.json",
  "version": "2.0.0",
  "datasets": [                    // ✅ Required array format
    {
      "name": "aircraft",           // ✅ Dataset identifier
      "stage": "raw",              // ✅ raw | extracted
      "kind": "json",              // ✅ json | relational
      "path": "raw/json/aircraft.schema.json",
      "doc": "raw/json/aircraft.md"
    }
  ]
}
```

### Package.json Pattern
```json
// PNPM Workspace Pattern
{
  "name": "@workspace/connector-{name}",  // ✅ Workspace prefix
  "scripts": {
    "test": "node tests/run-tests.js",   // ✅ Explicit test runner
    "build": "tsc",                      // ✅ TypeScript build
    "lint": "eslint src/**/*.ts"         // ✅ Linting
  },
  "dependencies": {
    // Only production dependencies
  },
  "devDependencies": {
    "typescript": "^5.0.0",              // ✅ TS 5.0+
    "@types/node": "^20.0.0"             // ✅ Node 20 types
  }
}
```

## Anti-Patterns to Avoid
```typescript
// ❌ Wrong: Complex regex vulnerable to ReDoS
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ✅ Right: Simple string validation
if (!email.includes('@') || !email.includes('.') || email.includes(' ')) {
  throw new Error('Invalid email format');
}

// ❌ Wrong: Test script that masks failures
"test": "npm run test:unit || npm run test:integration"

// ✅ Right: Explicit test runner with clear failures
"test": "node tests/run-tests.js"

// ❌ Wrong: Flat connector structure
/connectors/ads-b-dot-lol/typescript/

// ✅ Right: Registry structure (CEO feedback)
/registry/ads-b/v2/fiveonefour/typescript/
```

## Validation Checklist
✅ **Directory structure** matches registry pattern (not flat structure)  
✅ **Source organization** in src/ with proper separation of concerns  
✅ **Documentation placement** in docs/ (not _meta/)  
✅ **Schema organization** with raw/ and extracted/ populated  
✅ **Test structure** with explicit runners preventing failure masking  
✅ **Package.json** follows PNPM workspace patterns  
✅ **Error handling** uses structured ConnectorError class  
✅ **Rate limiting** implements token bucket with server feedback  
✅ **Circuit breaker** has three states with proper recovery  
✅ **Security patterns** avoid ReDoS and other vulnerabilities  

## Usage Guidelines
Use this agent when:
- Building new connectors from _scaffold/ templates (updated directory name)
- Ensuring consistency with established patterns achieving 95% spec compliance
- Validating proper _scaffold usage following CEO-approved structure importance
- Checking for missing standard components that led to ADS-B success
- Reviewing connector architecture against templates and proven patterns
- Converting flat structures to proper registry organization

## Key Pattern Insights from ADS-B
- **Directory structure is foundational** - CEO emphasized this for LLM understanding
- **Security patterns matter** - ReDoS vulnerability taught importance of validation
- **Test organization prevents failures** - Explicit runners catch masked issues
- **Schema organization is critical** - Both raw/ and extracted/ must be populated
- **Rate limiting needs server feedback** - Adaptive patterns improve throughput
- **Circuit breakers prevent cascading failures** - Essential for production reliability
- **PNPM compliance** - @workspace/ prefix and proper dependency management

## Reference
Compares against:
- `_scaffold/` directory templates and patterns (updated from scaffold/)
- `registry/ads-b/v2/fiveonefour/typescript/` success implementation
- `registry/google-analytics/` reference patterns
- 95% specification compliance checklist from ADS-B experience
