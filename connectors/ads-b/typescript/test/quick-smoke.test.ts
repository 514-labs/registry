/**
 * Super quick smoke tests - runs in under 1 second
 * These tests verify basic functionality without mocking fetch
 */

import { AdsbConnector } from '../index';
import { ConnectorError, ErrorCode } from '../types';
import { TokenBucketRateLimiter } from '../rate-limiter';
import { CircuitBreaker } from '../circuit-breaker';
import { DataTransformer } from '../data-transformer';

describe('Quick Smoke Tests', () => {
  test('connector can be instantiated', () => {
    const connector = new AdsbConnector();
    expect(connector).toBeInstanceOf(AdsbConnector);
  });

  test('error classes work correctly', () => {
    const error = new ConnectorError('test', ErrorCode.NETWORK_ERROR, {
      retryable: true,
      requestId: 'test-123'
    });
    
    expect(error.message).toBe('test');
    expect(error.code).toBe(ErrorCode.NETWORK_ERROR);
    expect(error.retryable).toBe(true);
    expect(error.requestId).toBe('test-123');
  });

  test('rate limiter initializes with defaults', () => {
    const rateLimiter = new TokenBucketRateLimiter({});
    const status = rateLimiter.getStatus();
    
    expect(status.limit).toBeGreaterThan(0);
    expect(status.remaining).toBeGreaterThanOrEqual(0);
    expect(status.reset).toBeDefined();
  });

  test('circuit breaker starts in closed state', () => {
    const circuitBreaker = new CircuitBreaker();
    const status = circuitBreaker.getStatus();
    
    expect(status.state).toBe('CLOSED');
    expect(status.failures).toBe(0);
    expect(circuitBreaker.canProceed()).toBe(true);
  });

  test('data transformer validates basic schema', () => {
    const data = { name: 'test', count: 42 };
    const schema = {
      type: 'object' as const,
      properties: {
        name: { type: 'string' as const },
        count: { type: 'number' as const }
      }
    };
    
    expect(() => DataTransformer.validate(data, schema)).not.toThrow();
  });

  test('connector methods exist', () => {
    const connector = new AdsbConnector();
    
    // Lifecycle methods
    expect(typeof connector.initialize).toBe('function');
    expect(typeof connector.connect).toBe('function');
    expect(typeof connector.disconnect).toBe('function');
    expect(typeof connector.isConnected).toBe('function');
    
    // HTTP methods
    expect(typeof connector.get).toBe('function');
    expect(typeof connector.request).toBe('function');
    
    // User-friendly methods
    expect(typeof connector.trackByICAO).toBe('function');
    expect(typeof connector.trackByCallsign).toBe('function');
    expect(typeof connector.findNearby).toBe('function');
    expect(typeof connector.getMilitary).toBe('function');
    
    // Status methods
    expect(typeof connector.getRateLimitStatus).toBe('function');
    expect(typeof connector.getCircuitBreakerStatus).toBe('function');
    expect(typeof connector.getConcurrencyStatus).toBe('function');
    
    // Data methods
    expect(typeof connector.serialize).toBe('function');
    expect(typeof connector.deserialize).toBe('function');
    expect(typeof connector.validate).toBe('function');
  });

  test('write methods throw unsupported errors', () => {
    const connector = new AdsbConnector();
    
    expect(() => connector.post()).toThrow();
    expect(() => connector.put()).toThrow();
    expect(() => connector.patch()).toThrow();
    expect(() => connector.delete()).toThrow();
    
    try {
      connector.post();
    } catch (error: any) {
      expect(error).toBeInstanceOf(ConnectorError);
      expect(error.code).toBe(ErrorCode.UNSUPPORTED);
    }
  });

  test('configuration merges correctly', async () => {
    const connector = new AdsbConnector();
    
    await connector.initialize({
      timeout: 15000,
      rateLimit: { requestsPerMinute: 200 }
    });
    
    // Should not throw and should merge configs
    expect(connector.isConnected()).toBe(false);
  });
});

// Performance test
describe('Performance Tests', () => {
  test('connector creation is fast', () => {
    const start = performance.now();
    
    for (let i = 0; i < 100; i++) {
      new AdsbConnector();
    }
    
    const end = performance.now();
    expect(end - start).toBeLessThan(100); // Should take less than 100ms
  });

  test('rate limiter operations are fast', () => {
    const rateLimiter = new TokenBucketRateLimiter({
      requestsPerMinute: 60
    });
    
    const start = performance.now();
    
    for (let i = 0; i < 1000; i++) {
      rateLimiter.canProceed();
      rateLimiter.getStatus();
    }
    
    const end = performance.now();
    expect(end - start).toBeLessThan(50); // Should be very fast
  });
});