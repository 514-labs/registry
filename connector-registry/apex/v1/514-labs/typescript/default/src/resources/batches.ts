// TODO: Replace Model with your resource type (see CONNECTOR_GUIDE.md Phase 5)
// TODO: Implement pagination using paginateOffset/paginateCursor from '../lib/paginate'
// TODO: Map your API's query parameters in buildListQuery
import { paginatePages } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

/**
 * Batch resource from Apex API (v2)
 */
export interface Batch {
  id: number
  [key: string]: any // Additional fields from the API
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
