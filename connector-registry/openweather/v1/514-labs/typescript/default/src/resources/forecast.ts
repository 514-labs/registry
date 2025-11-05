import type { SendFn } from '../lib/paginate'
import type { Coordinates, Weather, MainWeather, Wind, Clouds, Rain, Snow } from './weather'

export interface ForecastItem {
  dt: number
  main: MainWeather
  weather: Weather[]
  clouds: Clouds
  wind: Wind
  visibility: number
  pop: number // Probability of precipitation
  rain?: Rain
  snow?: Snow
  sys: {
    pod: string // Part of day (n - night, d - day)
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

export interface ForecastQueryParams {
  q?: string // City name
  lat?: number
  lon?: number
  zip?: string // ZIP code with country code
  cnt?: number // Number of timestamps (max 40)
  units?: 'standard' | 'metric' | 'imperial'
  lang?: string
}

export const createResource = (send: SendFn) => ({
  /**
   * Get 5-day weather forecast with data every 3 hours
   */
  async get(params: ForecastQueryParams): Promise<ForecastResponse> {
    const query: Record<string, any> = {}
    
    if (params.q) query.q = params.q
    if (params.lat !== undefined) query.lat = params.lat
    if (params.lon !== undefined) query.lon = params.lon
    if (params.zip) query.zip = params.zip
    if (params.cnt !== undefined) query.cnt = params.cnt
    if (params.units) query.units = params.units
    if (params.lang) query.lang = params.lang

    const response = await send<ForecastResponse>({
      method: 'GET',
      path: '/data/2.5/forecast',
      query,
    })

    return response.data
  },

  /**
   * Generator that yields forecast items page by page
   */
  async *list(params: ForecastQueryParams & { pageSize?: number }): AsyncGenerator<ReadonlyArray<ForecastItem>> {
    const forecast = await this.get(params)
    const items = forecast.list
    const pageSize = params.pageSize || items.length

    for (let i = 0; i < items.length; i += pageSize) {
      yield items.slice(i, i + pageSize)
    }
  },
})
