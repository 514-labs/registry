// TODO: Replace Model with your resource type (see CONNECTOR_GUIDE.md Phase 5)
// TODO: Implement pagination using paginateOffset/paginateCursor from '../lib/paginate'
// TODO: Map your API's query parameters in buildListQuery
import type { SendFn } from '../lib/paginate'

/**
 * Current weather data from OpenWeatherMap API
 * See: https://openweathermap.org/current
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
  visibility?: number
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

export interface WeatherQueryParams {
  // Location parameters (one of these is required)
  q?: string           // City name, state code (US only), country code (e.g., "London", "London,UK")
  id?: number          // City ID
  lat?: number         // Latitude (must be used with lon)
  lon?: number         // Longitude (must be used with lat)
  zip?: string         // Zip code,country code (e.g., "94040,US")
  
  // Optional parameters
  units?: 'standard' | 'metric' | 'imperial'  // Temperature units (default: standard/Kelvin)
  lang?: string        // Language code (e.g., 'en', 'es', 'fr')
}

export const createResource = (send: SendFn) => ({
  /**
   * Get current weather data by location
   * @param params - Query parameters for location and units
   * @returns Current weather data
   */
  async getCurrent(params: WeatherQueryParams): Promise<CurrentWeather> {
    const response = await send<CurrentWeather>({
      method: 'GET',
      path: '/data/2.5/weather',
      query: params as any,
      operation: 'weather.getCurrent'
    })
    return response.data
  },

  /**
   * Get current weather for multiple cities by IDs
   * @param cityIds - Array of city IDs
   * @param params - Optional query parameters for units and language
   * @returns Object containing list of current weather data
   */
  async getMultipleCities(
    cityIds: number[], 
    params?: Pick<WeatherQueryParams, 'units' | 'lang'>
  ): Promise<{ cnt: number; list: CurrentWeather[] }> {
    const response = await send<{ cnt: number; list: CurrentWeather[] }>({
      method: 'GET',
      path: '/data/2.5/group',
      query: {
        id: cityIds.join(','),
        ...params
      },
      operation: 'weather.getMultipleCities'
    })
    return response.data
  }
})
