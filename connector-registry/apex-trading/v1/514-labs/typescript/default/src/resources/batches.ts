import { paginateIncremental } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

export interface Batch {
  id: string
  product_id: string
  batch_number: string
  quantity: number
  expiration_date?: string
  test_results?: {
    thc?: number
    cbd?: number
    tested_at?: string
    lab?: string
  }
  created_at: string
  updated_at: string
}

export interface ListBatchesParams {
  updated_at_from?: string  // For incremental sync
  product_id?: string
  batch_number?: string
  pageSize?: number
  maxItems?: number
}

export const createResource = (send: SendFn) => ({
  async *list(params?: ListBatchesParams) {
    const { pageSize, maxItems, updated_at_from, ...filters } = params ?? {}

    yield* paginateIncremental<Batch>({
      send,
      path: '/batches',
      query: filters,
      updatedAtFrom: updated_at_from,
      pageSize,
      maxItems,
    })
  },

  async get(id: string): Promise<Batch> {
    const response = await send<Batch>({
      method: 'GET',
      path: `/batches/${id}`,
    })
    return response.data
  },
})
