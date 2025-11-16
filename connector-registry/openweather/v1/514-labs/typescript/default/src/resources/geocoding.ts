/**
 * Geocoding API
 * https://openweathermap.org/api/geocoding-api
 */
import type { SendFn } from '../lib/paginate'

export interface DirectGeocodingParams {
  q: string      // City name, state code (US only), country code
  limit?: number // Limit number of results (default 5, max 5)
}

export interface ReverseGeocodingParams {
  lat: number
  lon: number
  limit?: number // Limit number of results (default 5, max 5)
}

export interface ZipCodeGeocodingParams {
  zip: string    // Zip/post code and country code (e.g., "E14,GB" or "10001,US")
}

export interface GeocodingLocation {
  name: string
  local_names?: Record<string, string>
  lat: number
  lon: number
  country: string
  state?: string
}

export interface ZipCodeLocation {
  zip: string
  name: string
  lat: number
  lon: number
  country: string
}

export const createGeocodingResource = (send: SendFn) => ({
  /**
   * Get geographical coordinates by location name (Direct geocoding)
   */
  async getByLocationName(params: DirectGeocodingParams): Promise<GeocodingLocation[]> {
    const response = await send<GeocodingLocation[]>({
      method: 'GET',
      path: '/geo/1.0/direct',
      query: params as any,
    })
    return response.data
  },

  /**
   * Get location names by geographical coordinates (Reverse geocoding)
   */
  async getByCoordinates(params: ReverseGeocodingParams): Promise<GeocodingLocation[]> {
    const response = await send<GeocodingLocation[]>({
      method: 'GET',
      path: '/geo/1.0/reverse',
      query: params as any,
    })
    return response.data
  },

  /**
   * Get geographical coordinates by zip/post code
   */
  async getByZipCode(params: ZipCodeGeocodingParams): Promise<ZipCodeLocation> {
    const response = await send<ZipCodeLocation>({
      method: 'GET',
      path: '/geo/1.0/zip',
      query: params as any,
    })
    return response.data
  },
})
