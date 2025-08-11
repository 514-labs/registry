# Testing the ADS-B Connector

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Quick Smoke Test
```bash
npm run test:quick
```
This just verifies the connector loads without errors.

### 3. Run Live API Tests
```bash
npm run test:live
```
This tests against the real ADS-B.lol API and takes about 30 seconds.

## What the Live Tests Do

The live API tests will:

1. **Basic Connectivity** - Fetch military aircraft data to verify API access
2. **Geographic Search** - Search for aircraft near LAX airport (busy airspace)
3. **Aircraft Types** - Look for common aircraft like Airbus A320s
4. **Error Handling** - Test with invalid ICAO codes
5. **Rate Limiting** - Make multiple concurrent requests to test throttling
6. **Emergency Check** - Look for aircraft squawking emergency codes (7700)
7. **Status Methods** - Verify rate limits and circuit breaker status

## Expected Output

```
🚀 Testing ADS-B Connector against live API

Basic connectivity (military aircraft)... ✅ PASS
   Found 12 military aircraft
Geographic search (LAX area)... ✅ PASS
   Found 45 aircraft near LAX
   Sample: A1B2C3 UAL123
ICAO lookup (known aircraft)... ✅ PASS
   Found 87 Airbus A320 aircraft
Error handling (invalid ICAO)... ✅ PASS
   Invalid ICAO handled gracefully
Rate limiting... ✅ PASS
   3 requests completed in 1247ms
Emergency aircraft check... ✅ PASS
   No emergency aircraft (good!)
Connector status methods... ✅ PASS
   Rate limit: 28/30
   Circuit: CLOSED, 0 failures
   Concurrency: 0/3

📊 Results: 7/7 tests passed
🎉 All tests passed! Connector is working correctly.
```

## What to Look For

### ✅ **Good Signs:**
- All tests pass (7/7)
- Aircraft data is returned for busy areas (LAX, Heathrow)
- Rate limiting adds some delay between requests
- No emergency aircraft (squawking 7700)
- Circuit breaker stays CLOSED

### ⚠️ **Normal Variations:**
- Aircraft counts vary (depends on time of day/air traffic)
- Some areas might have 0 aircraft (normal for remote locations)
- Response times vary (network conditions)
- Military aircraft count varies (many military flights are not tracked)

### ❌ **Problems to Investigate:**
- Network connection errors
- All aircraft counts are consistently 0 (API might be down)
- Tests timeout (network issues or API slowness)
- Circuit breaker opens (repeated failures)

## Troubleshooting

### Network Issues
```bash
# Test basic connectivity
curl https://api.adsb.lol/v2/mil

# Should return JSON with aircraft data
```

### Build Issues
```bash
# Clean rebuild
rm -rf dist/ node_modules/
npm install
npm run build
```

### Rate Limiting
If you get rate limited:
- Wait a few minutes between test runs
- The API has generous limits but protect against abuse
- Tests are designed to be respectful of API limits

### No Data Returned
- Aircraft data varies by time of day and location
- Early morning/late night might have fewer flights
- Remote areas naturally have fewer aircraft
- This is normal API behavior, not a bug

## Development Testing

For development work, you can also run:

```bash
# Unit tests (mocked, fast)
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

The live tests are specifically for verifying the connector works with the real API, while unit tests verify internal logic and error handling.