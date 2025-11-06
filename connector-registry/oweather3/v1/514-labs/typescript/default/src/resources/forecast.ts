import type { SendFn } from '../lib/paginate'
import type { Coordinates, Weather, MainWeatherData, Wind, Clouds, Rain, Snow } from './weather'

export interface ForecastItem {
  dt: number
  main: MainWeatherData
  weather: Weather[]
  clouds: Clouds
  wind: Wind
  visibility?: number
  pop: number // Probability of precipitation
  rain?: Rain
  snow?: Snow
  sys: { pod: string } // Part of day (n - night, d - day)
  dt_txt: string
}

export interface City {
  id: number
  name: string
  coord: Coordinates
  country: string
  population?: number
  timezone: number
  sunrise: number
  sunset: number
}

export interface ForecastResponse {
  cod: string
  message: number
  cnt: number
  list: ForecastItem[]
  city: City
}

export interface GetForecastParams {
  q?: string // City name, state code, country code
  lat?: number // Latitude
  lon?: number // Longitude
  id?: number // City ID
  zip?: string // Zip code
  cnt?: number // Number of timestamps (max 40)
  units?: 'standard' | 'metric' | 'imperial'
  lang?: string
}

export const createResource = (send: SendFn) => ({
  /**
   * Get 5 day / 3 hour forecast data
   * @param params - Forecast query parameters
   * @returns 5-day forecast data
   */
  async get(params: GetForecastParams): Promise<ForecastResponse> {
    const response = await send({
      method: 'GET',
      path: '/forecast',
      query: params as any,
    })
    return response.data as ForecastResponse
  },
})
