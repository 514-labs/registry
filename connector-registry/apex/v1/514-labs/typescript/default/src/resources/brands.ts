import { paginatePages } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

/**
 * Brand resource from Apex API
 */
export interface Brand {
  id: number
  name: string
  company_id: number
  summary?: string
  created_at: string
  updated_at: string
  logo_link?: string
}

export const createResource = (send: SendFn) => ({
  /**
   * List all brands with pagination
   */
  async *list(params?: { pageSize?: number; maxItems?: number }) {
    const { pageSize, maxItems } = params ?? {}

    yield* paginatePages<Brand>({
      send,
      path: '/v1/brands',
      pageSize: pageSize ?? 15,
      maxItems,
      extractItems: (res: any) => {
        return Array.isArray(res.brands) ? res.brands : []
      }
    })
  },

  /**
   * Get a single brand by ID
   */
  async get(brandId: number): Promise<Brand> {
    const response = await send<{ brand: Brand }>({
      method: 'GET',
      path: `/v1/brands/${brandId}`,
    })
    return response.data.brand
  }
})
