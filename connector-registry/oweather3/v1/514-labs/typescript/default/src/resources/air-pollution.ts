import type { SendFn } from '../lib/paginate'
import type { Coordinates } from './weather'

export interface AirQualityComponents {
  co: number // Carbon monoxide (μg/m3)
  no: number // Nitrogen monoxide (μg/m3)
  no2: number // Nitrogen dioxide (μg/m3)
  o3: number // Ozone (μg/m3)
  so2: number // Sulphur dioxide (μg/m3)
  pm2_5: number // Fine particles matter (μg/m3)
  pm10: number // Coarse particulate matter (μg/m3)
  nh3: number // Ammonia (μg/m3)
}

export interface AirQualityData {
  main: {
    aqi: number // Air Quality Index (1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor)
  }
  components: AirQualityComponents
  dt: number
}

export interface AirPollutionResponse {
  coord: Coordinates
  list: AirQualityData[]
}

export interface GetAirPollutionParams {
  lat: number // Latitude
  lon: number // Longitude
  start?: number // Start date (unix time, UTC)
  end?: number // End date (unix time, UTC)
}

export const createResource = (send: SendFn) => ({
  /**
   * Get current air pollution data
   * @param params - Air pollution query parameters (lat/lon required)
   * @returns Current air pollution data
   */
  async getCurrent(params: GetAirPollutionParams): Promise<AirPollutionResponse> {
    const { lat, lon } = params
    const response = await send({
      method: 'GET',
      path: '/air_pollution',
      query: { lat, lon } as any,
    })
    return response.data as AirPollutionResponse
  },

  /**
   * Get forecast air pollution data
   * @param params - Air pollution query parameters (lat/lon required)
   * @returns Forecast air pollution data
   */
  async getForecast(params: GetAirPollutionParams): Promise<AirPollutionResponse> {
    const { lat, lon } = params
    const response = await send({
      method: 'GET',
      path: '/air_pollution/forecast',
      query: { lat, lon } as any,
    })
    return response.data as AirPollutionResponse
  },

  /**
   * Get historical air pollution data
   * @param params - Air pollution query parameters (lat/lon and start/end required)
   * @returns Historical air pollution data
   */
  async getHistorical(params: GetAirPollutionParams): Promise<AirPollutionResponse> {
    const { lat, lon, start, end } = params
    const response = await send({
      method: 'GET',
      path: '/air_pollution/history',
      query: { lat, lon, start, end } as any,
    })
    return response.data as AirPollutionResponse
  },
})
