import type { SendFn } from '../lib/paginate'
import type { Dimension, Metric } from './reports'

export interface DimensionMetadata {
  apiName?: string
  uiName?: string
  description?: string
  deprecatedApiNames?: string[]
  customDefinition?: boolean
  category?: string
}

export interface MetricMetadata {
  apiName?: string
  uiName?: string
  description?: string
  deprecatedApiNames?: string[]
  type?: 'TYPE_INTEGER' | 'TYPE_FLOAT' | 'TYPE_SECONDS' | 'TYPE_MILLISECONDS' | 'TYPE_MINUTES' | 'TYPE_HOURS' | 'TYPE_STANDARD' | 'TYPE_CURRENCY' | 'TYPE_FEET' | 'TYPE_MILES' | 'TYPE_METERS' | 'TYPE_KILOMETERS'
  expression?: string
  customDefinition?: boolean
  category?: string
}

export interface GetMetadataResponse {
  dimensions?: DimensionMetadata[]
  metrics?: MetricMetadata[]
  name?: string
}

export interface CheckCompatibilityRequest {
  dimensions?: Dimension[]
  metrics?: Metric[]
  dimensionFilter?: any
  metricFilter?: any
  compatibilityFilter?: 'COMPATIBILITY_UNSPECIFIED' | 'COMPATIBLE' | 'INCOMPATIBLE'
}

export interface DimensionCompatibility {
  dimensionMetadata?: DimensionMetadata
  compatibility?: 'COMPATIBILITY_UNSPECIFIED' | 'COMPATIBLE' | 'INCOMPATIBLE'
}

export interface MetricCompatibility {
  metricMetadata?: MetricMetadata
  compatibility?: 'COMPATIBILITY_UNSPECIFIED' | 'COMPATIBLE' | 'INCOMPATIBLE'
}

export interface CheckCompatibilityResponse {
  dimensionCompatibilities?: DimensionCompatibility[]
  metricCompatibilities?: MetricCompatibility[]
}

export const createResource = (send: SendFn) => ({
  /**
   * Get metadata for all dimensions and metrics available for reporting
   * @param propertyId - GA4 Property ID
   * @returns Metadata response with dimension and metric definitions
   */
  async getMetadata(propertyId: string): Promise<GetMetadataResponse> {
    const response = await send({
      method: 'GET',
      path: `/properties/${propertyId}/metadata`,
    })
    return response as GetMetadataResponse
  },

  /**
   * Check compatibility between dimensions, metrics, and filters
   * @param propertyId - GA4 Property ID
   * @param request - Compatibility check request
   * @returns Compatibility response
   */
  async checkCompatibility(propertyId: string, request: CheckCompatibilityRequest): Promise<CheckCompatibilityResponse> {
    const response = await send({
      method: 'POST',
      path: `/properties/${propertyId}:checkCompatibility`,
      body: request,
    })
    return response as CheckCompatibilityResponse
  },
})
