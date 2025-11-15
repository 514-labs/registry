import type { SendFn } from '../lib/paginate'

export interface WeatherCondition {
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

export interface Coord {
  lon: number
  lat: number
}

export interface CurrentWeather {
  coord: Coord
  weather: WeatherCondition[]
  base: string
  main: MainWeatherData
  visibility: number
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

export interface GetCurrentWeatherParams {
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
  /** Units of measurement. standard, metric or imperial */
  units?: 'standard' | 'metric' | 'imperial'
  /** Language for output */
  lang?: string
}

export const createResource = (send: SendFn, defaultUnits: string, defaultLang: string) => ({
  /**
   * Get current weather data for a location
   * @param params - Location and format parameters
   * @returns Current weather data
   */
  async getCurrent(params: GetCurrentWeatherParams): Promise<CurrentWeather> {
    const query: Record<string, any> = {
      units: params.units ?? defaultUnits,
      lang: params.lang ?? defaultLang,
    }

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
      path: '/data/2.5/weather',
      query,
    })
    return response.data as CurrentWeather
  },
})
