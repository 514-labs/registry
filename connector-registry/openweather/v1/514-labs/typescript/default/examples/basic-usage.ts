import { createConnector } from '../src'

async function main() {
  const conn = createConnector()
  conn.init({
    apiKey: process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY',
  })

  console.log('OpenWeather Connector initialized\n')

  // Example 1: Get current weather by city name
  console.log('Example 1: Current weather in London')
  try {
    const weather = await conn.weather.getCurrent({ q: 'London', units: 'metric' })
    console.log(`Temperature in ${weather.name}: ${weather.main?.temp}°C`)
    console.log(`Weather: ${weather.weather?.[0]?.description}\n`)
  } catch (error) {
    console.error('Error fetching current weather:', error)
  }

  // Example 2: Get 5-day forecast
  console.log('Example 2: 5-day forecast for New York')
  try {
    const forecast = await conn.forecast.get5Day({ q: 'New York', units: 'imperial' })
    console.log(`City: ${forecast.city.name}`)
    console.log(`Number of forecast items: ${forecast.list.length}`)
    console.log(`First forecast time: ${forecast.list[0].dt_txt}\n`)
  } catch (error) {
    console.error('Error fetching forecast:', error)
  }

  // Example 3: Get air pollution data
  console.log('Example 3: Air pollution in Paris')
  try {
    const pollution = await conn.airPollution.getCurrent({ lat: 48.8566, lon: 2.3522 })
    const aqi = pollution.list[0]?.main.aqi
    const aqiText = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][aqi - 1] || 'Unknown'
    console.log(`Air Quality Index: ${aqi} (${aqiText})`)
    console.log(`PM2.5: ${pollution.list[0]?.components.pm2_5} μg/m³\n`)
  } catch (error) {
    console.error('Error fetching air pollution:', error)
  }

  // Example 4: Geocoding
  console.log('Example 4: Geocoding - Find coordinates for Tokyo')
  try {
    const locations = await conn.geocoding.direct({ q: 'Tokyo', limit: 1 })
    if (locations.length > 0) {
      console.log(`${locations[0].name}, ${locations[0].country}`)
      console.log(`Coordinates: ${locations[0].lat}, ${locations[0].lon}`)
    }
  } catch (error) {
    console.error('Error with geocoding:', error)
  }
}

main().catch(console.error)

