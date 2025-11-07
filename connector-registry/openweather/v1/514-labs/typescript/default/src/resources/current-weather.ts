/**
 * Current Weather Data Resource
 * 
 * Access current weather data for any location on Earth including over 200,000 cities.
 * API endpoint: /data/2.5/weather
 * Documentation: https://openweathermap.org/current
 */
import type { SendFn } from '../lib/paginate'

/**
 * Current weather data response
 */
export interface CurrentWeather {
  coord: {
    lon: number
    lat: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
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

/**
 * Parameters for getting current weather
 */
export interface GetWeatherParams {
  /** City name, state code (US only) and country code divided by comma. Example: "London,uk" */
  q?: string
  /** Latitude */
  lat?: number
  /** Longitude */
  lon?: number
  /** City ID */
  id?: number
  /** Zip/post code and country code divided by comma. Example: "94040,us" */
  zip?: string
}

export const createResource = (send: SendFn) => ({
  /**
   * Get current weather data for a location
   * You must provide one of: q, lat/lon, id, or zip
   */
  async get(params: GetWeatherParams): Promise<CurrentWeather> {
    const response = await send<CurrentWeather>({
      method: 'GET',
      path: '/data/2.5/weather',
      query: params,
    })
    return response.data
  },

  /**
   * Get current weather by city name
   */
  async getByCity(cityName: string, countryCode?: string): Promise<CurrentWeather> {
    const q = countryCode ? `${cityName},${countryCode}` : cityName
    return this.get({ q })
  },

  /**
   * Get current weather by coordinates
   */
  async getByCoordinates(lat: number, lon: number): Promise<CurrentWeather> {
    return this.get({ lat, lon })
  },

  /**
   * Get current weather by city ID
   */
  async getByCityId(id: number): Promise<CurrentWeather> {
    return this.get({ id })
  },

  /**
   * Get current weather by zip code
   */
  async getByZipCode(zip: string, countryCode?: string): Promise<CurrentWeather> {
    const zipParam = countryCode ? `${zip},${countryCode}` : zip
    return this.get({ zip: zipParam })
  },
})
