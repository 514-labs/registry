/**
 * Klaviyo Campaigns Resource
 * 
 * Campaigns represent email marketing campaigns
 * API Endpoint: /api/campaigns/
 */
import { paginateCursor } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

/**
 * Klaviyo Campaign attributes
 */
export interface CampaignAttributes {
  name: string
  status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'canceled'
  archived?: boolean
  audiences?: {
    included?: string[]
    excluded?: string[]
  }
  send_strategy?: {
    method?: string
    options_static?: {
      datetime?: string
      is_local?: boolean
      send_past_recipients_immediately?: boolean
    }
  }
  tracking_options?: {
    is_add_utm?: boolean
    utm_params?: any[]
    is_tracking_clicks?: boolean
    is_tracking_opens?: boolean
  }
  created_at?: string
  updated_at?: string
  scheduled_at?: string
  send_time?: string
}

/**
 * Klaviyo Campaign resource
 */
export interface Campaign {
  type: 'campaign'
  id: string
  attributes: CampaignAttributes
  links?: {
    self?: string
  }
}

/**
 * Parameters for listing campaigns
 */
export interface ListCampaignsParams {
  /** Filter by campaign IDs */
  'filter[ids]'?: string
  /** Additional fields to include */
  'fields[campaign]'?: string
  /** Number of items per page */
  pageSize?: number
  /** Maximum total items to fetch */
  maxItems?: number
}

/**
 * Create campaigns resource operations
 */
export const createResource = (send: SendFn) => ({
  /**
   * List campaigns with optional filtering
   */
  async *list(params?: ListCampaignsParams) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginateCursor<Campaign>({
      send,
      path: '/api/campaigns/',
      query: filters,
      pageSize,
      maxItems,
    })
  },

  /**
   * Get a single campaign by ID
   */
  async get(id: string, options?: { 'fields[campaign]'?: string }): Promise<Campaign> {
    const response = await send<{ data: Campaign }>({
      method: 'GET',
      path: `/api/campaigns/${id}`,
      query: options,
    })
    return response.data.data
  },
})
