import { paginatePages } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

/**
 * Buyer resource from Apex API
 */
export interface Buyer {
  id: number
  uuid: string
  name: string
  owning_company_id: number
  disabled: boolean
  standard_deal_flow_id?: number
  buyer_stage_id?: number
  pricing_tier_id?: number
  slug: string
  net_terms_id?: number
  quickbooks_customer_id?: number
  buyer_type?: string
  disable_bulk_discounts: boolean
  vendor_disabled: boolean
  created_at: string
  updated_at: string
}

export interface ListBuyersParams {
  /** Filter by updated_at timestamp (ISO 8601) */
  updated_at_from?: string
  /** Items per page (default: 15, max: 500) */
  per_page?: number
}

export const createResource = (send: SendFn) => ({
  /**
   * List all buyers with pagination
   */
  async *list(params?: ListBuyersParams & { pageSize?: number; maxItems?: number }) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginatePages<Buyer>({
      send,
      path: '/v1/buyers',
      query: filters,
      pageSize: pageSize ?? 15,
      maxItems,
      extractItems: (res: any) => {
        return Array.isArray(res.buyers) ? res.buyers : []
      }
    })
  },

  /**
   * Get a single buyer by ID
   */
  async get(buyerId: number): Promise<Buyer> {
    const response = await send<{ buyer: Buyer }>({
      method: 'GET',
      path: `/v1/buyers/${buyerId}`,
    })
    return response.data.buyer
  }
})
