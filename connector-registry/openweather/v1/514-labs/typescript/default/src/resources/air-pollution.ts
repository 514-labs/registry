/**
 * Air Pollution API
 * https://openweathermap.org/api/air-pollution
 */
import type { SendFn } from '../lib/paginate'

export interface AirPollutionParams {
  lat: number
  lon: number
}

export interface AirPollutionForecastParams extends AirPollutionParams {
  // No additional params needed
}

export interface AirPollutionHistoryParams extends AirPollutionParams {
  start: number  // Start date (unix time, UTC)
  end: number    // End date (unix time, UTC)
}

export interface AirPollutionData {
  main: {
    aqi: number  // Air Quality Index (1-5)
  }
  components: {
    co: number      // Carbon monoxide, μg/m3
    no: number      // Nitrogen monoxide, μg/m3
    no2: number     // Nitrogen dioxide, μg/m3
    o3: number      // Ozone, μg/m3
    so2: number     // Sulphur dioxide, μg/m3
    pm2_5: number   // Fine particles matter, μg/m3
    pm10: number    // Coarse particulate matter, μg/m3
    nh3: number     // Ammonia, μg/m3
  }
  dt: number
}

export interface AirPollutionResponse {
  coord: {
    lon: number
    lat: number
  }
  list: AirPollutionData[]
}

export const createAirPollutionResource = (send: SendFn) => ({
  /**
   * Get current air pollution data
   */
  async getCurrent(params: AirPollutionParams): Promise<AirPollutionResponse> {
    const response = await send<AirPollutionResponse>({
      method: 'GET',
      path: '/data/2.5/air_pollution',
      query: params as any,
    })
    return response.data
  },

  /**
   * Get forecasted air pollution data
   */
  async getForecast(params: AirPollutionForecastParams): Promise<AirPollutionResponse> {
    const response = await send<AirPollutionResponse>({
      method: 'GET',
      path: '/data/2.5/air_pollution/forecast',
      query: params as any,
    })
    return response.data
  },

  /**
   * Get historical air pollution data
   */
  async getHistory(params: AirPollutionHistoryParams): Promise<AirPollutionResponse> {
    const response = await send<AirPollutionResponse>({
      method: 'GET',
      path: '/data/2.5/air_pollution/history',
      query: params as any,
    })
    return response.data
  },
})
