// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global jest, describe, it, expect, beforeAll, afterAll, beforeEach */
import { TokenBucketLimiter } from "../../src/rate-limit/token-bucket";

function advanceTime(ms: number) {
  jest.advanceTimersByTime(ms);
  // Also tick real timers a tiny bit for promises resolution
  return Promise.resolve();
}

describe("TokenBucketLimiter adaptive behavior", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2020-01-01T00:00:00.000Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("respects Retry-After header by pausing issuance", async () => {
    const limiter = new TokenBucketLimiter({ capacity: 2, refillPerSec: 10 });
    // Consume current tokens
    await limiter.waitForSlot();
    await limiter.waitForSlot();

    // Signal Retry-After of 3 seconds
    limiter.updateFromResponse({ retryAfterSeconds: 3 });

    const start = Date.now();
    const promise = (async () => {
      // Next wait should pause ~3s before allowing
      const t0 = Date.now();
      await limiter.waitForSlot();
      return Date.now() - t0;
    })();

    await advanceTime(2000);
    // Should still be waiting
    let resolved = false;
    promise.then(() => (resolved = true));
    await Promise.resolve();
    expect(resolved).toBe(false);

    await advanceTime(1200);
    const waitedMs = await promise;
    expect(waitedMs).toBeGreaterThanOrEqual(2900);
  });

  it("pauses until reset when remaining=0 and reset is seconds-from-now", async () => {
    const limiter = new TokenBucketLimiter({ capacity: 1, refillPerSec: 1 });
    await limiter.waitForSlot();

    limiter.updateFromResponse({ remaining: 0, reset: 2 }); // 2s cooldown

    const p = limiter.waitForSlot();
    await advanceTime(1500);
    let done = false;
    p.then(() => (done = true));
    await Promise.resolve();
    expect(done).toBe(false);

    await advanceTime(600);
    await p; // should resolve now
    expect(true).toBe(true);
  });

  it("adjusts refill rate down when remaining fraction is low", async () => {
    const limiter = new TokenBucketLimiter({ capacity: 10, refillPerSec: 10 });
    limiter.updateFromResponse({ limit: 100, remaining: 5 }); // 5% remaining → heavy throttle
    const status = limiter.getStatus();
    expect(status.refillPerSec).toBeLessThan(10);
  });

  describe("robust timestamp handling", () => {
    beforeEach(() => {
      // Set a known time (2022-01-01 12:00:00 UTC = 1641038400 epoch seconds)
      jest.setSystemTime(new Date("2022-01-01T12:00:00.000Z"));
    });

    it("correctly handles epoch timestamps", async () => {
      const limiter = new TokenBucketLimiter({ capacity: 1, refillPerSec: 1 });
      await limiter.waitForSlot();

      // Use epoch timestamp for 5 seconds from now (1641038405)
      const resetEpoch = Math.floor(Date.now() / 1000) + 5;
      limiter.updateFromResponse({ remaining: 0, reset: resetEpoch });

      const p = limiter.waitForSlot();
      await advanceTime(3000);
      let done = false;
      p.then(() => (done = true));
      await Promise.resolve();
      expect(done).toBe(false); // Should still be waiting

      await advanceTime(2500);
      await p; // Should resolve now
    });

    it("correctly handles relative duration timestamps", async () => {
      const limiter = new TokenBucketLimiter({ capacity: 1, refillPerSec: 1 });
      await limiter.waitForSlot();

      // Use relative duration (3 seconds from now)
      limiter.updateFromResponse({ remaining: 0, reset: 3 });

      const p = limiter.waitForSlot();
      await advanceTime(2000);
      let done = false;
      p.then(() => (done = true));
      await Promise.resolve();
      expect(done).toBe(false); // Should still be waiting

      await advanceTime(1500);
      await p; // Should resolve now
    });

    it("caps extremely long cooldowns to reasonable maximum", async () => {
      const limiter = new TokenBucketLimiter({ capacity: 1, refillPerSec: 1 });
      await limiter.waitForSlot();

      // Use a very far future epoch timestamp (year 2030)
      const farFutureEpoch = 1893456000; // 2030-01-01
      limiter.updateFromResponse({ remaining: 0, reset: farFutureEpoch });

      const status = limiter.getStatus();
      const maxReasonableCooldown = 86400 * 1000; // 24 hours in ms
      expect(status.cooldownUntilMs).toBeLessThanOrEqual(Date.now() + maxReasonableCooldown);
    });

    it("handles invalid timestamp values gracefully", async () => {
      const limiter = new TokenBucketLimiter({ capacity: 1, refillPerSec: 1 });
      await limiter.waitForSlot();

      // Test various invalid values
      const invalidValues = [-1, NaN, Infinity, -Infinity];
      
      for (const invalidValue of invalidValues) {
        limiter.updateFromResponse({ remaining: 0, reset: invalidValue });
        const status = limiter.getStatus();
        // Should not set any cooldown for invalid values
        expect(status.cooldownUntilMs).toBeUndefined();
      }
    });

    it("treats past epoch timestamps safely", async () => {
      const limiter = new TokenBucketLimiter({ capacity: 1, refillPerSec: 1 });
      await limiter.waitForSlot();

      // Use a past epoch timestamp (should result in no cooldown)
      const pastEpoch = Math.floor(Date.now() / 1000) - 100;
      limiter.updateFromResponse({ remaining: 0, reset: pastEpoch });

      // Should be able to proceed immediately since past timestamp = 0 delay
      expect(limiter.canProceed()).toBe(true);
    });

    it("handles ambiguous large values conservatively", async () => {
      const limiter = new TokenBucketLimiter({ capacity: 1, refillPerSec: 1 });
      await limiter.waitForSlot();

      // Use a value that's too large to be reasonable relative duration
      // but outside epoch bounds (e.g., 100000 seconds = ~28 hours)
      const ambiguousValue = 100000;
      limiter.updateFromResponse({ remaining: 0, reset: ambiguousValue });

      const status = limiter.getStatus();
      const maxReasonableCooldown = 86400 * 1000; // 24 hours in ms
      // Should be capped to reasonable maximum
      expect(status.cooldownUntilMs).toBeLessThanOrEqual(Date.now() + maxReasonableCooldown);
    });

    it("handles boundary values correctly", async () => {
      const limiter = new TokenBucketLimiter({ capacity: 1, refillPerSec: 1 });
      await limiter.waitForSlot();

      // Test epoch boundary values
      const epochMin = 1577836800; // 2020-01-01
      const epochMax = 1893456000; // 2030-01-01
      const futureEpoch = Math.floor(Date.now() / 1000) + 10; // 10 seconds in future

      // Past epoch timestamp - should clear cooldown and restore tokens
      limiter.updateFromResponse({ remaining: 0, reset: epochMin + 1 });
      let status = limiter.getStatus();
      expect(status.cooldownUntilMs).toBeUndefined(); // Past timestamp should clear cooldown
      expect(limiter.canProceed()).toBe(true); // Should be able to proceed

      // Future epoch timestamp - should set cooldown
      limiter.updateFromResponse({ remaining: 0, reset: futureEpoch });
      status = limiter.getStatus();
      expect(status.cooldownUntilMs).toBeDefined();
      expect(status.cooldownUntilMs).toBeGreaterThan(Date.now());

      // Large relative duration - should be treated as relative
      const largeRelative = 86400; // 24 hours
      limiter.updateFromResponse({ remaining: 0, reset: largeRelative });
      status = limiter.getStatus();
      expect(status.cooldownUntilMs).toBeDefined();
      expect(status.cooldownUntilMs).toBeGreaterThan(Date.now());
    });
  });

  describe("rate limiting callback integration", () => {
    it("should handle callback from connector properly", async () => {
      const limiter = new TokenBucketLimiter({ capacity: 1, refillPerSec: 1 });
      
      // Consume the token
      await limiter.waitForSlot();
      
      // This simulates what the connector would call when it receives
      // a rate limit response from the API
      const rateLimitInfo = { retryAfterSeconds: 2 };
      limiter.updateFromResponse(rateLimitInfo);
      
      // Should not be able to proceed immediately
      expect(limiter.canProceed()).toBe(false);
      
      // Fast forward past the retry period
      jest.advanceTimersByTime(2500);
      
      // Should now be able to proceed
      expect(limiter.canProceed()).toBe(true);
    });

    it("should handle edge cases in callback data", async () => {
      const limiter = new TokenBucketLimiter({ capacity: 2, refillPerSec: 1 });
      
      // Test with undefined
      limiter.updateFromResponse({});
      expect(limiter.canProceed()).toBe(true);
      
      // Test with null retryAfterSeconds
      limiter.updateFromResponse({ retryAfterSeconds: null as any });
      expect(limiter.canProceed()).toBe(true);
      
      // Test with zero
      limiter.updateFromResponse({ retryAfterSeconds: 0 });
      expect(limiter.canProceed()).toBe(true);
      
      // Test with negative value
      limiter.updateFromResponse({ retryAfterSeconds: -1 });
      expect(limiter.canProceed()).toBe(true);
    });

    it("should handle very small retry-after values", async () => {
      const limiter = new TokenBucketLimiter({ capacity: 1, refillPerSec: 10 });
      await limiter.waitForSlot();
      
      // Test with very small retry-after (0.1 seconds)
      limiter.updateFromResponse({ retryAfterSeconds: 0.1 });
      
      expect(limiter.canProceed()).toBe(false);
      
      // Advance by the small amount
      jest.advanceTimersByTime(150); // 0.15 seconds
      
      expect(limiter.canProceed()).toBe(true);
    });
  });
});

