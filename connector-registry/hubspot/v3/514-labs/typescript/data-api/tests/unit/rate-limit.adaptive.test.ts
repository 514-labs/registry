/* eslint-env jest */
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
});

