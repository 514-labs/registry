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
  q: string // City name, state code (only for US), and country code divided by comma
  limit?: number // Number of locations in response (up to 5)
}

export interface ReverseGeocodingParams {
  lat: number
  lon: number
  limit?: number // Number of locations in response (up to 5)
}

export interface ZipGeocodingParams {
  zip: string // ZIP/post code and country code divided by comma
}

export const createResource = (send: SendFn) => ({
  /**
   * Get geographical coordinates by location name
   */
  async direct(params: DirectGeocodingParams): Promise<GeoLocation[]> {
    const query: Record<string, any> = { q: params.q }
    if (params.limit !== undefined) query.limit = params.limit

    const response = await send<GeoLocation[]>({
      method: 'GET',
      path: '/geo/1.0/direct',
      query,
    })

    return response.data
  },

  /**
   * Get location name by geographical coordinates
   */
  async reverse(params: ReverseGeocodingParams): Promise<GeoLocation[]> {
    const query: Record<string, any> = {
      lat: params.lat,
      lon: params.lon,
    }
    if (params.limit !== undefined) query.limit = params.limit

    const response = await send<GeoLocation[]>({
      method: 'GET',
      path: '/geo/1.0/reverse',
      query,
    })

    return response.data
  },

  /**
   * Get geographical coordinates by ZIP/post code
   */
  async byZip(params: ZipGeocodingParams): Promise<GeoLocation> {
    const response = await send<GeoLocation>({
      method: 'GET',
      path: '/geo/1.0/zip',
      query: { zip: params.zip },
    })

    return response.data
  },
})
