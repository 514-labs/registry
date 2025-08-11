export interface RateLimitConfig {
  requestsPerSecond?: number;
  requestsPerMinute?: number;
  requestsPerHour?: number;
  burstCapacity?: number;
}

export interface RateLimitStatus {
  limit: number;
  remaining: number;
  reset: string;
  retryAfter?: number;
}

// Token bucket implementation for smooth rate limiting
export class TokenBucketRateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly capacity: number;
  private readonly refillRate: number;
  private readonly refillInterval: number;

  constructor(config: RateLimitConfig) {
    // Convert to tokens per millisecond
    if (config.requestsPerSecond) {
      this.refillRate = config.requestsPerSecond / 1000;
      this.capacity = config.burstCapacity || config.requestsPerSecond * 2;
    } else if (config.requestsPerMinute) {
      this.refillRate = config.requestsPerMinute / 60000;
      this.capacity = config.burstCapacity || Math.ceil(config.requestsPerMinute / 10);
    } else if (config.requestsPerHour) {
      this.refillRate = config.requestsPerHour / 3600000;
      this.capacity = config.burstCapacity || Math.ceil(config.requestsPerHour / 60);
    } else {
      // Default: 300 requests per minute
      this.refillRate = 300 / 60000;
      this.capacity = 30;
    }

    this.tokens = this.capacity;
    this.lastRefill = Date.now();
    this.refillInterval = 100; // Check for refill every 100ms
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = elapsed * this.refillRate;
    
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  async canProceed(): Promise<boolean> {
    this.refill();
    return this.tokens >= 1;
  }

  async waitForSlot(): Promise<void> {
    while (true) {
      this.refill();
      
      if (this.tokens >= 1) {
        this.tokens -= 1;
        return;
      }

      // Calculate wait time
      const tokensNeeded = 1 - this.tokens;
      const waitTime = Math.ceil(tokensNeeded / this.refillRate);
      
      await new Promise(resolve => setTimeout(resolve, Math.min(waitTime, this.refillInterval)));
    }
  }

  getStatus(): RateLimitStatus {
    this.refill();
    
    const resetTime = new Date();
    resetTime.setMilliseconds(resetTime.getMilliseconds() + (this.capacity - this.tokens) / this.refillRate);
    
    return {
      limit: this.capacity,
      remaining: Math.floor(this.tokens),
      reset: resetTime.toISOString(),
      retryAfter: this.tokens < 1 ? Math.ceil((1 - this.tokens) / this.refillRate / 1000) : undefined
    };
  }

  updateFromHeaders(headers: Headers): void {
    // Adaptive rate limiting based on server response
    const remaining = headers.get('X-RateLimit-Remaining');
    const limit = headers.get('X-RateLimit-Limit');
    
    if (remaining && limit) {
      const serverRemaining = parseInt(remaining, 10);
      const serverLimit = parseInt(limit, 10);
      
      // Adjust tokens based on server feedback
      if (serverRemaining < this.tokens) {
        this.tokens = serverRemaining;
      }
      
      // Optionally adjust capacity if server limit differs
      if (serverLimit !== this.capacity) {
        // Log this for monitoring
        console.warn(`Server rate limit (${serverLimit}) differs from configured limit (${this.capacity})`);
      }
    }
  }
}

// Sliding window implementation for precise rate limiting
export class SlidingWindowRateLimiter {
  private requests: number[] = [];
  private readonly windowSize: number;
  private readonly limit: number;

  constructor(config: RateLimitConfig) {
    if (config.requestsPerSecond) {
      this.windowSize = 1000;
      this.limit = config.requestsPerSecond;
    } else if (config.requestsPerMinute) {
      this.windowSize = 60000;
      this.limit = config.requestsPerMinute;
    } else if (config.requestsPerHour) {
      this.windowSize = 3600000;
      this.limit = config.requestsPerHour;
    } else {
      this.windowSize = 60000;
      this.limit = 300;
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const cutoff = now - this.windowSize;
    this.requests = this.requests.filter(time => time > cutoff);
  }

  async canProceed(): Promise<boolean> {
    this.cleanup();
    return this.requests.length < this.limit;
  }

  async waitForSlot(): Promise<void> {
    while (true) {
      this.cleanup();
      
      if (this.requests.length < this.limit) {
        this.requests.push(Date.now());
        return;
      }

      // Wait until the oldest request falls outside the window
      const oldestRequest = this.requests[0];
      const waitTime = oldestRequest + this.windowSize - Date.now() + 1;
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  getStatus(): RateLimitStatus {
    this.cleanup();
    
    const resetTime = new Date();
    if (this.requests.length > 0) {
      resetTime.setTime(this.requests[0] + this.windowSize);
    }
    
    return {
      limit: this.limit,
      remaining: Math.max(0, this.limit - this.requests.length),
      reset: resetTime.toISOString()
    };
  }
}