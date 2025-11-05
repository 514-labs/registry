import type { SendFn } from '../lib/paginate'
import type { Coordinates, Weather, MainWeatherData, Wind, Clouds, Rain, Snow } from './current-weather'

export interface ForecastItem {
  dt: number
  main: MainWeatherData
  weather: Weather[]
  clouds: Clouds
  wind: Wind
  visibility: number
  pop: number // Probability of precipitation
  rain?: Rain
  snow?: Snow
  sys: {
    pod: string // Part of day (d = day, n = night)
  }
  dt_txt: string
}

export interface City {
  id: number
  name: string
  coord: Coordinates
  country: string
  population: number
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

export interface ForecastParams {
  // By city name
  q?: string
  // By city ID
  id?: number
  // By coordinates
  lat?: number
  lon?: number
  // By ZIP code
  zip?: string
  // Number of timestamps (max 40 for 5-day forecast)
  cnt?: number
  // Units: standard, metric, imperial
  units?: 'standard' | 'metric' | 'imperial'
  // Language code
  lang?: string
}

export const createResource = (send: SendFn) => ({
  /**
   * Get 5-day weather forecast with 3-hour step.
   * You must provide one of: q (city name), id (city ID), lat+lon (coordinates), or zip (ZIP code).
   */
  async get(params: ForecastParams): Promise<ForecastResponse> {
    const response = await send<ForecastResponse>({
      method: 'GET',
      path: '/data/2.5/forecast',
      query: params as Record<string, any>,
    })
    return response.data
  },

  /**
   * Get 5-day forecast by city name.
   * @param city - City name, state code (US only), and country code divided by comma.
   */
  async getByCity(city: string, units?: 'standard' | 'metric' | 'imperial', lang?: string): Promise<ForecastResponse> {
    return this.get({ q: city, units, lang })
  },

  /**
   * Get 5-day forecast by geographic coordinates.
   */
  async getByCoordinates(lat: number, lon: number, units?: 'standard' | 'metric' | 'imperial', lang?: string): Promise<ForecastResponse> {
    return this.get({ lat, lon, units, lang })
  },

  /**
   * Get 5-day forecast by city ID.
   */
  async getByCityId(id: number, units?: 'standard' | 'metric' | 'imperial', lang?: string): Promise<ForecastResponse> {
    return this.get({ id, units, lang })
  },

  /**
   * Get 5-day forecast by ZIP code.
   */
  async getByZip(zip: string, units?: 'standard' | 'metric' | 'imperial', lang?: string): Promise<ForecastResponse> {
    return this.get({ zip, units, lang })
  },
})
