import { createConnector } from '../src'

async function main() {
  const conn = createConnector()
  conn.init({
    apiKey: process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY',
    units: 'metric',
    lang: 'en',
  })

  console.log('OpenWeather Connector initialized\n')

  // Example 1: Get current weather by city name
  console.log('=== Current Weather (London, UK) ===')
  try {
    const weather = await conn.weather.get({ q: 'London,UK' })
    console.log(`City: ${weather.name}, ${weather.sys.country}`)
    console.log(`Temperature: ${weather.main.temp}°C (feels like ${weather.main.feels_like}°C)`)
    console.log(`Weather: ${weather.weather[0].main} - ${weather.weather[0].description}`)
    console.log(`Humidity: ${weather.main.humidity}%`)
    console.log(`Wind: ${weather.wind.speed} m/s`)
  } catch (error) {
    console.error('Error fetching weather:', error)
  }

  console.log('\n=== 5-Day Forecast (Paris, FR) ===')
  try {
    const forecast = await conn.forecast.get({ q: 'Paris,FR', cnt: 5 })
    console.log(`City: ${forecast.city.name}, ${forecast.city.country}`)
    console.log(`Forecast count: ${forecast.cnt}`)
    forecast.list.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.dt_txt}: ${item.main.temp}°C, ${item.weather[0].description}`)
    })
  } catch (error) {
    console.error('Error fetching forecast:', error)
  }

  console.log('\n=== Air Pollution (New York) ===')
  try {
    const pollution = await conn.airPollution.getCurrent({ lat: 40.7128, lon: -74.0060 })
    const aqi = pollution.list[0].main.aqi
    const aqiLabels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor']
    console.log(`Coordinates: ${pollution.coord.lat}, ${pollution.coord.lon}`)
    console.log(`Air Quality Index: ${aqi} (${aqiLabels[aqi - 1]})`)
    console.log(`PM2.5: ${pollution.list[0].components.pm2_5} μg/m³`)
    console.log(`PM10: ${pollution.list[0].components.pm10} μg/m³`)
  } catch (error) {
    console.error('Error fetching air pollution:', error)
  }

  console.log('\n=== Geocoding (Search for Berlin) ===')
  try {
    const locations = await conn.geocoding.direct({ q: 'Berlin', limit: 3 })
    console.log(`Found ${locations.length} locations:`)
    locations.forEach((loc, index) => {
      console.log(`  ${index + 1}. ${loc.name}, ${loc.country} (${loc.lat}, ${loc.lon})`)
    })
  } catch (error) {
    console.error('Error with geocoding:', error)
  }

  console.log('\n=== Reverse Geocoding ===')
  try {
    const locations = await conn.geocoding.reverse({ lat: 51.5074, lon: -0.1278, limit: 1 })
    if (locations.length > 0) {
      const loc = locations[0]
      console.log(`Location: ${loc.name}, ${loc.country}`)
      console.log(`Coordinates: ${loc.lat}, ${loc.lon}`)
    }
  } catch (error) {
    console.error('Error with reverse geocoding:', error)
  }
}

main().catch(console.error)
