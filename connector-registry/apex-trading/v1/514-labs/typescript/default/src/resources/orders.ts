import { paginateOffset } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

export type OrderType = 'receiving' | 'shipping' | 'transporter'

export interface Order {
  id: string
  type: OrderType
  order_number: string
  company_id: string
  buyer_id?: string
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled'
  items: Array<{
    product_id: string
    batch_id?: string
    quantity: number
    unit_price: number
  }>
  total_amount: number
  created_at: string
  updated_at: string
  delivery_date?: string
}

export interface ListOrdersParams {
  type?: OrderType
  status?: string
  company_id?: string
  buyer_id?: string
  start_date?: string
  end_date?: string
  pageSize?: number
  maxItems?: number
}

export const createResource = (send: SendFn) => ({
  async *list(params?: ListOrdersParams) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginateOffset<Order>({
      send,
      path: '/orders',
      query: filters,
      pageSize,
      maxItems,
    })
  },

  async *receiving(params?: Omit<ListOrdersParams, 'type'>) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginateOffset<Order>({
      send,
      path: '/receiving-orders',
      query: filters,
      pageSize,
      maxItems,
    })
  },

  async *shipping(params?: Omit<ListOrdersParams, 'type'>) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginateOffset<Order>({
      send,
      path: '/shipping-orders',
      query: filters,
      pageSize,
      maxItems,
    })
  },

  async *transporter(params?: Omit<ListOrdersParams, 'type'>) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginateOffset<Order>({
      send,
      path: '/transporter-orders',
      query: filters,
      pageSize,
      maxItems,
    })
  },

  async get(id: string): Promise<Order> {
    const response = await send<Order>({
      method: 'GET',
      path: `/orders/${id}`,
    })
    return response.data
  },
})
