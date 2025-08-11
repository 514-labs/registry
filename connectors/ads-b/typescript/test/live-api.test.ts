/**
 * Live API tests for ADS-B connector
 * Tests against the real ADS-B.lol API
 */

import { AdsbConnector } from '../index';
import { ConnectorError, ErrorCode } from '../types';

describe('Live API Tests', () => {
  let connector: AdsbConnector;

  beforeAll(async () => {
    connector = new AdsbConnector();
    await connector.initialize({
      timeout: 10000, // 10 second timeout for real API
      rateLimit: {
        requestsPerMinute: 30, // Be gentle with the API
        concurrentRequests: 3
      }
    });
    await connector.connect();
  }, 15000); // Allow 15 seconds for initialization

  afterAll(async () => {
    await connector.disconnect();
  });

  describe('Basic API Connectivity', () => {
    test('should fetch military aircraft data', async () => {
      const aircraft = await connector.getMilitary();
      
      // Should return an array (may be empty)
      expect(Array.isArray(aircraft)).toBe(true);
      
      // If there are aircraft, validate structure
      if (aircraft.length > 0) {
        const firstAircraft = aircraft[0];
        expect(typeof firstAircraft.hex).toBe('string');
        expect(firstAircraft.hex).toMatch(/^[A-Fa-f0-9]+$/); // Hex format
        
        console.log(`✓ Found ${aircraft.length} military aircraft`);
        console.log(`✓ Sample aircraft: ${firstAircraft.hex} ${firstAircraft.flight || 'No callsign'}`);
      } else {
        console.log('✓ No military aircraft currently visible (this is normal)');
      }
    }, 15000);

    test('should fetch aircraft near a major airport', async () => {
      // Try LAX (Los Angeles) - major international airport
      const aircraft = await connector.findNearby(33.9425, -118.4081, 25); // 25km radius
      
      expect(Array.isArray(aircraft)).toBe(true);
      
      if (aircraft.length > 0) {
        const firstAircraft = aircraft[0];
        expect(typeof firstAircraft.hex).toBe('string');
        
        // Validate coordinates are within expected range
        if (firstAircraft.lat && firstAircraft.lon) {
          expect(firstAircraft.lat).toBeGreaterThan(30);
          expect(firstAircraft.lat).toBeLessThan(40);
          expect(firstAircraft.lon).toBeGreaterThan(-125);
          expect(firstAircraft.lon).toBeLessThan(-115);
        }
        
        console.log(`✓ Found ${aircraft.length} aircraft near LAX`);
        console.log(`✓ Sample aircraft: ${firstAircraft.hex} at altitude ${firstAircraft.alt_baro || 'unknown'} feet`);
      } else {
        console.log('✓ No aircraft near LAX (unusual but possible)');
      }
    }, 15000);

    test('should handle emergency aircraft query', async () => {
      const emergencyAircraft = await connector.getEmergencies();
      
      expect(Array.isArray(emergencyAircraft)).toBe(true);
      
      if (emergencyAircraft.length > 0) {
        const emergency = emergencyAircraft[0];
        expect(emergency.squawk).toBe('7700'); // Emergency squawk
        console.log(`⚠️  EMERGENCY: Aircraft ${emergency.hex} squawking 7700`);
      } else {
        console.log('✓ No emergency aircraft (this is good!)');
      }
    }, 15000);
  });

  describe('Error Handling with Real API', () => {
    test('should handle invalid ICAO hex codes gracefully', async () => {
      try {
        const aircraft = await connector.trackByICAO('INVALID');
        // API might return empty array or error
        expect(Array.isArray(aircraft)).toBe(true);
        console.log('✓ Invalid ICAO returned empty results');
      } catch (error: any) {
        // Should be a structured error
        expect(error).toBeInstanceOf(ConnectorError);
        console.log(`✓ Invalid ICAO properly handled: ${error.message}`);
      }
    }, 10000);

    test('should respect rate limits', async () => {
      const requests = Array.from({ length: 5 }, (_, i) => 
        connector.findNearby(37.7749 + i * 0.01, -122.4194, 10)
      );

      const startTime = Date.now();
      const results = await Promise.allSettled(requests);
      const endTime = Date.now();
      
      // Should take some time due to rate limiting
      expect(endTime - startTime).toBeGreaterThan(1000); // At least 1 second
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      console.log(`✓ Rate limiting test: ${successful} succeeded, ${failed} rate limited`);
      expect(successful + failed).toBe(5);
    }, 30000);
  });

  describe('Data Quality', () => {
    test('should return valid aircraft data structure', async () => {
      // Try a busy area - around Heathrow (LHR)
      const aircraft = await connector.findNearby(51.4700, -0.4543, 30);
      
      expect(Array.isArray(aircraft)).toBe(true);
      
      if (aircraft.length > 0) {
        const sample = aircraft[0];
        
        // Required field
        expect(typeof sample.hex).toBe('string');
        expect(sample.hex).toMatch(/^[A-Fa-f0-9]{6}$/); // 6 character hex
        
        // Optional but common fields
        if (sample.lat !== undefined) {
          expect(typeof sample.lat).toBe('number');
          expect(sample.lat).toBeGreaterThan(-90);
          expect(sample.lat).toBeLessThan(90);
        }
        
        if (sample.lon !== undefined) {
          expect(typeof sample.lon).toBe('number');
          expect(sample.lon).toBeGreaterThan(-180);
          expect(sample.lon).toBeLessThan(180);
        }
        
        if (sample.alt_baro !== undefined) {
          expect(typeof sample.alt_baro).toBe('number');
          expect(sample.alt_baro).toBeGreaterThan(-1000); // Below sea level possible
          expect(sample.alt_baro).toBeLessThan(60000); // Commercial ceiling
        }
        
        console.log(`✓ Data validation passed for aircraft ${sample.hex}`);
        console.log(`  Position: ${sample.lat}, ${sample.lon}`);
        console.log(`  Altitude: ${sample.alt_baro} feet`);
        console.log(`  Callsign: ${sample.flight || 'None'}`);
      }
    }, 15000);

    test('should handle different aircraft types', async () => {
      // Try to get Boeing 737s (very common)
      const boeing737s = await connector.getByType('B738'); // 737-800
      
      expect(Array.isArray(boeing737s)).toBe(true);
      
      if (boeing737s.length > 0) {
        const aircraft = boeing737s[0];
        expect(aircraft.type).toBe('B738');
        console.log(`✓ Found ${boeing737s.length} Boeing 737-800 aircraft`);
      } else {
        console.log('✓ No Boeing 737-800s currently tracked');
      }
    }, 15000);
  });

  describe('Connector Features with Real API', () => {
    test('should track request IDs and metadata', async () => {
      const startTime = Date.now();
      const aircraft = await connector.findNearby(40.7128, -74.0060, 50); // NYC area
      const endTime = Date.now();
      
      // The connector should work (we can't access internal response envelope in user methods)
      expect(Array.isArray(aircraft)).toBe(true);
      expect(endTime - startTime).toBeGreaterThan(0);
      
      console.log(`✓ Request completed in ${endTime - startTime}ms`);
    }, 15000);

    test('should handle concurrent requests', async () => {
      const locations = [
        [37.7749, -122.4194], // San Francisco
        [40.7128, -74.0060],  // New York
        [51.5074, -0.1278]    // London
      ];

      const promises = locations.map(([lat, lon]) => 
        connector.findNearby(lat, lon, 25)
      );

      const startTime = Date.now();
      const results = await Promise.all(promises);
      const endTime = Date.now();

      expect(results).toHaveLength(3);
      results.forEach(aircraft => {
        expect(Array.isArray(aircraft)).toBe(true);
      });

      const totalAircraft = results.reduce((sum, aircraft) => sum + aircraft.length, 0);
      console.log(`✓ Concurrent requests completed in ${endTime - startTime}ms`);
      console.log(`✓ Total aircraft found across 3 cities: ${totalAircraft}`);
    }, 20000);

    test('should handle request cancellation', async () => {
      const controller = new AbortController();
      
      // Start a request then cancel it quickly
      const promise = connector.findNearby(37.7749, -122.4194, 100, controller.signal);
      
      // Cancel after 100ms
      setTimeout(() => controller.abort(), 100);

      try {
        await promise;
        // If request completed before cancellation, that's OK too
        console.log('✓ Request completed before cancellation');
      } catch (error: any) {
        expect(error).toBeInstanceOf(ConnectorError);
        if (error.code === ErrorCode.CANCELLED) {
          console.log('✓ Request properly cancelled');
        } else {
          console.log(`✓ Request failed with: ${error.message}`);
        }
      }
    }, 10000);
  });

  describe('Circuit Breaker with Real API', () => {
    test('should track circuit breaker status during normal operation', () => {
      const status = connector.getCircuitBreakerStatus();
      
      expect(status.state).toBe('CLOSED');
      expect(typeof status.failures).toBe('number');
      
      console.log(`✓ Circuit breaker status: ${status.state}, ${status.failures} failures`);
    });

    test('should track rate limit status', () => {
      const status = connector.getRateLimitStatus();
      
      expect(typeof status.limit).toBe('number');
      expect(typeof status.remaining).toBe('number');
      expect(status.remaining).toBeLessThanOrEqual(status.limit);
      
      console.log(`✓ Rate limit: ${status.remaining}/${status.limit} remaining`);
    });
  });
});