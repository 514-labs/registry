import type { SendFn } from '../lib/paginate'
import type { Coordinates } from './weather'

export interface AirQualityComponents {
  co: number // Carbon monoxide, μg/m3
  no: number // Nitrogen monoxide, μg/m3
  no2: number // Nitrogen dioxide, μg/m3
  o3: number // Ozone, μg/m3
  so2: number // Sulphur dioxide, μg/m3
  pm2_5: number // Fine particles matter, μg/m3
  pm10: number // Coarse particulate matter, μg/m3
  nh3: number // Ammonia, μg/m3
}

export interface AirQualityData {
  main: {
    aqi: number // Air Quality Index (1-5, where 1=Good, 5=Very Poor)
  }
  components: AirQualityComponents
  dt: number // Date and time, Unix, UTC
}

export interface AirPollutionResponse {
  coord: Coordinates
  list: AirQualityData[]
}

export interface AirPollutionParams {
  lat: number
  lon: number
}

export interface AirPollutionHistoryParams extends AirPollutionParams {
  start: number // Start date, Unix, UTC
  end: number // End date, Unix, UTC
}

export const createResource = (send: SendFn) => ({
  /**
   * Get current air pollution data for coordinates
   */
  async getCurrent(params: AirPollutionParams): Promise<AirPollutionResponse> {
    const response = await send<AirPollutionResponse>({
      method: 'GET',
      path: '/data/2.5/air_pollution',
      query: {
        lat: params.lat,
        lon: params.lon,
      },
    })

    return response.data
  },

  /**
   * Get air pollution forecast for coordinates
   */
  async getForecast(params: AirPollutionParams): Promise<AirPollutionResponse> {
    const response = await send<AirPollutionResponse>({
      method: 'GET',
      path: '/data/2.5/air_pollution/forecast',
      query: {
        lat: params.lat,
        lon: params.lon,
      },
    })

    return response.data
  },

  /**
   * Get historical air pollution data for coordinates
   */
  async getHistory(params: AirPollutionHistoryParams): Promise<AirPollutionResponse> {
    const response = await send<AirPollutionResponse>({
      method: 'GET',
      path: '/data/2.5/air_pollution/history',
      query: {
        lat: params.lat,
        lon: params.lon,
        start: params.start,
        end: params.end,
      },
    })

    return response.data
  },

  /**
   * Generator that yields air pollution data page by page
   */
  async *list(params: AirPollutionHistoryParams & { pageSize?: number }): AsyncGenerator<ReadonlyArray<AirQualityData>> {
    const pollution = await this.getHistory(params)
    const items = pollution.list
    const pageSize = params.pageSize || items.length

    for (let i = 0; i < items.length; i += pageSize) {
      yield items.slice(i, i + pageSize)
    }
  },
})
