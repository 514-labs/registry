export class TokenBucketLimiter {
  private capacity: number;
  private tokens: number;
  private refillPerSec: number;
  private lastRefill: number;
  private baseRefillPerSec: number;
  private cooldownUntilMs: number | undefined;

  constructor(params: { capacity: number; refillPerSec: number }) {
    this.capacity = Math.max(1, params.capacity);
    this.tokens = this.capacity;
    this.refillPerSec = Math.max(1, params.refillPerSec);
    this.baseRefillPerSec = this.refillPerSec;
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

  private async sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  private setCooldownFor(ms: number) {
    const until = Date.now() + Math.max(0, ms);
    if (!this.cooldownUntilMs || until > this.cooldownUntilMs) {
      this.cooldownUntilMs = until;
    }
  }

  /**
   * Update limiter based on response headers/meta.
   * Accepts HubSpot-style hints: limit, remaining, reset (sec or epoch-sec), retryAfterSeconds.
   */
  updateFromResponse(info?: { limit?: number; remaining?: number; reset?: number; retryAfterSeconds?: number }): void {
    if (!info) return;

    // Honor Retry-After explicitly
    if (Number.isFinite(info.retryAfterSeconds) && (info.retryAfterSeconds as number) > 0) {
      const seconds = info.retryAfterSeconds as number;
      this.setCooldownFor(seconds * 1000);
      // eslint-disable-next-line no-console
      console.info(`[rate-limit] Retry-After=${seconds}s → pausing new requests`);
    }

    const hasRemaining = info.remaining !== undefined && Number.isFinite(info.remaining as number);
    const hasLimit = info.limit !== undefined && Number.isFinite(info.limit as number);

    if (hasRemaining) {
      const remaining = Math.max(0, info.remaining as number);

      // If we have exhausted the window and a reset is known, pause until reset
      if (remaining <= 0 && info.reset !== undefined && Number.isFinite(info.reset as number)) {
        const resetVal = info.reset as number;
        const nowSec = Math.floor(Date.now() / 1000);
        // Heuristic: treat values larger than nowSec as epoch seconds, otherwise seconds-from-now
        const msUntil = resetVal > nowSec ? Math.max(0, (resetVal - nowSec) * 1000) : Math.max(0, resetVal * 1000);
        if (msUntil > 0) {
          this.setCooldownFor(msUntil);
          // eslint-disable-next-line no-console
          console.info(`[rate-limit] Remaining=0, reset in ~${Math.ceil(msUntil / 1000)}s → pausing new requests`);
        }
      }

      // Adjust refill rate conservatively based on remaining/limit ratio when limit is known
      if (hasLimit) {
        const limit = Math.max(1, info.limit as number);
        const fraction = Math.min(1, Math.max(0, remaining / limit));
        let factor = 1;
        if (fraction <= 0.10) factor = 0.5; // heavy throttle
        else if (fraction <= 0.25) factor = 0.75; // moderate throttle
        else if (fraction <= 0.5) factor = 0.9; // light throttle
        else factor = 1.0; // back to baseline
        const target = Math.max(1, Math.floor(this.baseRefillPerSec * factor));
        if (target !== this.refillPerSec) {
          this.refillPerSec = target;
          // eslint-disable-next-line no-console
          console.info(`[rate-limit] Adjusting pace → ${target}/s (remaining=${remaining}/${limit})`);
        }
      }
    }
  }

  getStatus(): { capacity: number; tokens: number; refillPerSec: number; cooldownUntilMs?: number } {
    return { capacity: this.capacity, tokens: this.tokens, refillPerSec: this.refillPerSec, cooldownUntilMs: this.cooldownUntilMs };
  }

  canProceed(): boolean {
    if (this.cooldownUntilMs && Date.now() < this.cooldownUntilMs) return false;
    this.refillTokens();
    return this.tokens >= 1;
  }

  async waitForSlot(): Promise<void> {
    while (true) {
      const now = Date.now();
      if (this.cooldownUntilMs && now < this.cooldownUntilMs) {
        const sleepMs = Math.min(this.cooldownUntilMs - now, 1000);
        await this.sleep(sleepMs);
        continue;
      }
      this.refillTokens();
      if (this.tokens >= 1) {
        this.tokens -= 1;
        return;
      }
      await this.sleep(50);
    }
  }
}


