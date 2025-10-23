import type { SendFn } from '../lib/paginate'
import type { Dimension } from './reports'

export interface AudienceExport {
  name?: string
  audience?: string
  audienceDisplayName?: string
  dimensions?: Dimension[]
  state?: 'STATE_UNSPECIFIED' | 'CREATING' | 'ACTIVE' | 'FAILED'
  beginCreatingTime?: string
  creationQuotaTokensCharged?: number
  rowCount?: number
  errorMessage?: string
  percentageCompleted?: number
}

export interface CreateAudienceExportRequest {
  audienceExport: {
    audience: string
    dimensions?: Dimension[]
  }
}

export interface ListAudienceExportsResponse {
  audienceExports?: AudienceExport[]
  nextPageToken?: string
}

export interface AudienceDimensionValue {
  value?: string
}

export interface AudienceRow {
  dimensionValues?: AudienceDimensionValue[]
}

export interface QueryAudienceExportRequest {
  offset?: number
  limit?: number
}

export interface QueryAudienceExportResponse {
  audienceRows?: AudienceRow[]
  rowCount?: number
  audienceExport?: AudienceExport
}

export const createResource = (send: SendFn) => ({
  /**
   * Create a new audience export for later retrieval
   * @param propertyId - GA4 Property ID
   * @param request - Audience export creation request
   * @returns Created audience export
   */
  async create(propertyId: string, request: CreateAudienceExportRequest): Promise<AudienceExport> {
    const response = await send({
      method: 'POST',
      path: `/properties/${propertyId}/audienceExports`,
      body: request,
    })
    return response.data as AudienceExport
  },

  /**
   * Get configuration metadata about a specific audience export
   * @param name - Full resource name (e.g., 'properties/123/audienceExports/456')
   * @returns Audience export metadata
   */
  async get(name: string): Promise<AudienceExport> {
    const response = await send({
      method: 'GET',
      path: `/${name}`,
    })
    return response.data as AudienceExport
  },

  /**
   * List all audience exports for a property
   * @param propertyId - GA4 Property ID
   * @param pageSize - Maximum number of exports to return
   * @param pageToken - Token for pagination
   * @returns List of audience exports
   */
  async list(propertyId: string, pageSize?: number, pageToken?: string): Promise<ListAudienceExportsResponse> {
    const queryParams: Record<string, any> = {}
    if (pageSize) queryParams.pageSize = pageSize
    if (pageToken) queryParams.pageToken = pageToken

    const response = await send({
      method: 'GET',
      path: `/properties/${propertyId}/audienceExports`,
      query: queryParams,
    })
    return response.data as ListAudienceExportsResponse
  },

  /**
   * Query and retrieve the actual user data from an audience export
   * @param name - Full resource name (e.g., 'properties/123/audienceExports/456')
   * @param request - Query parameters (offset, limit)
   * @returns Audience export data rows
   */
  async query(name: string, request: QueryAudienceExportRequest): Promise<QueryAudienceExportResponse> {
    const response = await send({
      method: 'POST',
      path: `/${name}:query`,
      body: request,
    })
    return response.data as QueryAudienceExportResponse
  },
})
