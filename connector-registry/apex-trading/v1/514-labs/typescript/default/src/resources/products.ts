import { paginateIncremental, paginateOffset } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

export interface Product {
  id: string
  name: string
  description?: string
  category?: string
  brand?: string
  strain?: string
  thc_content?: number
  cbd_content?: number
  unit_price?: number
  unit_of_measure?: string
  available_quantity?: number
  created_at: string
  updated_at: string
}

export interface ListProductsParams {
  updated_at_from?: string  // For incremental sync
  category?: string
  brand?: string
  strain?: string
  pageSize?: number
  maxItems?: number
}

export const createResource = (send: SendFn) => ({
  async *list(params?: ListProductsParams) {
    const { pageSize, maxItems, updated_at_from, ...filters } = params ?? {}

    yield* paginateIncremental<Product>({
      send,
      path: '/products',
      query: filters,
      updatedAtFrom: updated_at_from,
      pageSize,
      maxItems,
    })
  },

  async get(id: string): Promise<Product> {
    const response = await send<Product>({
      method: 'GET',
      path: `/products/${id}`,
    })
    return response.data
  },
})
