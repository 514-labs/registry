import type { SendFn } from '../lib/paginate'

/**
 * Air pollution data from OpenWeatherMap Air Pollution API
 * See: https://openweathermap.org/api/air-pollution
 */
export interface AirPollutionData {
  dt: number
  main: {
    aqi: number  // Air Quality Index: 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
  }
  components: {
    co: number      // Carbon monoxide (μg/m³)
    no: number      // Nitrogen monoxide (μg/m³)
    no2: number     // Nitrogen dioxide (μg/m³)
    o3: number      // Ozone (μg/m³)
    so2: number     // Sulphur dioxide (μg/m³)
    pm2_5: number   // Fine particles matter (μg/m³)
    pm10: number    // Coarse particulate matter (μg/m³)
    nh3: number     // Ammonia (μg/m³)
  }
}

export interface AirPollutionResponse {
  coord: {
    lon: number
    lat: number
  }
  list: AirPollutionData[]
}

export interface AirPollutionQueryParams {
  lat: number      // Latitude (required)
  lon: number      // Longitude (required)
  start?: number   // Start date (unix timestamp, UTC) - for historical data
  end?: number     // End date (unix timestamp, UTC) - for historical data
}

export const createResource = (send: SendFn) => ({
  /**
   * Get current air pollution data
   * @param params - Latitude and longitude
   * @returns Current air pollution data
   */
  async getCurrent(params: Pick<AirPollutionQueryParams, 'lat' | 'lon'>): Promise<AirPollutionResponse> {
    const response = await send<AirPollutionResponse>({
      method: 'GET',
      path: '/data/2.5/air_pollution',
      query: params as any,
      operation: 'airPollution.getCurrent'
    })
    return response.data
  },

  /**
   * Get forecast air pollution data
   * @param params - Latitude and longitude
   * @returns Forecasted air pollution data
   */
  async getForecast(params: Pick<AirPollutionQueryParams, 'lat' | 'lon'>): Promise<AirPollutionResponse> {
    const response = await send<AirPollutionResponse>({
      method: 'GET',
      path: '/data/2.5/air_pollution/forecast',
      query: params as any,
      operation: 'airPollution.getForecast'
    })
    return response.data
  },

  /**
   * Get historical air pollution data
   * @param params - Latitude, longitude, start and end timestamps
   * @returns Historical air pollution data
   */
  async getHistorical(params: AirPollutionQueryParams): Promise<AirPollutionResponse> {
    if (!params.start || !params.end) {
      throw new Error('start and end timestamps are required for historical air pollution data')
    }
    const response = await send<AirPollutionResponse>({
      method: 'GET',
      path: '/data/2.5/air_pollution/history',
      query: params as any,
      operation: 'airPollution.getHistorical'
    })
    return response.data
  }
})
