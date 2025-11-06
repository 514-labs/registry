/**
 * Basic usage example for OpenWeather API connector
 * 
 * Before running:
 * 1. Copy .env.example to .env
 * 2. Add your OpenWeather API key to .env
 * 3. Run: tsx examples/basic-usage.ts
 */
import { createConnector } from '../src'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') })

async function main() {
  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey) {
    console.error('Error: OPENWEATHER_API_KEY not found in .env file')
    process.exit(1)
  }

  // Create and initialize connector
  const conn = createConnector()
  conn.init({
    apiKey,
    logging: {
      enabled: true,
      level: 'info',
    },
  })

  console.log('OpenWeather Connector initialized\n')

  try {
    // Example 1: Get current weather for London
    console.log('=== Current Weather for London ===')
    const weather = await conn.weather.get({
      q: 'London,GB',
      units: 'metric',
    })
    console.log(`Temperature: ${weather.main.temp}°C`)
    console.log(`Feels like: ${weather.main.feels_like}°C`)
    console.log(`Weather: ${weather.weather[0].description}`)
    console.log(`Humidity: ${weather.main.humidity}%`)
    console.log()

    // Example 2: Get 5-day forecast
    console.log('=== 5-Day Forecast for London ===')
    const forecast = await conn.forecast.get({
      q: 'London,GB',
      units: 'metric',
      cnt: 5,
    })
    console.log(`Forecast for ${forecast.city.name}, ${forecast.city.country}`)
    forecast.list.forEach((item) => {
      console.log(`  ${item.dt_txt}: ${item.main.temp}°C - ${item.weather[0].description}`)
    })
    console.log()

    // Example 3: Get air pollution data
    console.log('=== Air Pollution for London ===')
    const pollution = await conn.airPollution.getCurrent({
      lat: weather.coord.lat,
      lon: weather.coord.lon,
    })
    const aqi = pollution.list[0].main.aqi
    const aqiLabels = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor']
    console.log(`Air Quality Index: ${aqi} (${aqiLabels[aqi]})`)
    console.log(`PM2.5: ${pollution.list[0].components.pm2_5} μg/m³`)
    console.log()

    // Example 4: Geocoding - find coordinates for a city
    console.log('=== Geocoding: Find Paris ===')
    const locations = await conn.geocoding.getByLocationName({
      q: 'Paris,FR',
      limit: 1,
    })
    if (locations.length > 0) {
      const paris = locations[0]
      console.log(`${paris.name}, ${paris.country}`)
      console.log(`Coordinates: ${paris.lat}, ${paris.lon}`)
    }
    console.log()

    // Example 5: Reverse geocoding - find location by coordinates
    console.log('=== Reverse Geocoding: 51.5074° N, 0.1278° W ===')
    const reverseLocations = await conn.geocoding.getByCoordinates({
      lat: 51.5074,
      lon: -0.1278,
      limit: 1,
    })
    if (reverseLocations.length > 0) {
      const location = reverseLocations[0]
      console.log(`Location: ${location.name}, ${location.country}`)
    }

  } catch (error: any) {
    console.error('Error:', error.message)
    if (error.response) {
      console.error('Response:', error.response.data)
    }
  }
}

main()
