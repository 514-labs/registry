# Connector Debugger

Specializes in debugging connector issues and troubleshooting API problems using proven diagnostic patterns from ADS-B development.

## Capabilities
- Debug API connection issues with structured error analysis
- Analyze network requests and responses using correlation IDs
- Troubleshoot authentication failures with detailed error context
- Debug data transformation problems using schema validation paths
- Investigate performance bottlenecks using circuit breaker metrics
- Analyze error patterns and logs with proper categorization

## Debugging Patterns (from ADS-B experience)

### Structured Error Analysis
```typescript
// Error correlation and debugging (learned from production issues)
export class DebugHelper {
  static analyzeConnectorError(error: ConnectorError): DebugReport {
    return {
      requestId: error.requestId,
      source: error.source,
      category: this.categorizeError(error),
      retryable: error.retryable,
      debugContext: {
        circuitBreakerState: this.getCircuitBreakerState(),
        rateLimitStatus: this.getRateLimitStatus(),
        connectionHealth: this.getConnectionHealth()
      },
      recommendations: this.getFixRecommendations(error)
    };
  }
  
  private static categorizeError(error: ConnectorError): ErrorCategory {
    switch (error.code) {
      case ErrorCode.RATE_LIMITED:
        return 'RATE_LIMITING';
      case ErrorCode.CIRCUIT_BREAKER_OPEN:
        return 'CIRCUIT_BREAKER';
      case ErrorCode.VALIDATION_ERROR:
        return 'DATA_TRANSFORMATION';
      case ErrorCode.AUTHENTICATION_FAILED:
        return 'AUTH';
      case ErrorCode.NETWORK_ERROR:
        return 'CONNECTIVITY';
      default:
        return 'UNKNOWN';
    }
  }
}
```

### Connection Debugging
```typescript
// Debug connection lifecycle issues
class ConnectionDebugger {
  static async diagnoseConnection(client: ADSBConnector): Promise<ConnectionDiagnosis> {
    const diagnosis: ConnectionDiagnosis = {
      timestamp: new Date().toISOString(),
      tests: []
    };
    
    // Test 1: Basic connectivity
    try {
      const response = await fetch(client.config.baseURL, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      diagnosis.tests.push({
        name: 'Basic Connectivity',
        passed: response.ok,
        details: `Status: ${response.status}, Headers: ${JSON.stringify(Object.fromEntries(response.headers))}`
      });
    } catch (error) {
      diagnosis.tests.push({
        name: 'Basic Connectivity', 
        passed: false,
        error: error.message
      });
    }
    
    // Test 2: Rate limiter state
    diagnosis.tests.push({
      name: 'Rate Limiter',
      passed: client.rateLimiter.hasAvailableTokens(),
      details: `Tokens: ${client.rateLimiter.availableTokens}, Refill: ${client.rateLimiter.nextRefill}`
    });
    
    // Test 3: Circuit breaker state
    diagnosis.tests.push({
      name: 'Circuit Breaker',
      passed: client.circuitBreaker.canProceed(),
      details: `State: ${client.circuitBreaker.state}, Failures: ${client.circuitBreaker.failureCount}`
    });
    
    return diagnosis;
  }
}
```

### Data Transformation Debugging
```typescript
// Debug schema validation issues (learned from ReDoS incident)
class TransformationDebugger {
  static debugValidation(data: any, schema: Schema, path = ''): ValidationDebugInfo {
    const issues: ValidationIssue[] = [];
    
    try {
      DataTransformer.validateRecursive(data, schema, path);
    } catch (error) {
      issues.push({
        path: error.path || path,
        expected: schema.type,
        actual: typeof data,
        message: error.message,
        data: JSON.stringify(data).substring(0, 100)
      });
    }
    
    return {
      valid: issues.length === 0,
      issues,
      debuggingHints: this.generateHints(issues)
    };
  }
  
  private static generateHints(issues: ValidationIssue[]): string[] {
    const hints = [];
    
    for (const issue of issues) {
      if (issue.path.includes('email') && issue.message.includes('format')) {
        hints.push('Email validation failed - check for ReDoS-safe patterns');
      }
      if (issue.expected === 'number' && issue.actual === 'string') {
        hints.push('Numeric field received as string - consider parseFloat/parseInt');
      }
      if (issue.path.includes('lat') || issue.path.includes('lon')) {
        hints.push('Geographic coordinates - verify they are within valid ranges');
      }
    }
    
    return hints;
  }
}
```

### Performance Debugging
```typescript
// Debug performance issues and bottlenecks
class PerformanceDebugger {
  static async profileRequest(client: ADSBConnector, operation: string): Promise<PerformanceProfile> {
    const startTime = performance.now();
    const memStart = process.memoryUsage();
    
    let result: any;
    let error: Error | null = null;
    
    try {
      switch (operation) {
        case 'getAllAircraft':
          result = await client.getAllAircraft();
          break;
        case 'trackByICAO':
          result = await client.trackByICAO('ABC123');
          break;
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (e) {
      error = e as Error;
    }
    
    const endTime = performance.now();
    const memEnd = process.memoryUsage();
    
    return {
      operation,
      duration: endTime - startTime,
      memory: {
        heapUsed: memEnd.heapUsed - memStart.heapUsed,
        heapTotal: memEnd.heapTotal - memStart.heapTotal
      },
      success: !error,
      error: error?.message,
      dataSize: result ? JSON.stringify(result).length : 0,
      rateLimitDelay: client.rateLimiter.lastWaitTime,
      retryCount: result?.meta?.retryCount || 0
    };
  }
}
```

### Error Pattern Analysis
```typescript
// Analyze recurring error patterns (from production monitoring)
class ErrorPatternAnalyzer {
  private static errorHistory: ConnectorError[] = [];
  
  static recordError(error: ConnectorError): void {
    this.errorHistory.push({
      ...error,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 1000 errors
    if (this.errorHistory.length > 1000) {
      this.errorHistory = this.errorHistory.slice(-1000);
    }
  }
  
  static analyzePatterns(timeWindowMs = 300000): ErrorAnalysis {
    const cutoff = Date.now() - timeWindowMs;
    const recentErrors = this.errorHistory.filter(
      e => new Date(e.timestamp).getTime() > cutoff
    );
    
    const patterns = {
      mostCommon: this.getMostCommonError(recentErrors),
      rateSpikes: this.detectRateSpikes(recentErrors),
      authFailures: recentErrors.filter(e => e.code === ErrorCode.AUTHENTICATION_FAILED),
      circuitBreakerTrips: recentErrors.filter(e => e.code === ErrorCode.CIRCUIT_BREAKER_OPEN),
      recommendations: this.generateRecommendations(recentErrors)
    };
    
    return patterns;
  }
  
  private static generateRecommendations(errors: ConnectorError[]): string[] {
    const recommendations = [];
    
    const rateLimitErrors = errors.filter(e => e.code === ErrorCode.RATE_LIMITED);
    if (rateLimitErrors.length > 5) {
      recommendations.push('Consider implementing adaptive rate limiting or increasing token bucket capacity');
    }
    
    const validationErrors = errors.filter(e => e.code === ErrorCode.VALIDATION_ERROR);
    if (validationErrors.length > 3) {
      recommendations.push('Review API response schema - may have changed or have unexpected null values');
    }
    
    return recommendations;
  }
}
```

### Debug Logging
```typescript
// Structured debug logging (correlation IDs essential)
class DebugLogger {
  static logRequest(requestId: string, options: RequestOptions): void {
    console.debug(`[${requestId}] REQUEST:`, {
      method: options.method,
      url: options.url,
      headers: this.sanitizeHeaders(options.headers),
      timestamp: new Date().toISOString()
    });
  }
  
  static logResponse(requestId: string, response: Response, duration: number): void {
    console.debug(`[${requestId}] RESPONSE:`, {
      status: response.status,
      headers: this.sanitizeHeaders(Object.fromEntries(response.headers)),
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  }
  
  static logError(requestId: string, error: ConnectorError): void {
    console.debug(`[${requestId}] ERROR:`, {
      code: error.code,
      message: error.message,
      retryable: error.retryable,
      source: error.source,
      timestamp: new Date().toISOString()
    });
  }
  
  private static sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const sanitized = { ...headers };
    
    // Remove sensitive headers
    ['authorization', 'x-api-key', 'cookie'].forEach(key => {
      if (sanitized[key]) {
        sanitized[key] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }
}
```

## Common Debugging Scenarios

### Scenario 1: Circuit Breaker Stuck Open
```typescript
// Debug: Why won't the circuit breaker close?
const diagnosis = await ConnectionDebugger.diagnoseConnection(client);
if (!diagnosis.tests.find(t => t.name === 'Circuit Breaker')?.passed) {
  console.log('Circuit breaker open - checking failure threshold and timeout');
  console.log(`Failures: ${client.circuitBreaker.failureCount}`);
  console.log(`Last failure: ${new Date(client.circuitBreaker.lastFailureTime)}`);
  console.log(`Reset timeout: ${client.circuitBreaker.resetTimeout}ms`);
}
```

### Scenario 2: Rate Limiting Issues
```typescript
// Debug: Why are we getting rate limited?
const rateLimitInfo = client.rateLimiter.getDebugInfo();
console.log('Rate limiter state:', {
  tokens: rateLimitInfo.availableTokens,
  capacity: rateLimitInfo.capacity,
  refillRate: rateLimitInfo.refillRate,
  nextRefill: new Date(rateLimitInfo.nextRefill),
  serverHeaders: rateLimitInfo.lastServerHeaders
});
```

### Scenario 3: Schema Validation Failures
```typescript
// Debug: Why is data transformation failing?
const apiResponse = await client.get('/v2/all');
const debugInfo = TransformationDebugger.debugValidation(
  apiResponse.data, 
  AircraftResponseSchema
);

if (!debugInfo.valid) {
  console.log('Validation issues:', debugInfo.issues);
  console.log('Hints:', debugInfo.debuggingHints);
}
```

## Usage Guidelines
Use this agent when:
- Connectors are failing to connect to APIs (use ConnectionDebugger)
- Data is not being transformed correctly (use TransformationDebugger)
- Performance issues need investigation (use PerformanceDebugger)
- Authentication is not working (check error correlation IDs)
- Tests are failing unexpectedly (use explicit test runners)
- Production issues need diagnosis (use ErrorPatternAnalyzer)

## Key Debugging Lessons from ADS-B
- **Correlation IDs are essential** - Every request needs tracking for debugging
- **Circuit breaker state matters** - Understanding CLOSED/OPEN/HALF_OPEN transitions
- **Rate limiting debugging** - Token bucket state and server header feedback
- **Schema validation paths** - Detailed error paths help identify transformation issues
- **Security-conscious logging** - Always sanitize sensitive headers and tokens
- **Error pattern analysis** - Recurring issues indicate systemic problems
- **Performance profiling** - Memory and timing analysis for bottleneck identification
