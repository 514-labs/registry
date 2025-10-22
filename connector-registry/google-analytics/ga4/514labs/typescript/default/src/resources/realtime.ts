import type { SendFn } from '../lib/paginate'
import type { DateRange, Dimension, Metric, Row, OrderBy, FilterExpression } from './reports'

export interface MinuteRange {
  startMinutesAgo?: number
  endMinutesAgo?: number
}

export interface RunRealtimeReportRequest {
  dimensions?: Dimension[]
  metrics?: Metric[]
  dimensionFilter?: FilterExpression
  metricFilter?: FilterExpression
  limit?: number
  orderBys?: OrderBy[]
  returnPropertyQuota?: boolean
  minuteRanges?: MinuteRange[]
}

export interface RunRealtimeReportResponse {
  dimensionHeaders?: Array<{ name: string }>
  metricHeaders?: Array<{ name: string; type: string }>
  rows?: Row[]
  rowCount?: number
  propertyQuota?: {
    tokensPerDay?: { consumed: number; remaining: number }
    tokensPerHour?: { consumed: number; remaining: number }
    concurrentRequests?: { consumed: number; remaining: number }
  }
}

export const createResource = (send: SendFn) => ({
  /**
   * Run a realtime report showing events from the last 30 minutes
   * @param propertyId - GA4 Property ID
   * @param request - Realtime report request parameters
   * @returns Realtime report response
   */
  async runRealtimeReport(propertyId: string, request: RunRealtimeReportRequest): Promise<RunRealtimeReportResponse> {
    const response = await send({
      method: 'POST',
      path: `/properties/${propertyId}:runRealtimeReport`,
      body: request,
    })
    return response as RunRealtimeReportResponse
  },
})
