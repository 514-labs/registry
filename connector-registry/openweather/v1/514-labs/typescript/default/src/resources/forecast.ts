import type { SendFn } from '../lib/paginate'

/**
 * Forecast data item from OpenWeatherMap 5 day / 3 hour forecast API
 * See: https://openweathermap.org/forecast5
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

export interface ForecastResponse {
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

export interface ForecastQueryParams {
  // Location parameters (one of these is required)
  q?: string           // City name, state code (US only), country code
  id?: number          // City ID
  lat?: number         // Latitude (must be used with lon)
  lon?: number         // Longitude (must be used with lat)
  zip?: string         // Zip code,country code
  
  // Optional parameters
  cnt?: number         // Number of timestamps (max 40 for 5-day forecast)
  units?: 'standard' | 'metric' | 'imperial'
  lang?: string
}

export const createResource = (send: SendFn) => ({
  /**
   * Get 5 day / 3 hour forecast data
   * @param params - Query parameters for location and units
   * @returns Forecast data for the next 5 days with 3-hour intervals
   */
  async get5Day3Hour(params: ForecastQueryParams): Promise<ForecastResponse> {
    const response = await send<ForecastResponse>({
      method: 'GET',
      path: '/data/2.5/forecast',
      query: params as any,
      operation: 'forecast.get5Day3Hour'
    })
    return response.data
  }
})
