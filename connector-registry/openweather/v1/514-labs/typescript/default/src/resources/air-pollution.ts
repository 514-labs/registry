import type { SendFn } from '../lib/paginate'

export interface AirQualityIndex {
  aqi: number // 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
}

export interface AirComponents {
  co: number // Carbon monoxide (μg/m³)
  no: number // Nitrogen monoxide (μg/m³)
  no2: number // Nitrogen dioxide (μg/m³)
  o3: number // Ozone (μg/m³)
  so2: number // Sulphur dioxide (μg/m³)
  pm2_5: number // Fine particles matter (μg/m³)
  pm10: number // Coarse particulate matter (μg/m³)
  nh3: number // Ammonia (μg/m³)
}

export interface AirPollutionItem {
  main: AirQualityIndex
  components: AirComponents
  dt: number
}

export interface AirPollutionData {
  coord: { lon: number; lat: number }
  list: AirPollutionItem[]
}

export interface AirPollutionParams {
  lat: number
  lon: number
}

export interface AirPollutionHistoryParams extends AirPollutionParams {
  start: number // Unix timestamp
  end: number // Unix timestamp
}

export const createResource = (send: SendFn) => ({
  /**
   * Get current air pollution data
   * @param params - Coordinates (lat, lon)
   * @returns Current air pollution data
   */
  async getCurrent(params: AirPollutionParams): Promise<AirPollutionData> {
    const response = await send<AirPollutionData>({
      method: 'GET',
      path: '/data/2.5/air_pollution',
      query: params as Record<string, any>,
      operation: 'getCurrent',
    })
    return response.data
  },

  /**
   * Get air pollution forecast
   * @param params - Coordinates (lat, lon)
   * @returns Air pollution forecast data
   */
  async getForecast(params: AirPollutionParams): Promise<AirPollutionData> {
    const response = await send<AirPollutionData>({
      method: 'GET',
      path: '/data/2.5/air_pollution/forecast',
      query: params as Record<string, any>,
      operation: 'getForecast',
    })
    return response.data
  },

  /**
   * Get historical air pollution data
   * @param params - Coordinates and time range
   * @returns Historical air pollution data
   */
  async getHistory(params: AirPollutionHistoryParams): Promise<AirPollutionData> {
    const response = await send<AirPollutionData>({
      method: 'GET',
      path: '/data/2.5/air_pollution/history',
      query: params as Record<string, any>,
      operation: 'getHistory',
    })
    return response.data
  },
})
