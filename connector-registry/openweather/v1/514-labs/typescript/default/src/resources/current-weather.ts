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

export interface CurrentWeatherResponse {
  coord: Coordinates
  weather: Weather[]
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

export interface CurrentWeatherParams {
  // By city name
  q?: string
  // By city ID
  id?: number
  // By coordinates
  lat?: number
  lon?: number
  // By ZIP code
  zip?: string
  // Units: standard, metric, imperial
  units?: 'standard' | 'metric' | 'imperial'
  // Language code
  lang?: string
}

export const createResource = (send: SendFn) => ({
  /**
   * Get current weather data by city name, coordinates, city ID, or ZIP code.
   * You must provide one of: q (city name), id (city ID), lat+lon (coordinates), or zip (ZIP code).
   */
  async get(params: CurrentWeatherParams): Promise<CurrentWeatherResponse> {
    const response = await send<CurrentWeatherResponse>({
      method: 'GET',
      path: '/data/2.5/weather',
      query: params as Record<string, any>,
    })
    return response.data
  },

  /**
   * Get current weather by city name.
   * @param city - City name, state code (US only), and country code divided by comma.
   *               Examples: "London", "London,UK", "New York,NY,US"
   * @param units - Units of measurement
   * @param lang - Language code
   */
  async getByCity(city: string, units?: 'standard' | 'metric' | 'imperial', lang?: string): Promise<CurrentWeatherResponse> {
    return this.get({ q: city, units, lang })
  },

  /**
   * Get current weather by geographic coordinates.
   */
  async getByCoordinates(lat: number, lon: number, units?: 'standard' | 'metric' | 'imperial', lang?: string): Promise<CurrentWeatherResponse> {
    return this.get({ lat, lon, units, lang })
  },

  /**
   * Get current weather by city ID.
   */
  async getByCityId(id: number, units?: 'standard' | 'metric' | 'imperial', lang?: string): Promise<CurrentWeatherResponse> {
    return this.get({ id, units, lang })
  },

  /**
   * Get current weather by ZIP code.
   * @param zip - ZIP/post code and country code divided by comma.
   *              Examples: "10001,US", "E14,GB"
   */
  async getByZip(zip: string, units?: 'standard' | 'metric' | 'imperial', lang?: string): Promise<CurrentWeatherResponse> {
    return this.get({ zip, units, lang })
  },
})
