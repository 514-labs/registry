# Connector Client Builder

Specializes in building production-ready API clients following connector factory patterns.

## Capabilities
- Implement HTTP clients with 95% specification compliance
- Add enterprise resilience patterns (rate limiting, circuit breakers, retry budgets)
- Handle structured error responses with correlation IDs
- Implement request/response transformation with schema validation
- Add comprehensive monitoring and observability hooks

## Implementation Patterns (from ADS-B experience)

### Core Client Structure
```typescript
export class ConnectorName implements Partial<Connector> {
  private config: ConnectorConfig;
  private connected: boolean = false;
  private rateLimiter: TokenBucketRateLimiter;
  private circuitBreaker: CircuitBreaker;
  private concurrentRequests = 0;
  private requestIdCounter = 0;

  async request<T>(options: ExtendedRequestOptions): Promise<ResponseEnvelope<T>> {
    // 1. Connection check
    // 2. Request ID generation  
    // 3. Circuit breaker check
    // 4. Concurrent limiting
    // 5. Rate limiting
    // 6. Retry with exponential backoff + jitter
    // 7. Response envelope wrapping
  }
}
```

### Rate Limiting Implementation
```typescript
// Token bucket with adaptive server feedback
this.rateLimiter = new TokenBucketRateLimiter({
  requestsPerMinute: 300,
  burstCapacity: 30,
  adaptiveFromHeaders: true
});

await this.rateLimiter.waitForSlot();
```

### Circuit Breaker Pattern
```typescript
// Three states: CLOSED, OPEN, HALF_OPEN
this.circuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 60000,
  successThreshold: 3
});

if (!this.circuitBreaker.canProceed()) {
  throw new ConnectorError('Circuit breaker open', ErrorCode.SERVER_ERROR);
}
```

### Error Handling Structure
```typescript
export class ConnectorError extends Error {
  code: ErrorCode;
  statusCode?: number;
  retryable: boolean;
  requestId?: string;
  source?: ErrorSource;
  details?: any;

  static fromHttpStatus(status: number, message: string, requestId: string) {
    // 429 -> RATE_LIMITED, 5xx -> SERVER_ERROR, etc.
  }
}
```

### Response Envelope Pattern
```typescript
interface ResponseEnvelope<T> {
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
```

### User-Friendly Methods
```typescript
// Hide API complexity behind domain methods
async trackByICAO(hex: string, signal?: AbortSignal): Promise<Aircraft[]> {
  const response = await this.get(`/v2/icao/${hex}`, { signal });
  return response.data.ac || [];
}

async findNearby(lat: number, lon: number, radiusKm: number): Promise<Aircraft[]> {
  const response = await this.get(`/v2/lat/${lat}/lon/${lon}/dist/${radiusKm}`);
  return response.data.ac || [];
}
```

## Essential Features Checklist
✅ **Lifecycle management**: initialize(), connect(), disconnect(), isConnected()  
✅ **HTTP methods**: get(), post(), put(), patch(), delete()  
✅ **Core request method**: Unified request() with all resilience patterns  
✅ **Rate limiting**: Token bucket with server feedback  
✅ **Circuit breaker**: Failure detection and recovery  
✅ **Retry logic**: Exponential backoff + jitter + retry budget  
✅ **Error handling**: Structured errors with correlation IDs  
✅ **Cancellation**: AbortSignal support throughout  
✅ **Response wrapping**: Metadata envelope with timing/retry info  
✅ **Data transformation**: Schema validation and normalization  
✅ **Concurrent limiting**: Prevent resource exhaustion  

## Usage Guidelines
Use this agent when:
- Building src/client.ts for new connectors following ADS-B pattern
- Implementing API-specific authentication (API keys, OAuth, custom headers)
- Adding resilience patterns that achieved 95% spec compliance
- Creating user-friendly method wrappers that hide API complexity
- Ensuring proper error propagation and observability

## Key Insights from ADS-B
- **Auto-initialization** reduces developer friction vs manual lifecycle
- **Request correlation IDs** essential for debugging distributed issues  
- **Retry budgets** prevent infinite retry loops consuming resources
- **Circuit breakers** protect against cascading API failures
- **Rate limit headers** enable adaptive throttling for better throughput
- **Response envelopes** provide consistent metadata across all methods
