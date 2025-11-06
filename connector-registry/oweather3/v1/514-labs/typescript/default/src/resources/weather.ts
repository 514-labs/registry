import type { SendFn } from '../lib/paginate'

export interface Coordinates {
  lon: number
  lat: number
}

export interface Weather {
  id: number
  main: string
  description: string
  icon: string
}

export interface MainWeatherData {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
  sea_level?: number
  grnd_level?: number
}

export interface Wind {
  speed: number
  deg: number
  gust?: number
}

export interface Clouds {
  all: number
}

export interface Rain {
  '1h'?: number
  '3h'?: number
}

export interface Snow {
  '1h'?: number
  '3h'?: number
}

export interface Sys {
  type?: number
  id?: number
  country: string
  sunrise: number
  sunset: number
}

export interface CurrentWeather {
  coord: Coordinates
  weather: Weather[]
  base: string
  main: MainWeatherData
  visibility?: number
  wind: Wind
  clouds: Clouds
  rain?: Rain
  snow?: Snow
  dt: number
  sys: Sys
  timezone: number
  id: number
  name: string
  cod: number
}

export interface GetWeatherParams {
  q?: string // City name, state code, country code (e.g., "London,UK")
  lat?: number // Latitude
  lon?: number // Longitude
  id?: number // City ID
  zip?: string // Zip code
  units?: 'standard' | 'metric' | 'imperial'
  lang?: string
}

export const createResource = (send: SendFn) => ({
  /**
   * Get current weather data by city name, coordinates, city ID, or zip code
   * @param params - Weather query parameters
   * @returns Current weather data
   */
  async get(params: GetWeatherParams): Promise<CurrentWeather> {
    const response = await send({
      method: 'GET',
      path: '/weather',
      query: params as any,
    })
    return response.data as CurrentWeather
  },
})
