import type { SendFn } from '../lib/paginate'

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
  clouds: { all: number }
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  visibility: number
  pop: number
  rain?: { '3h': number }
  snow?: { '3h': number }
  sys: { pod: string }
  dt_txt: string
}

export interface ForecastData {
  cod: string
  message: number
  cnt: number
  list: ForecastItem[]
  city: {
    id: number
    name: string
    coord: { lat: number; lon: number }
    country: string
    population: number
    timezone: number
    sunrise: number
    sunset: number
  }
}

export interface ForecastParams {
  // By city name
  q?: string
  // By coordinates
  lat?: number
  lon?: number
  // By city ID
  id?: number
  // By ZIP code
  zip?: string
  // Number of timestamps (max 96 for 5 day / 3 hour forecast)
  cnt?: number
  // Units: standard, metric, imperial
  units?: 'standard' | 'metric' | 'imperial'
  // Language
  lang?: string
}

export const createResource = (send: SendFn) => ({
  /**
   * Get 5 day weather forecast with data every 3 hours
   * @param params - Query parameters for forecast lookup
   * @returns 5-day/3-hour forecast data
   */
  async get5Day(params: ForecastParams): Promise<ForecastData> {
    const response = await send<ForecastData>({
      method: 'GET',
      path: '/data/2.5/forecast',
      query: params as Record<string, any>,
      operation: 'get5Day',
    })
    return response.data
  },
})
