import { createConnector } from '../src'

async function main() {
  const conn = createConnector()
  conn.init({
    apiKey: process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY_HERE',
    logging: {
      enabled: true,
      level: 'info'
    }
  })

  console.log('OpenWeather Connector initialized')

  // Example: Get current weather for London
  try {
    const currentWeather = await conn.weather.getCurrent({
      q: 'London,UK',
      units: 'metric'
    })
    console.log('\n=== Current Weather in London ===')
    console.log(`Temperature: ${currentWeather.main.temp}°C`)
    console.log(`Feels like: ${currentWeather.main.feels_like}°C`)
    console.log(`Weather: ${currentWeather.weather[0].description}`)
    console.log(`Humidity: ${currentWeather.main.humidity}%`)
    console.log(`Wind speed: ${currentWeather.wind.speed} m/s`)
  } catch (error) {
    console.error('Error fetching current weather:', error)
  }

  // Example: Get 5-day forecast
  try {
    const forecast = await conn.forecast.get5Day3Hour({
      q: 'London,UK',
      units: 'metric',
      cnt: 8 // Get first 8 timestamps (24 hours)
    })
    console.log('\n=== 5-Day Forecast for London (next 24h) ===')
    forecast.list.forEach(item => {
      console.log(`${item.dt_txt}: ${item.main.temp}°C, ${item.weather[0].description}`)
    })
  } catch (error) {
    console.error('Error fetching forecast:', error)
  }

  // Example: Get air pollution data
  try {
    const airPollution = await conn.airPollution.getCurrent({
      lat: 51.5074,
      lon: -0.1278
    })
    console.log('\n=== Air Quality in London ===')
    const aqi = airPollution.list[0].main.aqi
    const aqiLabels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor']
    console.log(`Air Quality Index: ${aqi} (${aqiLabels[aqi - 1]})`)
    console.log(`PM2.5: ${airPollution.list[0].components.pm2_5} μg/m³`)
    console.log(`PM10: ${airPollution.list[0].components.pm10} μg/m³`)
  } catch (error) {
    console.error('Error fetching air pollution data:', error)
  }

  // Example: Geocoding - get coordinates for a city
  try {
    const locations = await conn.geocoding.getByLocationName({
      q: 'Paris,FR',
      limit: 1
    })
    if (locations.length > 0) {
      console.log('\n=== Geocoding: Paris ===')
      console.log(`Location: ${locations[0].name}, ${locations[0].country}`)
      console.log(`Coordinates: ${locations[0].lat}, ${locations[0].lon}`)
    }
  } catch (error) {
    console.error('Error fetching geocoding data:', error)
  }
}

main().catch(console.error)

