export type RateLimitStatus = {
  limit?: number
  remaining?: number
  reset?: number
  retryAfterMs?: number
  inFlight: number
}

export type RateLimiterOptions = {
  requestsPerSecond?: number
  burstCapacity?: number
  concurrentRequests?: number
}

export class TokenBucketRateLimiter {
  private capacity: number
  private tokens: number
  private refillPerMs: number
  private lastRefillAt: number
  private maxConcurrent: number
  private inFlightCount: number
  private status: RateLimitStatus

  constructor(opts?: RateLimiterOptions) {
    const rps = Math.max(0, opts?.requestsPerSecond ?? 0)
    const burst = Math.max(0, opts?.burstCapacity ?? 0)
    this.capacity = rps + burst
    this.tokens = this.capacity
    this.refillPerMs = rps > 0 ? rps / 1000 : 0
    this.lastRefillAt = Date.now()
    this.maxConcurrent = Math.max(1, opts?.concurrentRequests ?? 10)
    this.inFlightCount = 0
    this.status = { inFlight: 0 }
  }

  private refill(): void {
    const now = Date.now()
    if (this.refillPerMs <= 0) {
      // Disabled limiter; keep bucket full
      this.tokens = this.capacity
      this.lastRefillAt = now
      return
    }
    const elapsed = now - this.lastRefillAt
    if (elapsed <= 0) return
    const refillAmount = elapsed * this.refillPerMs
    this.tokens = Math.min(this.capacity, this.tokens + refillAmount)
    this.lastRefillAt = now
  }

  async waitForSlot(): Promise<void> {
    // If limiter is effectively disabled (no rps configured), allow immediately but still bound concurrency
    // Simple loop with small sleeps to avoid busy-wait
    // eslint-disable-next-line no-constant-condition
    while (true) {
      this.refill()
      const hasToken = this.tokens >= 1 || this.refillPerMs === 0
      const hasConcurrency = this.inFlightCount < this.maxConcurrent
      if (hasToken && hasConcurrency) {
        if (this.refillPerMs > 0) this.tokens -= 1
        this.inFlightCount += 1
        this.status.inFlight = this.inFlightCount
        return
      }
      await new Promise((r) => setTimeout(r, 10))
    }
  }

  release(): void {
    if (this.inFlightCount > 0) this.inFlightCount -= 1
    this.status.inFlight = this.inFlightCount
  }

  updateFromResponse(headers?: Record<string, string>): void {
    if (!headers) return
    // Generic header parsing if upstream provides hints
    const limit = Number(headers['x-ratelimit-limit'])
    const remaining = Number(headers['x-ratelimit-remaining'])
    const reset = Number(headers['x-ratelimit-reset'])
    const retryAfter = headers['retry-after'] || headers['Retry-After']
    let retryAfterMs: number | undefined
    if (retryAfter) {
      const seconds = Number(retryAfter)
      if (!Number.isNaN(seconds)) retryAfterMs = Math.max(0, Math.floor(seconds * 1000))
      else {
        const date = Date.parse(retryAfter)
        if (!Number.isNaN(date)) retryAfterMs = Math.max(0, date - Date.now())
      }
    }
    this.status = {
      ...this.status,
      limit: Number.isFinite(limit) ? limit : this.status.limit,
      remaining: Number.isFinite(remaining) ? remaining : this.status.remaining,
      reset: Number.isFinite(reset) ? reset : this.status.reset,
      retryAfterMs: retryAfterMs ?? this.status.retryAfterMs,
    }
  }

  getStatus(): RateLimitStatus {
    return { ...this.status }
  }
}

export class NoopRateLimiter {
  async waitForSlot(): Promise<void> { /* no-op */ }
  release(): void { /* no-op */ }
  updateFromResponse(): void { /* no-op */ }
  getStatus(): RateLimitStatus { return { inFlight: 0 } }
}

export type RateLimiter = Pick<TokenBucketRateLimiter, 'waitForSlot' | 'release' | 'updateFromResponse' | 'getStatus'>


