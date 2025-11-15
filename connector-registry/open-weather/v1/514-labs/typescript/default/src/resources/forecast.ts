import type { SendFn } from '../lib/paginate'
import type { WeatherCondition, MainWeatherData, Wind, Clouds, Rain, Snow } from './current-weather'

export interface ForecastItem {
  dt: number
  main: MainWeatherData
  weather: WeatherCondition[]
  clouds: Clouds
  wind: Wind
  visibility: number
  pop: number
  rain?: Rain
  snow?: Snow
  sys: {
    pod: string
  }
  dt_txt: string
}

export interface City {
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

export interface ForecastResponse {
  cod: string
  message: number
  cnt: number
  list: ForecastItem[]
  city: City
}

export interface GetForecastParams {
  /** City name, state code (US only), and country code divided by comma. Example: "London,UK" */
  q?: string
  /** Latitude */
  lat?: number
  /** Longitude */
  lon?: number
  /** City ID */
  id?: number
  /** Zip/post code and country code divided by comma. Example: "94040,US" */
  zip?: string
  /** Number of timestamps to return (max 96 for 5-day forecast) */
  cnt?: number
  /** Units of measurement. standard, metric or imperial */
  units?: 'standard' | 'metric' | 'imperial'
  /** Language for output */
  lang?: string
}

export const createResource = (send: SendFn, defaultUnits: string, defaultLang: string) => ({
  /**
   * Get 5-day weather forecast with 3-hour step
   * @param params - Location and format parameters
   * @returns 5-day forecast data
   */
  async get5Day(params: GetForecastParams): Promise<ForecastResponse> {
    const query: Record<string, any> = {
      units: params.units ?? defaultUnits,
      lang: params.lang ?? defaultLang,
    }

    if (params.cnt) query.cnt = params.cnt

    // Add location parameter (only one should be provided)
    if (params.q) query.q = params.q
    else if (params.lat !== undefined && params.lon !== undefined) {
      query.lat = params.lat
      query.lon = params.lon
    } else if (params.id) query.id = params.id
    else if (params.zip) query.zip = params.zip
    else {
      throw new Error('Must provide one of: q, lat/lon, id, or zip')
    }

    const response = await send({
      method: 'GET',
      path: '/data/2.5/forecast',
      query,
    })
    return response.data as ForecastResponse
  },
})
