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
  buyer_company_id: number
  standard_deal_flow_id?: number | null
  buyer_stage_id?: number | null
  pricing_tier_id?: number | null
  slug: string
  buyer_type?: string
  disable_bulk_discounts: boolean
  vendor_disabled: boolean
  created_at: string
  updated_at: string
  contacts?: BuyerContact[]
  locations?: BuyerLocation[]
  notes?: any[]
  stage?: {
    id: number
    sort_order: number
    name: string
    color: string
    created_at: string
    updated_at: string
  }
  pricing_tier?: {
    id: number
    summary: string
    type: string
    percent: number
    direction: string
    exclude_from_bulk_discounts: boolean
    expiration: string
  }
  sales_reps?: any[]
  buyer_company?: {
    name: string
  }
  tags?: BuyerTag[]
}

export interface BuyerContact {
  id: number
  buyer_id: number
  name: string
  contact_preference?: string
  title?: string
  email: string
  created_at: string
  updated_at: string
  notifiable: boolean
  buyer_opted_out: boolean
  opted_in_email_sent: boolean
  last_name?: string
  locations?: BuyerLocation[]
}

export interface BuyerLocation {
  id: number
  buyer_id: number
  name: string
  line_one: string
  line_two?: string
  city: string
  state: string
  zip: string
  state_license?: string
  state_license_doc?: string
  type: string
  state_id: number
  country_id: number
  coordinates_id: number
  created_at: string
  updated_at: string
}

export interface BuyerTag {
  name: string
  color: string
  background_color: string
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
