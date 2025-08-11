#!/usr/bin/env node

/**
 * Simple unit tests without Jest
 */

const { AdsbConnector } = require('../dist/src/index.js');
const { ConnectorError, ErrorCode } = require('../dist/src/types.js');

let tests = 0;
let passed = 0;

function test(name, fn) {
  tests++;
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
  }
}

console.log('🧪 Running Simple Unit Tests\n');

// Test 1: Connector instantiation
test('Connector can be instantiated', () => {
  const connector = new AdsbConnector();
  if (!connector) throw new Error('Failed to create connector');
  if (typeof connector.initialize !== 'function') throw new Error('Missing initialize method');
});

// Test 2: Error classes
test('ConnectorError works correctly', () => {
  const error = new ConnectorError('test message', ErrorCode.NETWORK_ERROR, {
    retryable: true,
    requestId: 'test-123'
  });
  
  if (error.message !== 'test message') throw new Error('Wrong message');
  if (error.code !== ErrorCode.NETWORK_ERROR) throw new Error('Wrong error code');
  if (!error.retryable) throw new Error('Wrong retryable flag');
  if (error.requestId !== 'test-123') throw new Error('Wrong request ID');
});

// Test 3: Configuration initialization
test('Configuration can be initialized', async () => {
  const connector = new AdsbConnector();
  await connector.initialize({
    timeout: 5000,
    rateLimit: { requestsPerMinute: 100 }
  });
  
  // Should not throw
  if (!connector.isConnected || typeof connector.isConnected !== 'function') {
    throw new Error('isConnected method missing');
  }
});

// Test 4: Connection lifecycle
test('Connection lifecycle works', async () => {
  const connector = new AdsbConnector();
  await connector.initialize();
  
  if (connector.isConnected()) throw new Error('Should not be connected initially');
  
  await connector.connect();
  if (!connector.isConnected()) throw new Error('Should be connected after connect()');
  
  await connector.disconnect();
  if (connector.isConnected()) throw new Error('Should not be connected after disconnect()');
});

// Test 5: Unsupported operations throw errors
test('Unsupported operations throw correct errors', () => {
  const connector = new AdsbConnector();
  
  try {
    connector.post();
    throw new Error('Should have thrown for POST');
  } catch (error) {
    if (!(error instanceof ConnectorError)) throw new Error('Wrong error type');
    if (error.code !== ErrorCode.UNSUPPORTED) throw new Error('Wrong error code');
  }
  
  try {
    connector.put();
    throw new Error('Should have thrown for PUT');
  } catch (error) {
    if (!(error instanceof ConnectorError)) throw new Error('Wrong error type');
    if (error.code !== ErrorCode.UNSUPPORTED) throw new Error('Wrong error code');
  }
});

// Test 6: Status methods work
test('Status methods return valid data', async () => {
  const connector = new AdsbConnector();
  await connector.initialize();
  
  const rateStatus = connector.getRateLimitStatus();
  if (typeof rateStatus.limit !== 'number') throw new Error('Invalid rate limit status');
  
  const circuitStatus = connector.getCircuitBreakerStatus();
  if (typeof circuitStatus.state !== 'string') throw new Error('Invalid circuit status');
  
  const concurrencyStatus = connector.getConcurrencyStatus();
  if (typeof concurrencyStatus.active !== 'number') throw new Error('Invalid concurrency status');
});

// Test 7: Data transformation methods exist
test('Data transformation methods exist', () => {
  const connector = new AdsbConnector();
  
  if (typeof connector.validate !== 'function') throw new Error('Missing validate method');
  if (typeof connector.serialize !== 'function') throw new Error('Missing serialize method');  
  if (typeof connector.deserialize !== 'function') throw new Error('Missing deserialize method');
});

// Test 8: Request without connection throws error
test('Request without connection throws error', async () => {
  const connector = new AdsbConnector();
  await connector.initialize();
  // Don't connect
  
  try {
    await connector.trackByICAO('A12345');
    throw new Error('Should have thrown error for disconnected state');
  } catch (error) {
    if (!(error instanceof ConnectorError)) throw new Error('Wrong error type');
    if (error.code !== ErrorCode.INVALID_REQUEST) throw new Error('Wrong error code');
  }
});

console.log(`\n📊 Unit Tests: ${passed}/${tests} passed`);

if (passed === tests) {
  console.log('🎉 All unit tests passed!');
} else {
  console.log('⚠️  Some unit tests failed');
  process.exit(1);
}