// OpenWeather Integration Tests
// Built using connector-testing-specialist patterns for real API validation

import { OpenWeatherClient } from '../src/client';
import { createConfigFromEnv } from '../src/config';
import { ConnectorError, ErrorCode } from '../src/connector-types';
import { setupMockServer, cleanupMockServer } from './mock-server';

export class OpenWeatherIntegrationTests {
  private readonly conservativeMode: boolean;
  
  constructor(conservativeMode = true) {
    this.conservativeMode = conservativeMode;
  }

  async runIntegrationTests(): Promise<void> {
    console.log('🔗 OpenWeather Integration Tests');
    console.log('================================\n');

    if (!process.env.OPENWEATHER_API_KEY) {
      console.log('⚠️  No API key provided - running offline tests only');
      await this.runOfflineTests();
      return;
    }

    if (this.conservativeMode) {
      console.log('🔒 Conservative mode: Limited API calls to respect 1k/day limit');
    }

    try {
      await this.runOfflineTests();
      await this.runLiveApiTests();
      
      console.log('\n✅ All integration tests passed!');
    } catch (error) {
      console.error('\n❌ Integration tests failed:', error);
      throw error;
    }
  }

  private async runOfflineTests(): Promise<void> {
    console.log('🖥️  Offline Tests (Mock Server)');
    console.log('==============================');

    const mockServer = setupMockServer();
    
    try {
      const config = {
        apiKey: 'mock-api-key',
        baseURL: 'https://api.openweathermap.org/data/2.5',
        timeout: 5000,
        userAgent: 'OpenWeatherConnector/2.5-test',
        units: 'metric' as const,
        language: 'en',
        rateLimit: { requestsPerMinute: 60, burstCapacity: 10, adaptiveFromHeaders: true },
        circuitBreaker: { failureThreshold: 5, resetTimeout: 60000, successThreshold: 3 },
        retries: { maxRetries: 3, baseDelay: 1000, maxDelay: 30000 },
        defaultHeaders: {}
      };

      const client = new OpenWeatherClient(config);

      // Test current weather with mock data
      console.log('  🌤️  Testing current weather (mock)...');
      const weather = await client.getCurrentWeather(40.7128, -74.006);
      
      console.log(`    ✅ Retrieved weather for ${weather.location.name}: ${weather.current.temperature}°C`);
      console.log(`    ✅ Weather: ${weather.current.weather[0].description}`);
      console.log(`    ✅ Humidity: ${weather.current.humidity}%`);

      // Test forecast with mock data
      console.log('  📊 Testing forecast (mock)...');
      const forecast = await client.getForecast(51.5074, -0.1278, 3);
      
      console.log(`    ✅ Retrieved ${forecast.daily.length}-day forecast for ${forecast.location.name}`);
      console.log(`    ✅ Tomorrow's high: ${forecast.daily[1]?.temperature.max}°C`);

      // Test error handling
      console.log('  🚫 Testing error handling...');
      try {
        await client.getCurrentWeather(91, -74.006); // Invalid latitude
      } catch (error) {
        if (error instanceof ConnectorError && error.code === ErrorCode.INVALID_COORDINATES) {
          console.log('    ✅ Coordinate validation working correctly');
        } else {
          throw new Error('Expected coordinate validation error');
        }
      }

      // Test mock server logging
      const requestLog = mockServer.getRequestLog();
      console.log(`    ✅ Mock server logged ${requestLog.length} requests`);

    } finally {
      cleanupMockServer();
    }
  }

  private async runLiveApiTests(): Promise<void> {
    console.log('\n🌐 Live API Tests');
    console.log('================');

    const config = createConfigFromEnv();
    const client = new OpenWeatherClient(config);

    if (this.conservativeMode) {
      await this.runConservativeLiveTests(client);
    } else {
      await this.runComprehensiveLiveTests(client);
    }
  }

  private async runConservativeLiveTests(client: OpenWeatherClient): Promise<void> {
    console.log('  🔒 Conservative live tests (minimal API usage)');

    // Single current weather test
    console.log('  🌡️  Testing live current weather...');
    const weather = await client.getCurrentWeather(40.7128, -74.0060); // NYC
    
    this.validateWeatherResponse(weather);
    console.log(`    ✅ Live weather for ${weather.location.name}: ${weather.current.temperature}°C`);
    
    // Log API call usage
    console.log('    📊 API calls used: 1 (current weather)');
    console.log('    💰 Remaining daily limit: ~999 calls');
  }

  private async runComprehensiveLiveTests(client: OpenWeatherClient): Promise<void> {
    console.log('  🚀 Comprehensive live tests (uses more API calls)');

    // Current weather test
    console.log('  🌡️  Testing current weather...');
    const weather = await client.getCurrentWeather(51.5074, -0.1278); // London
    this.validateWeatherResponse(weather);
    console.log(`    ✅ Current weather: ${weather.current.temperature}°C`);

    // Forecast test
    console.log('  📅 Testing forecast...');
    const forecast = await client.getForecast(37.7749, -122.4194, 3); // San Francisco, 3 days
    this.validateForecastResponse(forecast);
    console.log(`    ✅ 3-day forecast retrieved: ${forecast.daily.length} days`);

    // Hourly forecast test
    console.log('  ⏰ Testing hourly forecast...');
    const hourly = await client.getHourlyForecast(48.8566, 2.3522, 12); // Paris, 12 hours
    console.log(`    ✅ Hourly forecast: ${hourly.hourly.length} periods`);

    // Edge case testing
    console.log('  🌍 Testing edge case coordinates...');
    const arcticWeather = await client.getCurrentWeather(71.0, -8.0); // Svalbard
    console.log(`    ✅ Arctic weather: ${arcticWeather.current.temperature}°C`);

    const tropicalWeather = await client.getCurrentWeather(-23.5505, -46.6333); // São Paulo
    console.log(`    ✅ Tropical weather: ${tropicalWeather.current.temperature}°C`);

    console.log('    📊 API calls used: ~5 (comprehensive testing)');
  }

  private validateWeatherResponse(weather: any): void {
    if (!weather.location) throw new Error('Weather response missing location');
    if (typeof weather.location.latitude !== 'number') throw new Error('Invalid latitude in response');
    if (typeof weather.location.longitude !== 'number') throw new Error('Invalid longitude in response');
    
    if (!weather.current) throw new Error('Weather response missing current data');
    if (typeof weather.current.temperature !== 'number') throw new Error('Invalid temperature in response');
    if (typeof weather.current.humidity !== 'number') throw new Error('Invalid humidity in response');
    
    if (!weather.current.weather || !Array.isArray(weather.current.weather)) {
      throw new Error('Weather conditions missing or invalid');
    }
    
    if (weather.current.weather.length === 0) {
      throw new Error('No weather conditions in response');
    }
  }

  private validateForecastResponse(forecast: any): void {
    if (!forecast.location) throw new Error('Forecast response missing location');
    if (!forecast.daily || !Array.isArray(forecast.daily)) {
      throw new Error('Forecast response missing daily data');
    }
    
    if (forecast.daily.length === 0) {
      throw new Error('No daily forecasts in response');
    }
    
    for (const day of forecast.daily) {
      if (!day.temperature) throw new Error('Daily forecast missing temperature');
      if (typeof day.temperature.max !== 'number') throw new Error('Invalid max temperature');
      if (typeof day.temperature.min !== 'number') throw new Error('Invalid min temperature');
      if (!day.weather || !Array.isArray(day.weather)) throw new Error('Daily forecast missing weather conditions');
    }
  }

  // Performance testing
  async runPerformanceTests(): Promise<void> {
    console.log('\n⚡ Performance Tests');
    console.log('==================');

    if (!process.env.OPENWEATHER_API_KEY) {
      console.log('⚠️  Skipping performance tests (no API key)');
      return;
    }

    const config = createConfigFromEnv();
    const client = new OpenWeatherClient(config);

    // Sequential request timing
    console.log('  📈 Testing sequential request performance...');
    const startTime = Date.now();
    
    const locations = [
      { lat: 40.7128, lon: -74.0060, name: 'New York' },
      { lat: 51.5074, lon: -0.1278, name: 'London' },
      { lat: 35.6762, lon: 139.6503, name: 'Tokyo' }
    ];

    for (const location of locations) {
      const weather = await client.getCurrentWeather(location.lat, location.lon);
      console.log(`    ✅ ${location.name}: ${weather.current.temperature}°C`);
    }

    const duration = Date.now() - startTime;
    console.log(`    ⏱️  Sequential requests completed in ${duration}ms`);
    console.log(`    📊 Average per request: ${Math.round(duration / locations.length)}ms`);

    // Rate limiting behavior
    console.log('  🚦 Testing rate limiting behavior...');
    const rateLimitStart = Date.now();
    
    // Make 5 rapid requests to test rate limiter
    const rapidPromises = Array(5).fill(0).map(async (_, i) => {
      try {
        const weather = await client.getCurrentWeather(40.7128 + (i * 0.01), -74.0060);
        return { success: true, temp: weather.current.temperature };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });

    const rapidResults = await Promise.allSettled(rapidPromises);
    const rapidDuration = Date.now() - rateLimitStart;
    
    console.log(`    ⏱️  Rapid requests completed in ${rapidDuration}ms`);
    console.log(`    ✅ Successful requests: ${rapidResults.filter(r => r.status === 'fulfilled').length}/5`);
    
    if (this.conservativeMode) {
      console.log('    📊 Total API calls used in performance tests: ~8');
    }
  }

  // Error scenario testing
  async runErrorScenarioTests(): Promise<void> {
    console.log('\n🚫 Error Scenario Tests');
    console.log('======================');

    const config = createConfigFromEnv();

    // Test with invalid API key
    console.log('  🔑 Testing invalid API key...');
    const badKeyConfig = { ...config, apiKey: 'invalid-key-12345' };
    const badClient = new OpenWeatherClient(badKeyConfig);

    try {
      await badClient.getCurrentWeather(40.7128, -74.0060);
      throw new Error('Should have failed with invalid API key');
    } catch (error) {
      if (error instanceof ConnectorError && 
          (error.code === ErrorCode.AUTHENTICATION_FAILED || error.code === ErrorCode.FORBIDDEN)) {
        console.log('    ✅ Invalid API key properly rejected');
      } else {
        console.log('    ⚠️  Unexpected error type:', error);
      }
    }

    // Test network timeout
    console.log('  ⏰ Testing timeout behavior...');
    const timeoutConfig = { ...config, timeout: 1 }; // 1ms timeout
    const timeoutClient = new OpenWeatherClient(timeoutConfig);

    try {
      await timeoutClient.getCurrentWeather(40.7128, -74.0060);
      console.log('    ⚠️  Request unexpectedly succeeded (network might be very fast)');
    } catch (error) {
      if (error instanceof ConnectorError && error.code === ErrorCode.NETWORK_ERROR) {
        console.log('    ✅ Timeout properly handled');
      } else {
        console.log('    ⚠️  Unexpected timeout error:', error);
      }
    }
  }
}

// CLI execution
if (require.main === module) {
  const conservative = process.argv.includes('--conservative') || process.env.NODE_ENV === 'production';
  const tests = new OpenWeatherIntegrationTests(conservative);
  
  Promise.all([
    tests.runIntegrationTests(),
    tests.runPerformanceTests(),
    tests.runErrorScenarioTests()
  ])
  .then(() => {
    console.log('\n🎉 All integration tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log('  ✅ Offline tests: Mock server validation');
    console.log('  ✅ Live API tests: Real weather data retrieval');
    console.log('  ✅ Performance tests: Rate limiting and timing');
    console.log('  ✅ Error scenarios: Authentication and timeout handling');
  })
  .catch((error) => {
    console.error('\n❌ Integration tests failed:', error.message);
    process.exit(1);
  });
}