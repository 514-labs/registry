import type { SendFn } from '../lib/paginate'
import type { Campaign } from '../generated/types.gen'

export interface CampaignListParams {
  customerId: string  // Required for Google Ads API
  status?: 'ENABLED' | 'PAUSED' | 'REMOVED'
  dateFrom?: string
  dateTo?: string
}

export const createCampaignsResource = (send: SendFn) => {
  return {
    async *getAll(
      params: CampaignListParams & { pageSize?: number; maxItems?: number }
    ): AsyncGenerator<ReadonlyArray<Campaign>> {
      const { customerId, status, dateFrom, dateTo, pageSize, maxItems } = params

      if (!customerId) {
        throw new Error('customerId is required for campaigns.getAll()')
      }

      // Build GAQL query
      let query = 'SELECT campaign.id, campaign.name, campaign.status, campaign.start_date, campaign.end_date FROM campaign'

      const whereConditions: string[] = []
      if (status) {
        whereConditions.push(`campaign.status = '${status}'`)
      }
      if (dateFrom && dateTo) {
        whereConditions.push(`segments.date BETWEEN '${dateFrom}' AND '${dateTo}'`)
      }

      if (whereConditions.length > 0) {
        query += ' WHERE ' + whereConditions.join(' AND ')
      }

      // Google Ads API search endpoint
      const searchPath = `/customers/${customerId}/googleAds:search`

      const res = await send<{ results: Campaign[] }>({
        method: 'POST',
        path: searchPath,
        body: { query },
        operation: 'getAll'
      })

      const data = res.data?.results || []

      // Handle client-side pagination
      let start = 0
      let remaining = typeof maxItems === 'number' ? Math.max(0, maxItems) : undefined

      if (!pageSize || pageSize <= 0) {
        yield remaining !== undefined ? data.slice(0, remaining) : data
        return
      }

      while (start < data.length) {
        const end = Math.min(data.length, start + pageSize)
        let chunk = data.slice(start, end)
        if (remaining !== undefined) {
          if (remaining <= 0) break
          if (chunk.length > remaining) chunk = chunk.slice(0, remaining)
          remaining -= chunk.length
        }
        yield chunk
        start = end
      }
    }
  }
}
