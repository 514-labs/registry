import type { SendFn } from '../lib/paginate'

/**
 * Location data from OpenWeatherMap Geocoding API
 * See: https://openweathermap.org/api/geocoding-api
 */
export interface GeocodingLocation {
  name: string
  local_names?: Record<string, string>
  lat: number
  lon: number
  country: string
  state?: string
}

export interface ReverseGeocodingQueryParams {
  lat: number      // Latitude (required)
  lon: number      // Longitude (required)
  limit?: number   // Number of results (max 5, default 1)
}

export interface DirectGeocodingQueryParams {
  q: string        // City name, state code, country code (e.g., "London", "London,GB")
  limit?: number   // Number of results (max 5, default 5)
}

export interface ZipGeocodingQueryParams {
  zip: string      // Zip/post code and country code divided by comma (e.g., "94040,US")
}

export const createResource = (send: SendFn) => ({
  /**
   * Get geographic coordinates by city name
   * @param params - City name and optional limit
   * @returns Array of matching locations with coordinates
   */
  async getByLocationName(params: DirectGeocodingQueryParams): Promise<GeocodingLocation[]> {
    const response = await send<GeocodingLocation[]>({
      method: 'GET',
      path: '/geo/1.0/direct',
      query: params as any,
      operation: 'geocoding.getByLocationName'
    })
    return response.data
  },

  /**
   * Get location name by geographic coordinates (reverse geocoding)
   * @param params - Latitude, longitude and optional limit
   * @returns Array of locations at the given coordinates
   */
  async getByCoordinates(params: ReverseGeocodingQueryParams): Promise<GeocodingLocation[]> {
    const response = await send<GeocodingLocation[]>({
      method: 'GET',
      path: '/geo/1.0/reverse',
      query: params as any,
      operation: 'geocoding.getByCoordinates'
    })
    return response.data
  },

  /**
   * Get geographic coordinates by ZIP/postal code
   * @param params - ZIP code and country code
   * @returns Location data for the given ZIP code
   */
  async getByZipCode(params: ZipGeocodingQueryParams): Promise<GeocodingLocation> {
    const response = await send<GeocodingLocation>({
      method: 'GET',
      path: '/geo/1.0/zip',
      query: params as any,
      operation: 'geocoding.getByZipCode'
    })
    return response.data
  }
})
