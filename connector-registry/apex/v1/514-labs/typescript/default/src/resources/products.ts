import { paginatePages } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

/**
 * Product resource from Apex API
 */
export interface Product {
  id: number
  [key: string]: any // Additional fields from the API
}

export interface ListProductsParams {
  /** Filter by updated_at timestamp (ISO 8601) */
  updated_at_from?: string
  /** Filter to only products with available batches */
  has_available_batches?: boolean
  /** Include sold out batches in the response */
  include_sold_out_batches?: boolean
  /** Items per page (default: 15, max: 500) */
  per_page?: number
}

export const createResource = (send: SendFn) => ({
  /**
   * List all products with pagination
   */
  async *list(params?: ListProductsParams & { pageSize?: number; maxItems?: number }) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginatePages<Product>({
      send,
      path: '/v1/products',
      query: filters,
      pageSize: pageSize ?? 15,
      maxItems,
      extractItems: (res: any) => {
        return Array.isArray(res.products) ? res.products : []
      }
    })
  },

  /**
   * Get a single product by ID
   */
  async get(productId: number): Promise<Product> {
    const response = await send<{ product: Product }>({
      method: 'GET',
      path: `/v1/products/${productId}`,
    })
    return response.data.product
  },

  /**
   * Create a new product
   */
  async create(data: Partial<Product>): Promise<Product> {
    const response = await send<{ product: Product }>({
      method: 'POST',
      path: '/v1/products',
      body: data,
    })
    return response.data.product
  },

  /**
   * Update a product
   */
  async update(productId: number, data: Partial<Product>): Promise<Product> {
    const response = await send<{ product: Product }>({
      method: 'PATCH',
      path: `/v1/products/${productId}`,
      body: data,
    })
    return response.data.product
  }
})
