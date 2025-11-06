import type { SendFn } from '../lib/paginate'

export interface GeocodingLocation {
  name: string
  local_names?: Record<string, string>
  lat: number
  lon: number
  country: string
  state?: string
}

export interface GetGeocodingParams {
  q: string // City name, state code (only for US), country code (e.g., "London,UK")
  limit?: number // Number of locations in response (up to 5)
}

export interface GetReverseGeocodingParams {
  lat: number // Latitude
  lon: number // Longitude
  limit?: number // Number of locations in response (up to 5)
}

export interface GetZipCodeParams {
  zip: string // Zip/post code and country code (e.g., "E14,GB")
}

export interface ZipCodeLocation {
  zip: string
  name: string
  lat: number
  lon: number
  country: string
}

export const createResource = (send: SendFn) => ({
  /**
   * Get geographical coordinates by location name
   * @param params - Geocoding query parameters
   * @returns Array of matching locations
   */
  async getByLocationName(params: GetGeocodingParams): Promise<GeocodingLocation[]> {
    const response = await send({
      method: 'GET',
      path: '/geo/1.0/direct',
      query: params as any,
    })
    return response.data as GeocodingLocation[]
  },

  /**
   * Get location names by geographical coordinates (reverse geocoding)
   * @param params - Reverse geocoding query parameters
   * @returns Array of matching locations
   */
  async getByCoordinates(params: GetReverseGeocodingParams): Promise<GeocodingLocation[]> {
    const response = await send({
      method: 'GET',
      path: '/geo/1.0/reverse',
      query: params as any,
    })
    return response.data as GeocodingLocation[]
  },

  /**
   * Get geographical coordinates by zip/post code
   * @param params - Zip code query parameters
   * @returns Location data for the zip code
   */
  async getByZipCode(params: GetZipCodeParams): Promise<ZipCodeLocation> {
    const response = await send({
      method: 'GET',
      path: '/geo/1.0/zip',
      query: params as any,
    })
    return response.data as ZipCodeLocation
  },
})
