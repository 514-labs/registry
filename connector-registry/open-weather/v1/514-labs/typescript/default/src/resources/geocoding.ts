import type { SendFn } from '../lib/paginate'

export interface LocationInfo {
  name: string
  local_names?: Record<string, string>
  lat: number
  lon: number
  country: string
  state?: string
}

export interface DirectGeocodingParams {
  /** City name, state code (US only), and country code divided by comma */
  q: string
  /** Number of locations to return (max 5) */
  limit?: number
}

export interface ReverseGeocodingParams {
  /** Latitude */
  lat: number
  /** Longitude */
  lon: number
  /** Number of locations to return (max 5) */
  limit?: number
}

export interface ZipCodeParams {
  /** Zip/post code and country code divided by comma. Example: "94040,US" */
  zip: string
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
   * Convert city name to geographic coordinates
   * @param params - City name and optional limit
   * @returns Array of location matches
   */
  async direct(params: DirectGeocodingParams): Promise<LocationInfo[]> {
    const query: Record<string, any> = {
      q: params.q,
    }

    if (params.limit) query.limit = params.limit

    const response = await send({
      method: 'GET',
      path: '/geo/1.0/direct',
      query,
    })
    return response.data as LocationInfo[]
  },

  /**
   * Convert geographic coordinates to location name
   * @param params - Latitude, longitude and optional limit
   * @returns Array of location matches
   */
  async reverse(params: ReverseGeocodingParams): Promise<LocationInfo[]> {
    const query: Record<string, any> = {
      lat: params.lat,
      lon: params.lon,
    }

    if (params.limit) query.limit = params.limit

    const response = await send({
      method: 'GET',
      path: '/geo/1.0/reverse',
      query,
    })
    return response.data as LocationInfo[]
  },

  /**
   * Get location data by zip/postal code
   * @param params - Zip code and country code
   * @returns Location data for the zip code
   */
  async byZipCode(params: ZipCodeParams): Promise<ZipCodeLocation> {
    const query: Record<string, any> = {
      zip: params.zip,
    }

    const response = await send({
      method: 'GET',
      path: '/geo/1.0/zip',
      query,
    })
    return response.data as ZipCodeLocation
  },
})
