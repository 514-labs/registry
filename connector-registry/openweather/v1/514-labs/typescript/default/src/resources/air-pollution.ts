import type { SendFn } from '../lib/paginate'

export interface AirQualityComponents {
  co: number      // Carbon monoxide, μg/m3
  no: number      // Nitrogen monoxide, μg/m3
  no2: number     // Nitrogen dioxide, μg/m3
  o3: number      // Ozone, μg/m3
  so2: number     // Sulphur dioxide, μg/m3
  pm2_5: number   // Fine particles matter, μg/m3
  pm10: number    // Coarse particulate matter, μg/m3
  nh3: number     // Ammonia, μg/m3
}

export interface AirQualityData {
  main: {
    aqi: number   // Air Quality Index: 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
  }
  components: AirQualityComponents
  dt: number      // Date and time, Unix, UTC
}

export interface AirPollutionResponse {
  coord: {
    lon: number
    lat: number
  }
  list: AirQualityData[]
}

export interface AirPollutionParams {
  lat: number
  lon: number
  // For historical data
  start?: number  // Start date (unix time, UTC time zone)
  end?: number    // End date (unix time, UTC time zone)
}

export const createResource = (send: SendFn) => ({
  /**
   * Get current air pollution data for specified coordinates.
   */
  async getCurrent(lat: number, lon: number): Promise<AirPollutionResponse> {
    const response = await send<AirPollutionResponse>({
      method: 'GET',
      path: '/data/2.5/air_pollution',
      query: { lat, lon },
    })
    return response.data
  },

  /**
   * Get forecasted air pollution data for specified coordinates.
   */
  async getForecast(lat: number, lon: number): Promise<AirPollutionResponse> {
    const response = await send<AirPollutionResponse>({
      method: 'GET',
      path: '/data/2.5/air_pollution/forecast',
      query: { lat, lon },
    })
    return response.data
  },

  /**
   * Get historical air pollution data for specified coordinates and time period.
   * @param lat - Latitude
   * @param lon - Longitude
   * @param start - Start date (unix time, UTC time zone)
   * @param end - End date (unix time, UTC time zone)
   */
  async getHistorical(lat: number, lon: number, start: number, end: number): Promise<AirPollutionResponse> {
    const response = await send<AirPollutionResponse>({
      method: 'GET',
      path: '/data/2.5/air_pollution/history',
      query: { lat, lon, start, end },
    })
    return response.data
  },
})
