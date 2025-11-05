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

export interface MainWeather {
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
  main: MainWeather
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

export interface WeatherQueryParams {
  q?: string // City name, e.g. "London" or "London,UK"
  lat?: number
  lon?: number
  zip?: string // ZIP code with country code, e.g. "94040,US"
  units?: 'standard' | 'metric' | 'imperial'
  lang?: string
}

export const createResource = (send: SendFn) => ({
  /**
   * Get current weather data by city name, coordinates, or ZIP code
   */
  async get(params: WeatherQueryParams): Promise<CurrentWeather> {
    const query: Record<string, any> = {}
    
    if (params.q) query.q = params.q
    if (params.lat !== undefined) query.lat = params.lat
    if (params.lon !== undefined) query.lon = params.lon
    if (params.zip) query.zip = params.zip
    if (params.units) query.units = params.units
    if (params.lang) query.lang = params.lang

    const response = await send<CurrentWeather>({
      method: 'GET',
      path: '/data/2.5/weather',
      query,
    })

    return response.data
  },
})
