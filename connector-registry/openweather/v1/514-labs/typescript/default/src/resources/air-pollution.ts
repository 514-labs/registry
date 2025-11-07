/**
 * Air Pollution Resource
 * 
 * Air pollution data including Air Quality Index and pollutant concentrations
 * API endpoint: /data/2.5/air_pollution
 * Documentation: https://openweathermap.org/api/air-pollution
 */
import type { SendFn } from '../lib/paginate'

/**
 * Air quality components (concentrations in μg/m³)
 */
export interface AirQualityComponents {
  /** Carbon monoxide */
  co: number
  /** Nitrogen monoxide */
  no: number
  /** Nitrogen dioxide */
  no2: number
  /** Ozone */
  o3: number
  /** Sulphur dioxide */
  so2: number
  /** Fine particles matter (< 2.5 μm) */
  pm2_5: number
  /** Coarse particulate matter (< 10 μm) */
  pm10: number
  /** Ammonia */
  nh3: number
}

/**
 * Air pollution data item
 */
export interface AirPollutionItem {
  /** Timestamp (Unix, UTC) */
  dt: number
  /** Air quality index: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor */
  main: {
    aqi: 1 | 2 | 3 | 4 | 5
  }
  /** Pollutant concentrations */
  components: AirQualityComponents
}

/**
 * Air pollution response
 */
export interface AirPollution {
  coord: {
    lon: number
    lat: number
  }
  list: AirPollutionItem[]
}

/**
 * Parameters for getting air pollution data
 */
export interface GetAirPollutionParams {
  /** Latitude */
  lat: number
  /** Longitude */
  lon: number
}

/**
 * Parameters for getting historical air pollution data
 */
export interface GetHistoricalAirPollutionParams extends GetAirPollutionParams {
  /** Start date (Unix timestamp, UTC) */
  start: number
  /** End date (Unix timestamp, UTC) */
  end: number
}

export const createResource = (send: SendFn) => ({
  /**
   * Get current air pollution data
   */
  async getCurrent(lat: number, lon: number): Promise<AirPollution> {
    const response = await send<AirPollution>({
      method: 'GET',
      path: '/data/2.5/air_pollution',
      query: { lat, lon },
    })
    return response.data
  },

  /**
   * Get air pollution forecast (up to 4 days)
   */
  async getForecast(lat: number, lon: number): Promise<AirPollution> {
    const response = await send<AirPollution>({
      method: 'GET',
      path: '/data/2.5/air_pollution/forecast',
      query: { lat, lon },
    })
    return response.data
  },

  /**
   * Get historical air pollution data
   * Historical data is available from November 27, 2020
   */
  async getHistorical(params: GetHistoricalAirPollutionParams): Promise<AirPollution> {
    const response = await send<AirPollution>({
      method: 'GET',
      path: '/data/2.5/air_pollution/history',
      query: params,
    })
    return response.data
  },
})
