export enum CircuitState {
  CLOSED = 'CLOSED',  // Normal operation
  OPEN = 'OPEN',      // Failing, reject requests
  HALF_OPEN = 'HALF_OPEN'  // Testing if service recovered
}

export interface CircuitBreakerConfig {
  failureThreshold?: number;    // Number of failures to open circuit
  resetTimeout?: number;        // Time to wait before trying again (ms)
  successThreshold?: number;    // Successes needed to close from half-open
  monitoringPeriod?: number;    // Time window for failure counting (ms)
}

export interface CircuitBreakerStatus {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailureTime?: string;
  nextRetryTime?: string;
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private successes: number = 0;
  private lastFailureTime?: number;
  private failureTimestamps: number[] = [];
  
  private readonly failureThreshold: number;
  private readonly resetTimeout: number;
  private readonly successThreshold: number;
  private readonly monitoringPeriod: number;

  constructor(config: CircuitBreakerConfig = {}) {
    this.failureThreshold = config.failureThreshold || 5;
    this.resetTimeout = config.resetTimeout || 60000; // 1 minute
    this.successThreshold = config.successThreshold || 3;
    this.monitoringPeriod = config.monitoringPeriod || 60000; // 1 minute
  }

  canProceed(): boolean {
    this.updateState();
    
    switch (this.state) {
      case CircuitState.CLOSED:
        return true;
      
      case CircuitState.OPEN:
        // Check if we should transition to half-open
        if (this.lastFailureTime && Date.now() - this.lastFailureTime >= this.resetTimeout) {
          this.state = CircuitState.HALF_OPEN;
          this.successes = 0;
          return true; // Allow one request to test
        }
        return false;
      
      case CircuitState.HALF_OPEN:
        return true; // Allow limited requests to test recovery
    }
  }

  recordSuccess(): void {
    switch (this.state) {
      case CircuitState.CLOSED:
        // Reset failure count on success
        this.failures = 0;
        this.failureTimestamps = [];
        break;
      
      case CircuitState.HALF_OPEN:
        this.successes++;
        if (this.successes >= this.successThreshold) {
          // Circuit recovered, close it
          this.state = CircuitState.CLOSED;
          this.failures = 0;
          this.successes = 0;
          this.failureTimestamps = [];
          this.lastFailureTime = undefined;
        }
        break;
      
      case CircuitState.OPEN:
        // Shouldn't happen, but handle gracefully
        break;
    }
  }

  recordFailure(): void {
    const now = Date.now();
    this.lastFailureTime = now;
    
    switch (this.state) {
      case CircuitState.CLOSED:
        // Add failure timestamp
        this.failureTimestamps.push(now);
        this.cleanupOldFailures();
        
        // Check if we've exceeded threshold
        if (this.failureTimestamps.length >= this.failureThreshold) {
          this.state = CircuitState.OPEN;
          this.failures = this.failureTimestamps.length;
        }
        break;
      
      case CircuitState.HALF_OPEN:
        // Failed during recovery test, reopen circuit
        this.state = CircuitState.OPEN;
        this.successes = 0;
        this.failures++;
        break;
      
      case CircuitState.OPEN:
        this.failures++;
        break;
    }
  }

  getStatus(): CircuitBreakerStatus {
    this.updateState();
    
    const status: CircuitBreakerStatus = {
      state: this.state,
      failures: this.failureTimestamps.length,
      successes: this.successes
    };
    
    if (this.lastFailureTime) {
      status.lastFailureTime = new Date(this.lastFailureTime).toISOString();
      
      if (this.state === CircuitState.OPEN) {
        const nextRetry = this.lastFailureTime + this.resetTimeout;
        status.nextRetryTime = new Date(nextRetry).toISOString();
      }
    }
    
    return status;
  }

  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failures = 0;
    this.successes = 0;
    this.failureTimestamps = [];
    this.lastFailureTime = undefined;
  }

  private updateState(): void {
    this.cleanupOldFailures();
    
    // Auto-transition from open to half-open after timeout
    if (this.state === CircuitState.OPEN && 
        this.lastFailureTime && 
        Date.now() - this.lastFailureTime >= this.resetTimeout) {
      this.state = CircuitState.HALF_OPEN;
      this.successes = 0;
    }
  }

  private cleanupOldFailures(): void {
    const cutoff = Date.now() - this.monitoringPeriod;
    this.failureTimestamps = this.failureTimestamps.filter(time => time > cutoff);
  }
}