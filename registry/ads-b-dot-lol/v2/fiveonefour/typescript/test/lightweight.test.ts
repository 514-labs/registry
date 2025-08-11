/**
 * Lightweight tests for ADS-B connector
 * These tests focus on core functionality without requiring live API access
 */

import { AdsbConnector } from '../index';
import { ConnectorError, ErrorCode } from '../types';

// Mock fetch for testing
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock AbortSignal.timeout for Node.js compatibility
if (!AbortSignal.timeout) {
  AbortSignal.timeout = (ms: number) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  };
}

describe('ADS-B Connector - Lightweight Tests', () => {
  let connector: AdsbConnector;

  beforeEach(() => {
    connector = new AdsbConnector();
    mockFetch.mockClear();
  });

  describe('Initialization and Lifecycle', () => {
    test('should initialize with default configuration', async () => {
      await connector.initialize();
      expect(connector.isConnected()).toBe(false);
    });

    test('should connect and disconnect properly', async () => {
      await connector.initialize();
      await connector.connect();
      expect(connector.isConnected()).toBe(true);

      await connector.disconnect();
      expect(connector.isConnected()).toBe(false);
    });

    test('should accept custom configuration', async () => {
      await connector.initialize({
        timeout: 10000,
        rateLimit: { requestsPerMinute: 100 }
      });
      
      const status = connector.getRateLimitStatus();
      expect(status.limit).toBeLessThanOrEqual(100);
    });
  });

  describe('Error Handling', () => {
    test('should throw structured error when not connected', async () => {
      await connector.initialize();
      // Don't connect
      
      try {
        await connector.trackByICAO('A12345');
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(ConnectorError);
        expect(error.code).toBe(ErrorCode.INVALID_REQUEST);
        expect(error.retryable).toBe(false);
      }
    });

    test('should throw UNSUPPORTED error for write operations', () => {
      expect(() => connector.post()).toThrow(ConnectorError);
      expect(() => connector.put()).toThrow(ConnectorError);
      expect(() => connector.patch()).toThrow(ConnectorError);
      expect(() => connector.delete()).toThrow(ConnectorError);
      
      try {
        connector.post();
      } catch (error: any) {
        expect(error.code).toBe(ErrorCode.UNSUPPORTED);
      }
    });

    test('should throw UNSUPPORTED error for unsupported operations', async () => {
      await connector.initialize();
      await connector.connect();

      try {
        await connector.getAllAircraft();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(ConnectorError);
        expect(error.code).toBe(ErrorCode.UNSUPPORTED);
      }
    });
  });

  describe('Request Building', () => {
    beforeEach(async () => {
      await connector.initialize();
      await connector.connect();
      
      // Mock successful response
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({ ac: [], total: 0, ctime: 123, ptime: 456 })
      });
    });

    test('should build correct URLs for different endpoints', async () => {
      await connector.trackByICAO('A12345');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.adsb.lol/v2/icao/A12345',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'User-Agent': 'ADS-B-Connector/1.0'
          })
        })
      );

      await connector.trackByCallsign('UAL123');
      expect(mockFetch).toHaveBeenLastCalledWith(
        'https://api.adsb.lol/v2/callsign/UAL123',
        expect.any(Object)
      );

      await connector.findNearby(37.7749, -122.4194, 50);
      expect(mockFetch).toHaveBeenLastCalledWith(
        'https://api.adsb.lol/v2/lat/37.7749/lon/-122.4194/dist/50',
        expect.any(Object)
      );
    });

    test('should include timeout and user agent in requests', async () => {
      await connector.trackByICAO('A12345');
      
      const [url, options] = mockFetch.mock.calls[0];
      expect(options.signal).toBeDefined();
      expect(options.headers['User-Agent']).toBe('ADS-B-Connector/1.0');
    });
  });

  describe('Response Processing', () => {
    beforeEach(async () => {
      await connector.initialize();
      await connector.connect();
    });

    test('should process successful response', async () => {
      const mockResponse = {
        ac: [
          { hex: 'A12345', lat: 37.7749, lon: -122.4194, alt_baro: 35000 }
        ],
        total: 1,
        ctime: 1234567890,
        ptime: 1234567891
      };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map(),
        json: () => Promise.resolve(mockResponse)
      });

      const result = await connector.trackByICAO('A12345');
      expect(result).toHaveLength(1);
      expect(result[0].hex).toBe('A12345');
    });

    test('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Map()
      });

      try {
        await connector.trackByICAO('INVALID');
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(ConnectorError);
        expect(error.code).toBe(ErrorCode.INVALID_REQUEST);
        expect(error.statusCode).toBe(404);
      }
    });

    test('should handle JSON parsing errors', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map(),
        json: () => Promise.reject(new Error('Invalid JSON'))
      });

      try {
        await connector.trackByICAO('A12345');
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(ConnectorError);
        expect(error.code).toBe(ErrorCode.PARSING_ERROR);
      }
    });
  });

  describe('Circuit Breaker', () => {
    beforeEach(async () => {
      await connector.initialize();
      await connector.connect();
    });

    test('should track circuit breaker status', () => {
      const status = connector.getCircuitBreakerStatus();
      expect(status.state).toBe('CLOSED');
      expect(status.failures).toBe(0);
    });

    test('should open circuit after failures', async () => {
      // Mock network errors
      mockFetch.mockRejectedValue(new Error('Network error'));

      // Generate enough failures to open circuit
      for (let i = 0; i < 6; i++) {
        try {
          await connector.trackByICAO('A12345');
        } catch {
          // Expected to fail
        }
      }

      const status = connector.getCircuitBreakerStatus();
      expect(status.state).toBe('OPEN');
      expect(status.failures).toBeGreaterThan(0);
    });
  });

  describe('Rate Limiting', () => {
    beforeEach(async () => {
      await connector.initialize({
        rateLimit: { requestsPerMinute: 2 } // Very low for testing
      });
      await connector.connect();
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map(),
        json: () => Promise.resolve({ ac: [], total: 0, ctime: 123, ptime: 456 })
      });
    });

    test('should track rate limit status', async () => {
      const initialStatus = connector.getRateLimitStatus();
      expect(initialStatus.remaining).toBeGreaterThan(0);

      await connector.trackByICAO('A12345');
      
      const afterStatus = connector.getRateLimitStatus();
      expect(afterStatus.remaining).toBeLessThan(initialStatus.remaining);
    });

    test('should enforce concurrent request limits', () => {
      const status = connector.getConcurrencyStatus();
      expect(status.active).toBe(0);
      expect(status.max).toBeGreaterThan(0);
    });
  });

  describe('Cancellation', () => {
    beforeEach(async () => {
      await connector.initialize();
      await connector.connect();
    });

    test('should handle cancelled requests', async () => {
      const controller = new AbortController();
      
      // Mock a request that will be cancelled
      mockFetch.mockImplementation(() => {
        return new Promise((_, reject) => {
          controller.signal.addEventListener('abort', () => {
            const error = new Error('Request cancelled');
            error.name = 'AbortError';
            reject(error);
          });
        });
      });

      // Start request and immediately cancel
      const promise = connector.trackByICAO('A12345', controller.signal);
      controller.abort();

      try {
        await promise;
        fail('Should have thrown cancellation error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(ConnectorError);
        expect(error.code).toBe(ErrorCode.CANCELLED);
      }
    });
  });

  describe('Data Validation', () => {
    test('should validate data against schema', () => {
      const validData = {
        ac: [{ hex: 'A12345', lat: 37.7749, lon: -122.4194 }],
        total: 1,
        ctime: 123,
        ptime: 456
      };

      expect(() => {
        connector.validate(validData, {
          type: 'object',
          properties: {
            ac: { type: 'array' },
            total: { type: 'number' }
          },
          required: ['ac', 'total']
        });
      }).not.toThrow();
    });

    test('should reject invalid data', () => {
      const invalidData = { ac: 'not an array' };

      try {
        connector.validate(invalidData, {
          type: 'object',
          properties: {
            ac: { type: 'array' }
          }
        });
        fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(ConnectorError);
        expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      }
    });
  });

  describe('Hooks System', () => {
    test('should execute hooks in correct order', async () => {
      const hookCalls: string[] = [];
      
      await connector.initialize({
        hooks: {
          beforeRequest: [{
            name: 'test-before',
            priority: 1,
            execute: () => { hookCalls.push('before'); }
          }],
          afterResponse: [{
            name: 'test-after',
            priority: 1,
            execute: () => { hookCalls.push('after'); }
          }]
        }
      });
      await connector.connect();

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map(),
        json: () => Promise.resolve({ ac: [], total: 0, ctime: 123, ptime: 456 })
      });

      await connector.trackByICAO('A12345');
      
      expect(hookCalls).toEqual(['before', 'after']);
    });
  });
});

// Integration test (requires network access - skip in CI)
describe('ADS-B Connector - Integration Tests', () => {
  let connector: AdsbConnector;

  beforeEach(async () => {
    connector = new AdsbConnector();
    await connector.initialize();
    await connector.connect();
  });

  // Skip these tests by default - run manually when needed
  test.skip('should fetch real data from ADS-B.lol', async () => {
    const aircraft = await connector.findNearby(37.7749, -122.4194, 100);
    expect(Array.isArray(aircraft)).toBe(true);
    // Note: May return empty array if no aircraft in area
  });

  test.skip('should handle rate limiting from real API', async () => {
    const promises = Array.from({ length: 10 }, (_, i) => 
      connector.trackByICAO(`A${i.toString().padStart(5, '0')}`)
    );

    const results = await Promise.allSettled(promises);
    
    // Some requests should succeed (if aircraft exist) or fail gracefully
    results.forEach(result => {
      if (result.status === 'rejected') {
        expect(result.reason).toBeInstanceOf(ConnectorError);
      }
    });
  });
});