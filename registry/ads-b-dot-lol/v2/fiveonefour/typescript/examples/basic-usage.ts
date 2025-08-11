import { AdsbConnector } from '../src';

async function basicExample() {
  // Create and initialize connector
  const connector = new AdsbConnector();
  await connector.initialize({
    timeout: 10000,
    rateLimit: {
      requestsPerMinute: 200
    }
  });
  
  // Connect to start using
  await connector.connect();
  
  try {
    // Track specific aircraft by ICAO hex code
    const aircraft = await connector.trackByICAO('A12345');
    console.log(`Found ${aircraft.length} aircraft with ICAO A12345`);
    
    // Find aircraft near LAX airport (within 50km)
    const nearLAX = await connector.findNearby(33.9425, -118.4081, 50);
    console.log(`${nearLAX.length} aircraft near LAX`);
    
    // Get military aircraft
    const military = await connector.getMilitary();
    console.log(`${military.length} military aircraft detected`);
    
    // Display sample aircraft data
    if (nearLAX.length > 0) {
      const sample = nearLAX[0];
      console.log(`Sample aircraft: ${sample.flight || sample.hex}`);
      console.log(`  Altitude: ${sample.alt_baro}ft`);
      console.log(`  Speed: ${sample.gs}kts`);
      console.log(`  Position: ${sample.lat}, ${sample.lon}`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Clean up
    await connector.disconnect();
  }
}

// Error handling example
async function errorHandlingExample() {
  const connector = new AdsbConnector();
  await connector.initialize();
  await connector.connect();
  
  try {
    // This will likely fail - invalid ICAO
    await connector.trackByICAO('INVALID');
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      console.log('Network issue, retrying...');
    } else if (error.code === 'VALIDATION_ERROR') {
      console.log('Invalid input provided');
    } else {
      console.log(`Unexpected error: ${error.message}`);
    }
  }
  
  await connector.disconnect();
}

// Run examples
if (require.main === module) {
  basicExample().catch(console.error);
}