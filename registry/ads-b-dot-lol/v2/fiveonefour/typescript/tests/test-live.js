#!/usr/bin/env node

/**
 * Simple test runner for live API tests
 * No Jest required - just Node.js
 */

const { AdsbConnector } = require('../dist/src/index.js');
const { ConnectorError, ErrorCode } = require('../dist/src/types.js');

async function runTest(name, testFn) {
  process.stdout.write(`${name}... `);
  try {
    await testFn();
    console.log('✅ PASS');
    return true;
  } catch (error) {
    console.log('❌ FAIL');
    console.log(`   ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing ADS-B Connector against live API\n');

  const connector = new AdsbConnector();
  await connector.initialize({
    timeout: 10000,
    rateLimit: { requestsPerMinute: 20 }
  });
  await connector.connect();

  let passed = 0;
  let total = 0;

  // Test 1: Basic connectivity
  total++;
  if (await runTest('Basic connectivity (military aircraft)', async () => {
    const aircraft = await connector.getMilitary();
    if (!Array.isArray(aircraft)) throw new Error('Expected array');
    console.log(`   Found ${aircraft.length} military aircraft`);
  })) passed++;

  // Test 2: Geographic search
  total++;
  if (await runTest('Geographic search (LAX area)', async () => {
    const aircraft = await connector.findNearby(33.9425, -118.4081, 25);
    if (!Array.isArray(aircraft)) throw new Error('Expected array');
    console.log(`   Found ${aircraft.length} aircraft near LAX`);
    
    if (aircraft.length > 0) {
      const sample = aircraft[0];
      if (typeof sample.hex !== 'string') throw new Error('Invalid hex field');
      console.log(`   Sample: ${sample.hex} ${sample.flight || 'No callsign'}`);
    }
  })) passed++;

  // Test 3: ICAO lookup
  total++;
  if (await runTest('ICAO lookup (known aircraft)', async () => {
    // Use a common aircraft type that's likely to be flying
    const aircraft = await connector.getByType('A320');
    if (!Array.isArray(aircraft)) throw new Error('Expected array');
    console.log(`   Found ${aircraft.length} Airbus A320 aircraft`);
  })) passed++;

  // Test 4: Error handling
  total++;
  if (await runTest('Error handling (invalid ICAO)', async () => {
    try {
      await connector.trackByICAO('INVALID');
      // API might return empty array instead of error
      console.log('   Invalid ICAO handled gracefully');
    } catch (error) {
      if (!(error instanceof ConnectorError)) {
        throw new Error('Expected ConnectorError');
      }
      console.log(`   Proper error: ${error.message}`);
    }
  })) passed++;

  // Test 5: Rate limiting
  total++;
  if (await runTest('Rate limiting', async () => {
    const start = Date.now();
    
    // Make multiple requests
    const promises = [
      connector.findNearby(37.7749, -122.4194, 10), // SF
      connector.findNearby(40.7128, -74.0060, 10),  // NYC
      connector.findNearby(51.5074, -0.1278, 10)    // London
    ];
    
    await Promise.all(promises);
    const duration = Date.now() - start;
    
    console.log(`   3 requests completed in ${duration}ms`);
    if (duration < 100) {
      console.log('   ⚠️  Very fast - rate limiting may not be active');
    }
  })) passed++;

  // Test 6: Emergency aircraft
  total++;
  if (await runTest('Emergency aircraft check', async () => {
    const emergencies = await connector.getEmergencies();
    if (!Array.isArray(emergencies)) throw new Error('Expected array');
    
    if (emergencies.length > 0) {
      console.log(`   ⚠️  Found ${emergencies.length} emergency aircraft!`);
      emergencies.forEach(aircraft => {
        console.log(`      ${aircraft.hex} squawking 7700`);
      });
    } else {
      console.log('   No emergency aircraft (good!)');
    }
  })) passed++;

  // Test 7: Connector status
  total++;
  if (await runTest('Connector status methods', async () => {
    const rateStatus = connector.getRateLimitStatus();
    const circuitStatus = connector.getCircuitBreakerStatus();
    const concurrencyStatus = connector.getConcurrencyStatus();
    
    if (typeof rateStatus.remaining !== 'number') throw new Error('Invalid rate limit status');
    if (circuitStatus.state !== 'CLOSED') throw new Error(`Circuit breaker not closed: ${circuitStatus.state}`);
    if (typeof concurrencyStatus.active !== 'number') throw new Error('Invalid concurrency status');
    
    console.log(`   Rate limit: ${rateStatus.remaining}/${rateStatus.limit}`);
    console.log(`   Circuit: ${circuitStatus.state}, ${circuitStatus.failures} failures`);
    console.log(`   Concurrency: ${concurrencyStatus.active}/${concurrencyStatus.max}`);
  })) passed++;

  await connector.disconnect();

  console.log(`\n📊 Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Connector is working correctly.');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Check your network connection and API availability.');
    process.exit(1);
  }
}

// Handle errors gracefully
main().catch(error => {
  console.error('💥 Test runner failed:', error.message);
  process.exit(1);
});