/**
 * Weather Forecast Resource
 * 
 * 5 day forecast with data every 3 hours
 * API endpoint: /data/2.5/forecast
 * Documentation: https://openweathermap.org/forecast5
 */
import type { SendFn } from '../lib/paginate'

/**
 * Weather forecast list item (3-hour interval)
 */
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

/**
 * Weather forecast response
 */
export interface WeatherForecast {
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

/**
 * Parameters for getting weather forecast
 */
export interface GetForecastParams {
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
  /** Number of timestamps to return (max 96) */
  cnt?: number
}

export const createResource = (send: SendFn) => ({
  /**
   * Get 5 day / 3 hour forecast for a location
   * You must provide one of: q, lat/lon, id, or zip
   */
  async get(params: GetForecastParams): Promise<WeatherForecast> {
    const response = await send<WeatherForecast>({
      method: 'GET',
      path: '/data/2.5/forecast',
      query: params,
    })
    return response.data
  },

  /**
   * Get forecast by city name
   */
  async getByCity(cityName: string, countryCode?: string, cnt?: number): Promise<WeatherForecast> {
    const q = countryCode ? `${cityName},${countryCode}` : cityName
    return this.get({ q, cnt })
  },

  /**
   * Get forecast by coordinates
   */
  async getByCoordinates(lat: number, lon: number, cnt?: number): Promise<WeatherForecast> {
    return this.get({ lat, lon, cnt })
  },

  /**
   * Get forecast by city ID
   */
  async getByCityId(id: number, cnt?: number): Promise<WeatherForecast> {
    return this.get({ id, cnt })
  },

  /**
   * Get forecast by zip code
   */
  async getByZipCode(zip: string, countryCode?: string, cnt?: number): Promise<WeatherForecast> {
    const zipParam = countryCode ? `${zip},${countryCode}` : zip
    return this.get({ zip: zipParam, cnt })
  },
})
