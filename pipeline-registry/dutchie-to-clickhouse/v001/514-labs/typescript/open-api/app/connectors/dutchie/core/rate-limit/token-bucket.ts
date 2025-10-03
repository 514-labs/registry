export class TokenBucketLimiter {
  private capacity: number;
  private tokens: number;
  private refillPerSec: number;
  private lastRefill: number;
  private suspendedUntil?: number;

  constructor(params: { capacity: number; refillPerSec: number }) {
    this.capacity = Math.max(1, params.capacity);
    this.tokens = this.capacity;
    this.refillPerSec = Math.max(1, params.refillPerSec);
    this.lastRefill = Date.now();
  }

  private refillTokens() {
    const now = Date.now();
    
    // Check if we're in a suspended state due to rate limiting
    if (this.suspendedUntil && now < this.suspendedUntil) {
      return; // Don't refill tokens while suspended
    }
    
    // Clear suspension if it has expired
    if (this.suspendedUntil && now >= this.suspendedUntil) {
      this.suspendedUntil = undefined;
    }
    
    const elapsedSec = (now - this.lastRefill) / 1000;
    if (elapsedSec <= 0) return;
    const add = elapsedSec * this.refillPerSec;
    this.tokens = Math.min(this.capacity, this.tokens + add);
    this.lastRefill = now;
  }

  canProceed(): boolean {
    this.refillTokens();
    return this.tokens >= 1;
  }

  async waitForSlot(): Promise<void> {
    this.refillTokens();
    while (this.tokens < 1) {
      await new Promise((r) => setTimeout(r, 50));
      this.refillTokens();
    }
    this.tokens -= 1;
  }

  updateFromResponse(rateLimit: { retryAfterSeconds?: number }): void {
    if (rateLimit.retryAfterSeconds && rateLimit.retryAfterSeconds > 0) {
      // When we hit a rate limit, drain all tokens and suspend refilling
      this.tokens = 0;
      this.suspendedUntil = Date.now() + (rateLimit.retryAfterSeconds * 1000);
    }
  }
}

