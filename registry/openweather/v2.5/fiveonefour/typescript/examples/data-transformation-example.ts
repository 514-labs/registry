// OpenWeather Data Transformation Example
// Demonstrates secure validation and transformation patterns

import { WeatherDataTransformer } from '../src/data-transformer';
import { ConnectorError, ErrorCode } from '../src/connector-types';

// Example raw OpenWeather v2.5 response
const rawCurrentWeatherResponse = {
  coord: { lat: 40.7128, lon: -74.006 },
  weather: [
    {
      id: 800,
      main: "Clear",
      description: "clear sky",
      icon: "01d"
    }
  ],
  base: "stations",
  main: {
    temp: 22.5,
    feels_like: 21.8,
    temp_min: 20.1,
    temp_max: 24.3,
    pressure: 1013,
    humidity: 65
  },
  visibility: 10000,
  wind: {
    speed: 3.6,
    deg: 180,
    gust: 5.2
  },
  clouds: { all: 20 },
  dt: 1700000000,
  sys: {
    type: 2,
    id: 2039034,
    country: "US",
    sunrise: 1699999200,
    sunset: 1700035200
  },
  timezone: -18000,
  id: 5128581,
  name: "New York",
  cod: 200
};

// Example: Transform raw data to normalized format
async function demonstrateTransformation() {
  console.log('🔄 OpenWeather Data Transformation Example');
  console.log('==========================================\n');

  try {
    // 1. Transform current weather data
    console.log('1. Transforming current weather data...');
    const normalizedWeather = WeatherDataTransformer.transformCurrentWeather(rawCurrentWeatherResponse);
    
    console.log('✅ Transformation successful!');
    console.log('📍 Location:', normalizedWeather.location);
    console.log('🌡️ Temperature:', normalizedWeather.current.temperature, '°C');
    console.log('💨 Wind:', normalizedWeather.current.wind);
    console.log('☀️ Weather:', normalizedWeather.current.weather[0]);
    console.log('');

    // 2. Validate coordinates
    console.log('2. Validating geographic coordinates...');
    WeatherDataTransformer.validateCoordinates(40.7128, -74.006, 'NYC coordinates');
    console.log('✅ Valid coordinates: 40.7128, -74.006');
    
    // Try invalid coordinates
    try {
      WeatherDataTransformer.validateCoordinates(91, -200, 'invalid coordinates');
    } catch (error) {
      if (error instanceof ConnectorError) {
        console.log('❌ Caught validation error:', error.message);
        console.log('   Error code:', error.code);
      }
    }
    console.log('');

    // 3. Safe number parsing
    console.log('3. Demonstrating safe number parsing...');
    const temperature = WeatherDataTransformer.safeParseNumber('22.5', 'temperature', -50, 60);
    console.log('✅ Parsed temperature:', temperature, '°C');
    
    const humidity = WeatherDataTransformer.safeParseNumber('65', 'humidity', 0, 100);
    console.log('✅ Parsed humidity:', humidity, '%');
    
    // Try invalid number
    try {
      WeatherDataTransformer.safeParseNumber('invalid', 'test_field');
    } catch (error) {
      if (error instanceof ConnectorError) {
        console.log('❌ Caught parsing error:', error.message);
      }
    }
    console.log('');

    // 4. Security validation patterns
    console.log('4. Security-conscious validation examples...');
    
    // These use simple string checks instead of regex to avoid ReDoS
    console.log('✅ Email validation uses simple checks (no ReDoS risk)');
    console.log('✅ URL validation uses built-in URL constructor');
    console.log('✅ Datetime validation uses Date constructor + format checks');
    console.log('');

    // 5. Data serialization
    console.log('5. Serializing data for API responses...');
    const serialized = WeatherDataTransformer.serialize(normalizedWeather);
    console.log('✅ Serialized data ready for API response');
    console.log('   Keys:', Object.keys(serialized));
    console.log('');

  } catch (error) {
    console.error('❌ Transformation failed:', error);
    
    if (error instanceof ConnectorError) {
      console.log('Error details:');
      console.log('- Code:', error.code);
      console.log('- Source:', error.source);
      console.log('- Details:', error.details);
    }
  }
}

// Example: Validate transformation pipeline
async function validateTransformationPipeline() {
  console.log('🧪 Testing Transformation Pipeline');
  console.log('==================================\n');

  const testCases = [
    {
      name: 'Valid current weather',
      data: rawCurrentWeatherResponse,
      shouldPass: true
    },
    {
      name: 'Missing required field',
      data: { ...rawCurrentWeatherResponse, coord: undefined },
      shouldPass: false
    },
    {
      name: 'Invalid latitude',
      data: { 
        ...rawCurrentWeatherResponse, 
        coord: { lat: 91, lon: -74.006 } 
      },
      shouldPass: false
    },
    {
      name: 'Invalid humidity',
      data: { 
        ...rawCurrentWeatherResponse, 
        main: { ...rawCurrentWeatherResponse.main, humidity: 150 } 
      },
      shouldPass: false
    }
  ];

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    
    try {
      const result = WeatherDataTransformer.transformCurrentWeather(testCase.data);
      
      if (testCase.shouldPass) {
        console.log('✅ Passed as expected');
      } else {
        console.log('❌ Should have failed but passed');
      }
    } catch (error) {
      if (!testCase.shouldPass) {
        console.log('✅ Failed as expected:', error instanceof ConnectorError ? error.message : 'Unknown error');
      } else {
        console.log('❌ Unexpected failure:', error instanceof ConnectorError ? error.message : 'Unknown error');
      }
    }
    console.log('');
  }
}

// Run examples
if (require.main === module) {
  demonstrateTransformation()
    .then(() => validateTransformationPipeline())
    .then(() => {
      console.log('🎉 Data transformation examples completed!');
      console.log('\nKey benefits:');
      console.log('- ✅ Schema-based validation with detailed error paths');
      console.log('- ✅ Security-conscious validation (no ReDoS vulnerabilities)');
      console.log('- ✅ Type-safe transformations with error handling');
      console.log('- ✅ Consistent normalized data across weather APIs');
      console.log('- ✅ Production-ready error reporting with context');
    })
    .catch(console.error);
}

export { demonstrateTransformation, validateTransformationPipeline };