export class TokenBucketLimiter {
  private capacity: number;
  private tokens: number;
  private refillPerSec: number;
  private lastRefill: number;

  constructor(params: { capacity: number; refillPerSec: number }) {
    this.capacity = Math.max(1, params.capacity);
    this.tokens = this.capacity;
    this.refillPerSec = Math.max(1, params.refillPerSec);
    this.lastRefill = Date.now();
  }

  private refillTokens() {
    const now = Date.now();
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
    while (true) {
      this.refillTokens();
      if (this.tokens >= 1) {
        this.tokens -= 1;
        return;
      }
      await new Promise((r) => setTimeout(r, 50));
    }
  }
}


