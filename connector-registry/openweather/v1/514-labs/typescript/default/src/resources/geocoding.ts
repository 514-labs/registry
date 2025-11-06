import type { SendFn } from '../lib/paginate'

export interface GeoLocation {
  name: string
  local_names?: Record<string, string>
  lat: number
  lon: number
  country: string
  state?: string
}

export interface DirectGeocodingParams {
  q: string // City name, state code (US only), and country code divided by comma
  limit?: number // Number of locations (up to 5)
}

export interface ReverseGeocodingParams {
  lat: number
  lon: number
  limit?: number // Number of locations (up to 5)
}

export interface ZipGeocodingParams {
  zip: string // ZIP/post code and country code divided by comma
}

export const createResource = (send: SendFn) => ({
  /**
   * Get geographic coordinates by location name
   * @param params - Location query parameters
   * @returns Array of matching locations
   */
  async direct(params: DirectGeocodingParams): Promise<GeoLocation[]> {
    const response = await send<GeoLocation[]>({
      method: 'GET',
      path: '/geo/1.0/direct',
      query: params as Record<string, any>,
      operation: 'direct',
    })
    return response.data
  },

  /**
   * Get location name by geographic coordinates
   * @param params - Coordinate parameters
   * @returns Array of matching locations
   */
  async reverse(params: ReverseGeocodingParams): Promise<GeoLocation[]> {
    const response = await send<GeoLocation[]>({
      method: 'GET',
      path: '/geo/1.0/reverse',
      query: params as Record<string, any>,
      operation: 'reverse',
    })
    return response.data
  },

  /**
   * Get geographic coordinates by ZIP/postal code
   * @param params - ZIP code parameters
   * @returns Location data
   */
  async zip(params: ZipGeocodingParams): Promise<GeoLocation> {
    const response = await send<GeoLocation>({
      method: 'GET',
      path: '/geo/1.0/zip',
      query: params as Record<string, any>,
      operation: 'zip',
    })
    return response.data
  },
})
