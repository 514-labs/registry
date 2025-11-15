import type { SendFn } from '../lib/paginate'

export interface AirQualityComponents {
  co: number
  no: number
  no2: number
  o3: number
  so2: number
  pm2_5: number
  pm10: number
  nh3: number
}

export interface AirQualityData {
  dt: number
  main: {
    aqi: number
  }
  components: AirQualityComponents
}

export interface AirPollutionResponse {
  coord: {
    lon: number
    lat: number
  }
  list: AirQualityData[]
}

export interface AirPollutionParams {
  /** Latitude */
  lat: number
  /** Longitude */
  lon: number
}

export interface HistoricalAirPollutionParams extends AirPollutionParams {
  /** Start date (unix timestamp, UTC timezone) */
  start: number
  /** End date (unix timestamp, UTC timezone) */
  end: number
}

export const createResource = (send: SendFn) => ({
  /**
   * Get current air pollution data
   * @param params - Location coordinates
   * @returns Current air quality data
   */
  async getCurrent(params: AirPollutionParams): Promise<AirPollutionResponse> {
    const query = {
      lat: params.lat,
      lon: params.lon,
    }

    const response = await send({
      method: 'GET',
      path: '/data/2.5/air_pollution',
      query,
    })
    return response.data as AirPollutionResponse
  },

  /**
   * Get forecasted air pollution data
   * @param params - Location coordinates
   * @returns Forecasted air quality data
   */
  async getForecast(params: AirPollutionParams): Promise<AirPollutionResponse> {
    const query = {
      lat: params.lat,
      lon: params.lon,
    }

    const response = await send({
      method: 'GET',
      path: '/data/2.5/air_pollution/forecast',
      query,
    })
    return response.data as AirPollutionResponse
  },

  /**
   * Get historical air pollution data
   * @param params - Location coordinates and time range
   * @returns Historical air quality data
   */
  async getHistory(params: HistoricalAirPollutionParams): Promise<AirPollutionResponse> {
    const query = {
      lat: params.lat,
      lon: params.lon,
      start: params.start,
      end: params.end,
    }

    const response = await send({
      method: 'GET',
      path: '/data/2.5/air_pollution/history',
      query,
    })
    return response.data as AirPollutionResponse
  },
})
