import { createConnector } from '../src'

/**
 * Basic usage example for the OpenWeather connector.
 * 
 * Before running this example:
 * 1. Copy .env.example to .env
 * 2. Add your OpenWeather API key to .env
 * 3. Run: pnpm tsx examples/basic-usage.ts
 */

async function main() {
  // Create and initialize the connector
  const connector = createConnector()
  connector.init({
    apiKey: process.env.OPENWEATHER_API_KEY || '',
    units: 'metric', // Use metric units (Celsius, meters/sec)
    lang: 'en',      // English language
  })

  console.log('=== OpenWeather Connector Examples ===\n')

  // Example 1: Get current weather by city name
  console.log('1. Current weather in London:')
  const currentWeather = await connector.currentWeather.getByCity('London,UK')
  console.log(`   Temperature: ${currentWeather.main.temp}°C`)
  console.log(`   Feels like: ${currentWeather.main.feels_like}°C`)
  console.log(`   Weather: ${currentWeather.weather[0].main} - ${currentWeather.weather[0].description}`)
  console.log(`   Humidity: ${currentWeather.main.humidity}%`)
  console.log(`   Wind speed: ${currentWeather.wind.speed} m/s`)
  console.log()

  // Example 2: Get 5-day forecast
  console.log('2. 5-day forecast for New York:')
  const forecast = await connector.forecast.getByCity('New York,NY,US')
  console.log(`   Total forecasts: ${forecast.cnt}`)
  console.log(`   First forecast (${forecast.list[0].dt_txt}):`)
  console.log(`   - Temperature: ${forecast.list[0].main.temp}°C`)
  console.log(`   - Weather: ${forecast.list[0].weather[0].description}`)
  console.log()

  // Example 3: Get air pollution data by coordinates
  console.log('3. Air pollution in Paris (48.8566, 2.3522):')
  const airPollution = await connector.airPollution.getCurrent(48.8566, 2.3522)
  const aqi = airPollution.list[0].main.aqi
  const aqiLabels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor']
  console.log(`   Air Quality Index: ${aqi} (${aqiLabels[aqi - 1]})`)
  console.log(`   CO: ${airPollution.list[0].components.co} μg/m³`)
  console.log(`   PM2.5: ${airPollution.list[0].components.pm2_5} μg/m³`)
  console.log(`   PM10: ${airPollution.list[0].components.pm10} μg/m³`)
  console.log()

  // Example 4: Geocoding - forward (city name to coordinates)
  console.log('4. Geocoding - Find coordinates for Tokyo:')
  const locations = await connector.geocoding.forward('Tokyo,JP', 1)
  if (locations.length > 0) {
    console.log(`   Latitude: ${locations[0].lat}`)
    console.log(`   Longitude: ${locations[0].lon}`)
    console.log(`   Country: ${locations[0].country}`)
  }
  console.log()

  // Example 5: Reverse geocoding (coordinates to city name)
  console.log('5. Reverse geocoding - Find location at (40.7128, -74.0060):')
  const reverseLocations = await connector.geocoding.reverse(40.7128, -74.0060, 1)
  if (reverseLocations.length > 0) {
    console.log(`   City: ${reverseLocations[0].name}`)
    console.log(`   State: ${reverseLocations[0].state || 'N/A'}`)
    console.log(`   Country: ${reverseLocations[0].country}`)
  }
  console.log()

  // Example 6: Get weather by ZIP code
  console.log('6. Weather by ZIP code (10001,US):')
  const weatherByZip = await connector.currentWeather.getByZip('10001,US')
  console.log(`   Location: ${weatherByZip.name}`)
  console.log(`   Temperature: ${weatherByZip.main.temp}°C`)
  console.log(`   Weather: ${weatherByZip.weather[0].description}`)
  console.log()

  console.log('=== All examples completed successfully! ===')
}

main().catch(console.error)
