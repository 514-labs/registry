/**
 * 5-day Weather Forecast API
 * https://openweathermap.org/forecast5
 */
import type { SendFn } from '../lib/paginate'

export interface ForecastParams {
  // Location - choose one method
  q?: string              // City name, state code (US only), country code
  lat?: number           // Latitude
  lon?: number           // Longitude
  id?: number            // City ID
  zip?: string           // Zip code, country code
  
  // Optional parameters
  units?: 'standard' | 'metric' | 'imperial'
  lang?: string          // Language code
  cnt?: number           // Number of timestamps (max 40)
}

export interface ForecastItem {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    sea_level: number
    grnd_level: number
    humidity: number
    temp_kf: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  clouds: {
    all: number
  }
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  visibility: number
  pop: number
  rain?: {
    '3h'?: number
  }
  snow?: {
    '3h'?: number
  }
  sys: {
    pod: string
  }
  dt_txt: string
}

export interface Forecast {
  cod: string
  message: number
  cnt: number
  list: ForecastItem[]
  city: {
    id: number
    name: string
    coord: {
      lat: number
      lon: number
    }
    country: string
    population: number
    timezone: number
    sunrise: number
    sunset: number
  }
}

export const createForecastResource = (send: SendFn) => ({
  /**
   * Get 5-day weather forecast with 3-hour step
   */
  async get(params: ForecastParams): Promise<Forecast> {
    const response = await send<Forecast>({
      method: 'GET',
      path: '/data/2.5/forecast',
      query: params as any,
    })
    return response.data
  },
})
