import type { SendFn } from '../lib/paginate'

export interface GeocodingLocation {
  name: string
  local_names?: Record<string, string>
  lat: number
  lon: number
  country: string
  state?: string
}

export interface ReverseGeocodingLocation {
  name: string
  local_names?: Record<string, string>
  lat: number
  lon: number
  country: string
  state?: string
}

export interface GeocodingParams {
  q: string       // City name, state code (US only), and country code divided by comma
  limit?: number  // Number of locations in response (up to 5)
}

export interface ReverseGeocodingParams {
  lat: number
  lon: number
  limit?: number  // Number of locations in response (default 1, max 5)
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
   * Get geographic coordinates by location name (forward geocoding).
   * @param query - City name, state code (US only), and country code divided by comma.
   *                Examples: "London", "London,UK", "New York,NY,US"
   * @param limit - Number of locations in response (up to 5, default 1)
   */
  async forward(query: string, limit?: number): Promise<GeocodingLocation[]> {
    const response = await send<GeocodingLocation[]>({
      method: 'GET',
      path: '/geo/1.0/direct',
      query: { q: query, limit: limit ?? 1 },
    })
    return response.data
  },

  /**
   * Get location name by geographic coordinates (reverse geocoding).
   * @param lat - Latitude
   * @param lon - Longitude
   * @param limit - Number of locations in response (default 1, max 5)
   */
  async reverse(lat: number, lon: number, limit?: number): Promise<ReverseGeocodingLocation[]> {
    const response = await send<ReverseGeocodingLocation[]>({
      method: 'GET',
      path: '/geo/1.0/reverse',
      query: { lat, lon, limit: limit ?? 1 },
    })
    return response.data
  },

  /**
   * Get location data by ZIP/post code.
   * @param zip - ZIP/post code and country code divided by comma.
   *              Examples: "10001,US", "E14,GB"
   */
  async byZipCode(zip: string): Promise<ZipCodeLocation> {
    const response = await send<ZipCodeLocation>({
      method: 'GET',
      path: '/geo/1.0/zip',
      query: { zip },
    })
    return response.data
  },
})
