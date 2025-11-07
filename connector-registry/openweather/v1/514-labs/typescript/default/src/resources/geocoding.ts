/**
 * Geocoding Resource
 * 
 * Convert location names to geographic coordinates and vice versa
 * API endpoint: /geo/1.0
 * Documentation: https://openweathermap.org/api/geocoding-api
 */
import type { SendFn } from '../lib/paginate'

/**
 * Location data from geocoding
 */
export interface Location {
  /** Name of the location */
  name: string
  /** Local names in different languages (if available) */
  local_names?: Record<string, string>
  /** Latitude */
  lat: number
  /** Longitude */
  lon: number
  /** Country code (ISO 3166) */
  country: string
  /** State (for US locations) */
  state?: string
}

/**
 * Parameters for direct geocoding (location name to coordinates)
 */
export interface DirectGeocodingParams {
  /** Location name, state code (US only) and country code divided by comma */
  q: string
  /** Number of locations to return (max 5, default 1) */
  limit?: number
}

/**
 * Parameters for reverse geocoding (coordinates to location name)
 */
export interface ReverseGeocodingParams {
  /** Latitude */
  lat: number
  /** Longitude */
  lon: number
  /** Number of locations to return (max 5, default 1) */
  limit?: number
}

/**
 * Parameters for geocoding by zip code
 */
export interface ZipCodeGeocodingParams {
  /** Zip/post code and country code divided by comma */
  zip: string
}

/**
 * Zip code location data
 */
export interface ZipCodeLocation {
  zip: string
  name: string
  lat: number
  lon: number
  country: string
}

export const createResource = (send: SendFn) => ({
  /**
   * Direct geocoding - convert location name to coordinates
   * Returns array of locations that match the query
   */
  async direct(query: string, limit?: number): Promise<Location[]> {
    const response = await send<Location[]>({
      method: 'GET',
      path: '/geo/1.0/direct',
      query: { q: query, limit },
    })
    return response.data
  },

  /**
   * Reverse geocoding - convert coordinates to location name
   * Returns array of locations at or near the coordinates
   */
  async reverse(lat: number, lon: number, limit?: number): Promise<Location[]> {
    const response = await send<Location[]>({
      method: 'GET',
      path: '/geo/1.0/reverse',
      query: { lat, lon, limit },
    })
    return response.data
  },

  /**
   * Geocoding by zip/post code
   * Returns location data for the zip code
   */
  async byZipCode(zip: string, countryCode?: string): Promise<ZipCodeLocation> {
    const zipParam = countryCode ? `${zip},${countryCode}` : zip
    const response = await send<ZipCodeLocation>({
      method: 'GET',
      path: '/geo/1.0/zip',
      query: { zip: zipParam },
    })
    return response.data
  },
})
