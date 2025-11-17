import { paginatePages } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

/**
 * Buyer Contact Log resource from Apex API
 */
export interface BuyerContactLog {
  id: number
  [key: string]: any // Additional fields from the API
}

export interface ListBuyerContactLogsParams {
  /** Filter by updated_at timestamp (ISO 8601) */
  updated_at_from?: string
  /** Items per page (default: 15, max: 500) */
  per_page?: number
  /** Filter by buyer ID */
  buyer_id?: number
}

export const createResource = (send: SendFn) => ({
  /**
   * List all buyer contact logs with pagination
   */
  async *list(params?: ListBuyerContactLogsParams & { pageSize?: number; maxItems?: number }) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginatePages<BuyerContactLog>({
      send,
      path: '/v1/buyer-contact-logs',
      query: filters,
      pageSize: pageSize ?? 15,
      maxItems,
      extractItems: (res: any) => {
        return Array.isArray(res.buyer_contact_logs) ? res.buyer_contact_logs : 
               Array.isArray(res.data) ? res.data : []
      }
    })
  },

  /**
   * Get a single buyer contact log by ID
   */
  async get(logId: number): Promise<BuyerContactLog> {
    const response = await send<{ buyer_contact_log: BuyerContactLog } | { data: BuyerContactLog }>({
      method: 'GET',
      path: `/v1/buyer-contact-log/${logId}`,
    })
    return (response.data as any).buyer_contact_log || (response.data as any).data
  }
})
