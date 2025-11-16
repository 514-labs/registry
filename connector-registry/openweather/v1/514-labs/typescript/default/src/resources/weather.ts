/**
 * Current Weather Data API
 * https://openweathermap.org/current
 */
import type { SendFn } from '../lib/paginate'

export interface CurrentWeatherParams {
  // Location - choose one method
  q?: string              // City name, state code (US only), country code
  lat?: number           // Latitude
  lon?: number           // Longitude
  id?: number            // City ID
  zip?: string           // Zip code, country code
  
  // Optional parameters
  units?: 'standard' | 'metric' | 'imperial'
  lang?: string          // Language code
}

export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface CurrentWeather {
  coord: {
    lon: number
    lat: number
  }
  weather: WeatherCondition[]
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level?: number
    grnd_level?: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  clouds: {
    all: number
  }
  rain?: {
    '1h'?: number
    '3h'?: number
  }
  snow?: {
    '1h'?: number
    '3h'?: number
  }
  dt: number
  sys: {
    type?: number
    id?: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

export const createWeatherResource = (send: SendFn) => ({
  /**
   * Get current weather data for a location
   */
  async get(params: CurrentWeatherParams): Promise<CurrentWeather> {
    const response = await send<CurrentWeather>({
      method: 'GET',
      path: '/data/2.5/weather',
      query: params as any,
    })
    return response.data
  },
})
