import type { SendFn } from '../lib/paginate'

// GA4 Data API Types
export interface DateRange {
  startDate: string // Format: YYYY-MM-DD or relative like '7daysAgo'
  endDate: string   // Format: YYYY-MM-DD or relative like 'today'
}

export interface Dimension {
  name: string // e.g., 'date', 'country', 'sessionSource'
}

export interface Metric {
  name: string // e.g., 'activeUsers', 'sessions', 'screenPageViews'
}

export interface DimensionValue {
  value?: string
  oneValue?: string
}

export interface MetricValue {
  value?: string
  oneValue?: string
}

export interface Row {
  dimensionValues?: DimensionValue[]
  metricValues?: MetricValue[]
}

export interface OrderBy {
  metric?: { metricName: string }
  dimension?: { dimensionName: string; orderType?: 'ALPHANUMERIC' | 'CASE_INSENSITIVE_ALPHANUMERIC' | 'NUMERIC' }
  pivot?: { metricName: string; pivotSelections: Array<{ dimensionName: string; dimensionValue: string }> }
  desc?: boolean
}

export interface FilterExpression {
  andGroup?: { expressions: FilterExpression[] }
  orGroup?: { expressions: FilterExpression[] }
  notExpression?: FilterExpression
  filter?: {
    fieldName: string
    stringFilter?: { matchType: string; value: string; caseSensitive?: boolean }
    inListFilter?: { values: string[]; caseSensitive?: boolean }
    numericFilter?: { operation: string; value: { int64Value?: string; doubleValue?: number } }
    betweenFilter?: { fromValue: { int64Value?: string }; toValue: { int64Value?: string } }
  }
}

export interface RunReportRequest {
  dateRanges: DateRange[]
  dimensions?: Dimension[]
  metrics?: Metric[]
  dimensionFilter?: FilterExpression
  metricFilter?: FilterExpression
  orderBys?: OrderBy[]
  limit?: number
  offset?: number
  keepEmptyRows?: boolean
  returnPropertyQuota?: boolean
}

export interface RunReportResponse {
  dimensionHeaders?: Array<{ name: string }>
  metricHeaders?: Array<{ name: string; type: string }>
  rows?: Row[]
  rowCount?: number
  metadata?: {
    currencyCode?: string
    timeZone?: string
  }
  propertyQuota?: {
    tokensPerDay?: { consumed: number; remaining: number }
    tokensPerHour?: { consumed: number; remaining: number }
  }
}

export interface Pivot {
  fieldNames: string[]
  orderBys?: OrderBy[]
  offset?: number
  limit?: number
  metricAggregations?: Array<'TOTAL' | 'MINIMUM' | 'MAXIMUM' | 'COUNT'>
}

export interface RunPivotReportRequest {
  dateRanges: DateRange[]
  dimensions?: Dimension[]
  metrics?: Metric[]
  pivots?: Pivot[]
  dimensionFilter?: FilterExpression
  metricFilter?: FilterExpression
  keepEmptyRows?: boolean
  returnPropertyQuota?: boolean
}

export interface PivotHeader {
  pivotDimensionHeaders?: Array<{ dimensionNames: string[]; dimensionValues: DimensionValue[] }>
  rowCount?: number
}

export interface RunPivotReportResponse {
  pivotHeaders?: PivotHeader[]
  dimensionHeaders?: Array<{ name: string }>
  metricHeaders?: Array<{ name: string; type: string }>
  rows?: Row[]
  metadata?: {
    currencyCode?: string
    timeZone?: string
  }
  propertyQuota?: {
    tokensPerDay?: { consumed: number; remaining: number }
    tokensPerHour?: { consumed: number; remaining: number }
  }
}

export interface BatchRunReportsRequest {
  requests: RunReportRequest[]
}

export interface BatchRunReportsResponse {
  reports: RunReportResponse[]
}

export interface BatchRunPivotReportsRequest {
  requests: RunPivotReportRequest[]
}

export interface BatchRunPivotReportsResponse {
  pivotReports: RunPivotReportResponse[]
}

export const createResource = (send: SendFn) => ({
  /**
   * Run a standard report using the GA4 Data API
   * @param propertyId - GA4 Property ID (e.g., '123456789')
   * @param request - Report request parameters
   * @returns Report response with dimensions and metrics
   */
  async runReport(propertyId: string, request: RunReportRequest): Promise<RunReportResponse> {
    const response = await send({
      method: 'POST',
      path: `/properties/${propertyId}:runReport`,
      body: request,
    })
    return response as RunReportResponse
  },

  /**
   * Run a pivot report for cross-tabulated data
   * @param propertyId - GA4 Property ID
   * @param request - Pivot report request parameters
   * @returns Pivot report response
   */
  async runPivotReport(propertyId: string, request: RunPivotReportRequest): Promise<RunPivotReportResponse> {
    const response = await send({
      method: 'POST',
      path: `/properties/${propertyId}:runPivotReport`,
      body: request,
    })
    return response as RunPivotReportResponse
  },

  /**
   * Run multiple reports in a single batch request
   * @param propertyId - GA4 Property ID
   * @param request - Batch request with multiple report requests
   * @returns Batch response with multiple reports
   */
  async batchRunReports(propertyId: string, request: BatchRunReportsRequest): Promise<BatchRunReportsResponse> {
    const response = await send({
      method: 'POST',
      path: `/properties/${propertyId}:batchRunReports`,
      body: request,
    })
    return response as unknown as BatchRunReportsResponse
  },

  /**
   * Run multiple pivot reports in a single batch request
   * @param propertyId - GA4 Property ID
   * @param request - Batch request with multiple pivot report requests
   * @returns Batch response with multiple pivot reports
   */
  async batchRunPivotReports(propertyId: string, request: BatchRunPivotReportsRequest): Promise<BatchRunPivotReportsResponse> {
    const response = await send({
      method: 'POST',
      path: `/properties/${propertyId}:batchRunPivotReports`,
      body: request,
    })
    return response as unknown as BatchRunPivotReportsResponse
  },
})
