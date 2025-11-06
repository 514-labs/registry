// TODO: Replace Model with your resource type (see CONNECTOR_GUIDE.md Phase 5)
// TODO: Implement pagination using paginateOffset/paginateCursor from '../lib/paginate'
// TODO: Map your API's query parameters in buildListQuery
import type { SendFn } from '../lib/paginate'

export interface WeatherData {
  coord?: { lon: number; lat: number }
  weather?: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  base?: string
  main?: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level?: number
    grnd_level?: number
  }
  visibility?: number
  wind?: {
    speed: number
    deg: number
    gust?: number
  }
  clouds?: { all: number }
  rain?: { '1h'?: number; '3h'?: number }
  snow?: { '1h'?: number; '3h'?: number }
  dt?: number
  sys?: {
    type?: number
    id?: number
    country?: string
    sunrise?: number
    sunset?: number
  }
  timezone?: number
  id?: number
  name?: string
  cod?: number
}

export interface CurrentWeatherParams {
  // By city name
  q?: string
  // By coordinates
  lat?: number
  lon?: number
  // By city ID
  id?: number
  // By ZIP code
  zip?: string
  // Units: standard, metric, imperial
  units?: 'standard' | 'metric' | 'imperial'
  // Language
  lang?: string
}

export const createResource = (send: SendFn) => ({
  /**
   * Get current weather data
   * @param params - Query parameters for weather lookup
   * @returns Current weather data
   */
  async getCurrent(params: CurrentWeatherParams): Promise<WeatherData> {
    const response = await send<WeatherData>({
      method: 'GET',
      path: '/data/2.5/weather',
      query: params as Record<string, any>,
      operation: 'getCurrent',
    })
    return response.data
  },
})

