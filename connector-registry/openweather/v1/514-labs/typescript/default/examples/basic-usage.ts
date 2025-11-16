/**
 * OpenWeather Connector - Basic Usage Example
 * 
 * This example demonstrates how to use the OpenWeather connector to:
 * - Get current weather data
 * - Get weather forecasts
 * - Get air pollution data
 * - Use geocoding services
 */

import { createConnector } from '../src'

async function main() {
  // Initialize the connector with your API key
  const connector = createConnector()
  connector.init({
    apiKey: process.env.OPENWEATHER_API_KEY || 'your-api-key-here',
    units: 'metric', // Use Celsius
    lang: 'en'
  })

  console.log('=== OpenWeather Connector Example ===\n')

  try {
    // 1. Get current weather by city name
    console.log('1. Current weather in London:')
    const londonWeather = await connector.currentWeather.getByCity('London', 'uk')
    console.log(`   Temperature: ${londonWeather.main.temp}°C`)
    console.log(`   Feels like: ${londonWeather.main.feels_like}°C`)
    console.log(`   Description: ${londonWeather.weather[0].description}`)
    console.log(`   Humidity: ${londonWeather.main.humidity}%`)
    console.log(`   Wind: ${londonWeather.wind.speed} m/s\n`)

    // 2. Get current weather by coordinates
    console.log('2. Current weather by coordinates (Paris):')
    const parisWeather = await connector.currentWeather.getByCoordinates(48.8566, 2.3522)
    console.log(`   City: ${parisWeather.name}`)
    console.log(`   Temperature: ${parisWeather.main.temp}°C`)
    console.log(`   Conditions: ${parisWeather.weather[0].main}\n`)

    // 3. Get 5-day forecast
    console.log('3. 5-day forecast for New York:')
    const forecast = await connector.forecast.getByCity('New York', 'us')
    console.log(`   Location: ${forecast.city.name}, ${forecast.city.country}`)
    console.log(`   Number of forecasts: ${forecast.list.length}`)
    console.log(`   First forecast time: ${forecast.list[0].dt_txt}`)
    console.log(`   First forecast temp: ${forecast.list[0].main.temp}°C\n`)

    // 4. Get air pollution data
    console.log('4. Current air pollution in Tokyo:')
    const tokyoPollution = await connector.airPollution.getCurrent(35.6762, 139.6503)
    const aqi = tokyoPollution.list[0].main.aqi
    const aqiLabels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor']
    console.log(`   Air Quality Index: ${aqi} (${aqiLabels[aqi - 1]})`)
    console.log(`   PM2.5: ${tokyoPollution.list[0].components.pm2_5} μg/m³`)
    console.log(`   PM10: ${tokyoPollution.list[0].components.pm10} μg/m³\n`)

    // 5. Geocoding: convert city name to coordinates
    console.log('5. Geocoding - Find coordinates for "Berlin":')
    const berlinLocations = await connector.geocoding.direct('Berlin,DE', 1)
    if (berlinLocations.length > 0) {
      const berlin = berlinLocations[0]
      console.log(`   Name: ${berlin.name}`)
      console.log(`   Country: ${berlin.country}`)
      console.log(`   Coordinates: ${berlin.lat}, ${berlin.lon}\n`)
    }

    // 6. Reverse geocoding: coordinates to location name
    console.log('6. Reverse geocoding - Find location at coordinates:')
    const reverseLocations = await connector.geocoding.reverse(40.7128, -74.0060)
    if (reverseLocations.length > 0) {
      const location = reverseLocations[0]
      console.log(`   Name: ${location.name}`)
      console.log(`   State: ${location.state || 'N/A'}`)
      console.log(`   Country: ${location.country}\n`)
    }

    console.log('=== Example completed successfully ===')
  } catch (error: any) {
    console.error('Error:', error.message)
    if (error.response) {
      console.error('Response:', error.response.data)
    }
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error)
}

