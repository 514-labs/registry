import { createConnector } from '../src'

async function main() {
  // Initialize the connector
  const connector = createConnector()
  connector.init({
    apiKey: process.env.OPENWEATHER_API_KEY || 'your-api-key-here',
    units: 'metric',
    language: 'en',
    logging: {
      enabled: true,
      level: 'info',
    },
  })

  console.log('OpenWeatherMap Connector initialized\n')

  try {
    // Example 1: Get current weather by city name
    console.log('--- Current Weather for London ---')
    const weather = await connector.weather.get({ q: 'London,UK' })
    console.log(`City: ${weather.name}`)
    console.log(`Temperature: ${weather.main.temp}°C`)
    console.log(`Feels like: ${weather.main.feels_like}°C`)
    console.log(`Weather: ${weather.weather[0].main} - ${weather.weather[0].description}`)
    console.log(`Humidity: ${weather.main.humidity}%`)
    console.log(`Wind Speed: ${weather.wind.speed} m/s\n`)

    // Example 2: Get 5-day forecast
    console.log('--- 5-Day Forecast for New York ---')
    const forecast = await connector.forecast.get({ q: 'New York,US', cnt: 5 })
    console.log(`City: ${forecast.city.name}`)
    console.log(`Number of forecast items: ${forecast.cnt}`)
    forecast.list.forEach((item, index) => {
      console.log(`  [${index + 1}] ${item.dt_txt}: ${item.main.temp}°C - ${item.weather[0].description}`)
    })
    console.log()

    // Example 3: Get coordinates for a city using geocoding
    console.log('--- Geocoding: Find Paris coordinates ---')
    const locations = await connector.geocoding.getByLocationName({ q: 'Paris,FR', limit: 1 })
    if (locations.length > 0) {
      const paris = locations[0]
      console.log(`Location: ${paris.name}, ${paris.country}`)
      console.log(`Coordinates: ${paris.lat}, ${paris.lon}\n`)

      // Example 4: Get air pollution data for Paris
      console.log('--- Air Pollution in Paris ---')
      const airPollution = await connector.airPollution.getCurrent({
        lat: paris.lat,
        lon: paris.lon,
      })
      const aq = airPollution.list[0]
      console.log(`Air Quality Index: ${aq.main.aqi}`)
      console.log(`Components:`)
      console.log(`  CO: ${aq.components.co} μg/m³`)
      console.log(`  NO2: ${aq.components.no2} μg/m³`)
      console.log(`  O3: ${aq.components.o3} μg/m³`)
      console.log(`  PM2.5: ${aq.components.pm2_5} μg/m³`)
      console.log(`  PM10: ${aq.components.pm10} μg/m³\n`)
    }

    // Example 5: Reverse geocoding
    console.log('--- Reverse Geocoding: Location at 40.7128, -74.0060 ---')
    const reverseLocations = await connector.geocoding.getByCoordinates({
      lat: 40.7128,
      lon: -74.0060,
      limit: 1,
    })
    if (reverseLocations.length > 0) {
      const location = reverseLocations[0]
      console.log(`Location: ${location.name}, ${location.state || ''}, ${location.country}`)
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

main().catch(console.error)
