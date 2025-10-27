import type { SendFn } from '../lib/paginate'
import type { AdGroup } from '../generated/types.gen'

export interface AdGroupListParams {
  customerId: string  // Required for Google Ads API
  campaignId?: string
  status?: 'ENABLED' | 'PAUSED' | 'REMOVED'
}

export const createAdGroupsResource = (send: SendFn) => {
  return {
    async *getAll(
      params: AdGroupListParams & { pageSize?: number; maxItems?: number }
    ): AsyncGenerator<ReadonlyArray<AdGroup>> {
      const { customerId, campaignId, status, pageSize, maxItems } = params

      if (!customerId) {
        throw new Error('customerId is required for adGroups.getAll()')
      }

      // Build GAQL query
      let query = 'SELECT ad_group.id, ad_group.name, ad_group.status, ad_group.campaign, campaign.id FROM ad_group'

      const whereConditions: string[] = []
      if (campaignId) {
        whereConditions.push(`ad_group.campaign = 'customers/${customerId}/campaigns/${campaignId}'`)
      }
      if (status) {
        whereConditions.push(`ad_group.status = '${status}'`)
      }

      if (whereConditions.length > 0) {
        query += ' WHERE ' + whereConditions.join(' AND ')
      }

      // Google Ads API search endpoint
      const searchPath = `/customers/${customerId}/googleAds:search`

      const res = await send<{ results: AdGroup[] }>({
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
