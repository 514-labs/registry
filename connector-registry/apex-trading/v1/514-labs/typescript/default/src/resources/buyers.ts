import { paginateOffset } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

export interface Buyer {
  id: string
  company_id: string
  name: string
  email?: string
  phone?: string
  purchase_history?: {
    total_orders: number
    total_spent: number
    last_purchase_date?: string
  }
  created_at: string
  updated_at: string
}

export interface ListBuyersParams {
  company_id?: string
  pageSize?: number
  maxItems?: number
}

export const createResource = (send: SendFn) => ({
  async *list(params?: ListBuyersParams) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginateOffset<Buyer>({
      send,
      path: '/buyers',
      query: filters,
      pageSize,
      maxItems,
    })
  },

  async get(id: string): Promise<Buyer> {
    const response = await send<Buyer>({
      method: 'GET',
      path: `/buyers/${id}`,
    })
    return response.data
  },
})
