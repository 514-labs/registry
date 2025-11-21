import { paginatePages } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

/**
 * Batch resource from Apex API (v2)
 */
export interface Batch {
  id: number
  uuid: string
  name: string
  product_id: number
  operation_id: number
  unlimited_quantity: boolean
  quantity: number
  thc_limit: boolean
  hold: boolean
  back_order: boolean
  predominate_canabinoid_unit: string
  minimum_sales_price: string
  minimum_sales_price_base_unit: string
  sample_price: string
  cost_of_goods: string
  true_cost: string
  listing_price: string
  listing_price_base_unit: string
  pto_oneg_listing_price: string
  pto_twog_listing_price: string
  pto_eighthoz_listing_price: string
  pto_quarteroz_listing_price: string
  pto_halfoz_listing_price: string
  pto_oneoz_listing_price: string
  pto_quarterpound_listing_price: string
  pto_halfpound_listing_price: string
  pto_onepound_listing_price: string
  unit_price?: {
    message: string
  }
  archived: boolean
  allow_samples: boolean
  track_sample_quantity: boolean
  pull_sample_from_alternative_batch_id: number
  restricted: boolean
  created_at: string
  updated_at: string
  documents: BatchDocument[]
  operation: {
    id: number
    name: string
    state_license: string
  }
  terpenes: Terpene[]
  cannabinoids: Cannabinoid[]
}

export interface BatchDocument {
  id: number
  name: string
  label: string
}

export interface Terpene {
  id: number
  name: string
  value?: string | number
}

export interface Cannabinoid {
  id: number
  name: string
  abbreviation?: string
  value?: string | number
}

export interface ListBatchesParams {
  /** Filter by updated_at timestamp (ISO 8601) */
  updated_at_from?: string
  /** Items per page (default: 15, max: 500) */
  per_page?: number
}

export const createResource = (send: SendFn) => ({
  /**
   * List all batches with pagination (v2 endpoint)
   */
  async *list(params?: ListBatchesParams & { pageSize?: number; maxItems?: number }) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginatePages<Batch>({
      send,
      path: '/v2/batches',
      query: filters,
      pageSize: pageSize ?? 15,
      maxItems,
      extractItems: (res: any) => {
        // V2 endpoint returns { batches: [...] }
        return Array.isArray(res.batches) ? res.batches : []
      }
    })
  },

  /**
   * Get a single batch by ID (v2 endpoint)
   */
  async get(batchId: number): Promise<Batch> {
    const response = await send<{ batch: Batch }>({
      method: 'GET',
      path: `/v2/batches/${batchId}`,
    })
    return response.data.batch
  },

  /**
   * Create a new batch (v2 endpoint)
   */
  async create(data: Partial<Batch>): Promise<Batch> {
    const response = await send<{ batch: Batch }>({
      method: 'POST',
      path: '/v2/batches',
      body: data,
    })
    return response.data.batch
  },

  /**
   * Update a batch (v2 endpoint)
   */
  async update(batchId: number, data: Partial<Batch>): Promise<Batch> {
    const response = await send<{ batch: Batch }>({
      method: 'PATCH',
      path: `/v2/batches/${batchId}`,
      body: data,
    })
    return response.data.batch
  }
})
