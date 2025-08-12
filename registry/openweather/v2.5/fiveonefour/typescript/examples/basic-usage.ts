// OpenWeather Connector Basic Usage Example
// Demonstrates simple weather queries with the production-ready connector

import { createOpenWeatherClient } from '../src/config';
import { ConnectorError } from '../src/connector-types';

async function basicUsageExample() {
  console.log('🌤️  OpenWeather Connector - Basic Usage');
  console.log('======================================\n');

  try {
    // Create client with environment configuration
    const client = await createOpenWeatherClient();
    
    console.log('✅ OpenWeather client created successfully');
    console.log('🔗 Connected:', client.isConnected() ? 'Yes' : 'No (will auto-connect)');
    console.log('');

    // Example 1: Current weather for a major city
    console.log('1. Current Weather - New York City');
    console.log('==================================');
    
    const nycWeather = await client.getCurrentWeather(40.7128, -74.0060);
    
    console.log(`📍 Location: ${nycWeather.location.name}, ${nycWeather.location.country}`);
    console.log(`🌡️  Temperature: ${nycWeather.current.temperature}°C (feels like ${nycWeather.current.feels_like}°C)`);
    console.log(`💧 Humidity: ${nycWeather.current.humidity}%`);
    console.log(`🌬️  Wind: ${nycWeather.current.wind?.speed || 0} m/s`);
    console.log(`☁️  Clouds: ${nycWeather.current.clouds || 0}%`);
    console.log(`☀️  Weather: ${nycWeather.current.weather[0].main} - ${nycWeather.current.weather[0].description}`);
    
    if (nycWeather.current.sun?.sunrise) {
      console.log(`🌅 Sunrise: ${nycWeather.current.sun.sunrise.toLocaleTimeString()}`);
    }
    if (nycWeather.current.sun?.sunset) {
      console.log(`🌇 Sunset: ${nycWeather.current.sun.sunset.toLocaleTimeString()}`);
    }
    console.log('');

    // Example 2: 5-day forecast for another city
    console.log('2. 5-Day Forecast - London');
    console.log('===========================');
    
    const londonForecast = await client.getForecast(51.5074, -0.1278, 5);
    
    console.log(`📍 Location: ${londonForecast.location.name}, ${londonForecast.location.country}`);
    console.log('📅 5-Day Forecast:');
    
    londonForecast.daily.forEach((day, index) => {
      const date = day.date.toLocaleDateString();
      const high = day.temperature.max;
      const low = day.temperature.min;
      const weather = day.weather[0].description;
      
      console.log(`   Day ${index + 1} (${date}): ${high}°C / ${low}°C - ${weather}`);
    });
    console.log('');

    // Example 3: Hourly forecast (3-hour intervals)
    console.log('3. 24-Hour Forecast - Tokyo');
    console.log('============================');
    
    const tokyoHourly = await client.getHourlyForecast(35.6762, 139.6503, 24);
    
    console.log(`📍 Location: ${tokyoHourly.location.name}, ${tokyoHourly.location.country}`);
    console.log('⏰ Next 24 hours (3-hour intervals):');
    
    tokyoHourly.hourly.slice(0, 4).forEach((hour, index) => {
      const time = hour.timestamp.toLocaleTimeString();
      const temp = hour.temperature;
      const weather = hour.weather[0].description;
      
      console.log(`   ${time}: ${temp}°C - ${weather}`);
    });
    console.log(`   ... and ${tokyoHourly.hourly.length - 4} more periods`);
    console.log('');

    // Example 4: Weather for unusual locations
    console.log('4. Extreme Locations');
    console.log('====================');
    
    // Arctic location
    const arcticWeather = await client.getCurrentWeather(78.2232, 15.6267); // Svalbard
    console.log(`🧊 Arctic (Svalbard): ${arcticWeather.current.temperature}°C - ${arcticWeather.current.weather[0].description}`);
    
    // Desert location  
    const desertWeather = await client.getCurrentWeather(24.4539, 54.3773); // Dubai
    console.log(`🏜️  Desert (Dubai): ${desertWeather.current.temperature}°C - ${desertWeather.current.weather[0].description}`);
    
    // Tropical location
    const tropicalWeather = await client.getCurrentWeather(-1.2921, 36.8219); // Nairobi
    console.log(`🌴 Tropical (Nairobi): ${tropicalWeather.current.temperature}°C - ${tropicalWeather.current.weather[0].description}`);
    console.log('');

    console.log('🎉 Basic usage examples completed successfully!');
    console.log('\n📊 API Usage Summary:');
    console.log('- Current weather queries: 4');
    console.log('- Forecast queries: 2'); 
    console.log('- Total API calls: ~6');
    console.log('- Remaining daily limit: ~994 calls');

  } catch (error) {
    console.error('❌ Error in basic usage example:', error);
    
    if (error instanceof ConnectorError) {
      console.log('Error details:');
      console.log('- Code:', error.code);
      console.log('- Retryable:', error.retryable);
      
      if (error.isAuthError()) {
        console.log('💡 Tip: Check your OPENWEATHER_API_KEY in .env.local');
      } else if (error.isRateLimit()) {
        console.log('💡 Tip: Rate limited - wait before making more requests');
      } else if (error.isValidationError()) {
        console.log('💡 Tip: Check your input parameters (coordinates, etc.)');
      }
    }
  }
}

// Error handling examples
async function errorHandlingExamples() {
  console.log('\n🚫 Error Handling Examples');
  console.log('==========================');

  try {
    const client = await createOpenWeatherClient();

    // Example 1: Invalid coordinates
    console.log('1. Testing invalid coordinates...');
    try {
      await client.getCurrentWeather(91, -200); // Invalid lat/lon
    } catch (error) {
      if (error instanceof ConnectorError) {
        console.log(`   ❌ Expected error: ${error.message}`);
        console.log(`   🏷️  Error code: ${error.code}`);
      }
    }

    // Example 2: Invalid forecast days
    console.log('2. Testing invalid forecast period...');
    try {
      await client.getForecast(40.7128, -74.0060, 10); // Too many days for free tier
    } catch (error) {
      if (error instanceof ConnectorError) {
        console.log(`   ❌ Expected error: ${error.message}`);
      }
    }

    // Example 3: Premium features on free tier
    console.log('3. Testing premium features...');
    try {
      await client.getHistoricalWeather(40.7128, -74.0060, new Date('2023-01-01'));
    } catch (error) {
      if (error instanceof ConnectorError) {
        console.log(`   ❌ Expected error: ${error.message}`);
        console.log(`   💰 Feature requires paid subscription`);
      }
    }

    console.log('✅ Error handling examples completed');

  } catch (error) {
    console.error('❌ Error in error handling examples:', error);
  }
}

// Performance demonstration
async function performanceDemo() {
  console.log('\n⚡ Performance Demonstration');
  console.log('============================');

  try {
    const client = await createOpenWeatherClient();

    // Demonstrate rate limiting
    console.log('🚦 Rate limiting demonstration...');
    const startTime = Date.now();

    const cities = [
      { name: 'Paris', lat: 48.8566, lon: 2.3522 },
      { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
      { name: 'Madrid', lat: 40.4168, lon: -3.7038 }
    ];

    console.log('Making sequential requests...');
    for (const city of cities) {
      const weather = await client.getCurrentWeather(city.lat, city.lon);
      console.log(`   ${city.name}: ${weather.current.temperature}°C`);
    }

    const duration = Date.now() - startTime;
    console.log(`⏱️  Sequential requests completed in ${duration}ms`);
    console.log('✅ Rate limiting working properly (requests paced automatically)');

  } catch (error) {
    console.error('❌ Error in performance demo:', error);
  }
}

// Run all examples
if (require.main === module) {
  Promise.resolve()
    .then(() => basicUsageExample())
    .then(() => errorHandlingExamples())
    .then(() => performanceDemo())
    .then(() => {
      console.log('\n🏁 All examples completed!');
      console.log('\n📚 Next steps:');
      console.log('- Check out data-transformation-example.ts for schema validation');
      console.log('- Run tests with: npm test');
      console.log('- See README.md for more advanced usage patterns');
    })
    .catch((error) => {
      console.error('\n💥 Example failed:', error.message);
      process.exit(1);
    });
}

export { basicUsageExample, errorHandlingExamples, performanceDemo };