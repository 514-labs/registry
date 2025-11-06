import { createConnector } from '../src'

async function main() {
  const connector = createConnector()
  
  // Initialize with your API key
  // Get a free API key at https://openweathermap.org/api
  const apiKey = process.env.OPENWEATHER_API_KEY || 'your-api-key-here'
  
  connector.init({
    apiKey,
    units: 'metric',
    lang: 'en'
  })

  console.log('OpenWeather connector initialized\n')

  try {
    // Example 1: Get current weather by city name
    console.log('=== Current Weather ===')
    const weather = await connector.weather.getCurrent({ q: 'London,UK' })
    console.log(`Location: ${weather.name}, ${weather.sys.country}`)
    console.log(`Temperature: ${weather.main.temp}°C`)
    console.log(`Feels like: ${weather.main.feels_like}°C`)
    console.log(`Weather: ${weather.weather[0].main} - ${weather.weather[0].description}`)
    console.log(`Humidity: ${weather.main.humidity}%`)
    console.log(`Wind Speed: ${weather.wind.speed} m/s`)
    console.log()

    // Example 2: Get 5-day forecast
    console.log('=== 5-Day Forecast ===')
    const forecast = await connector.forecast.get5Day({ 
      q: 'Paris,FR',
      cnt: 5 // Get first 5 forecast items
    })
    console.log(`City: ${forecast.city.name}, ${forecast.city.country}`)
    console.log(`Number of forecast items: ${forecast.list.length}`)
    forecast.list.forEach((item, idx) => {
      console.log(`  ${idx + 1}. ${item.dt_txt}: ${item.main.temp}°C - ${item.weather[0].description}`)
    })
    console.log()

    // Example 3: Geocoding - city name to coordinates
    console.log('=== Geocoding ===')
    const locations = await connector.geocoding.direct({ 
      q: 'New York,US',
      limit: 1
    })
    if (locations.length > 0) {
      const loc = locations[0]
      console.log(`City: ${loc.name}, ${loc.state || ''} ${loc.country}`)
      console.log(`Coordinates: ${loc.lat}, ${loc.lon}`)
      console.log()

      // Example 4: Get air pollution data for the location
      console.log('=== Air Pollution ===')
      const airQuality = await connector.airPollution.getCurrent({ 
        lat: loc.lat, 
        lon: loc.lon 
      })
      const aqi = airQuality.list[0]
      console.log(`Location: ${loc.name}`)
      console.log(`Air Quality Index: ${aqi.main.aqi} (1=Good, 5=Very Poor)`)
      console.log(`PM2.5: ${aqi.components.pm2_5} μg/m³`)
      console.log(`PM10: ${aqi.components.pm10} μg/m³`)
      console.log(`O3: ${aqi.components.o3} μg/m³`)
      console.log(`CO: ${aqi.components.co} μg/m³`)
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

main()

