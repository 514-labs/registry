import { paginateOffset } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

export interface Order {
  id: string
  clientOrderId?: string
  accountId: string
  symbol: string
  side: 'BUY' | 'SELL'
  type: 'LIMIT' | 'MARKET' | 'STOP_LIMIT' | 'STOP_MARKET'
  price?: string
  quantity: string
  filledQuantity: string
  status: 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED' | 'REJECTED' | 'EXPIRED'
  timeInForce?: 'GTC' | 'IOC' | 'FOK'
  createdAt: string
  updatedAt: string
}

export interface ListOrdersParams {
  symbol?: string
  status?: 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED' | 'REJECTED' | 'EXPIRED'
  side?: 'BUY' | 'SELL'
  startTime?: string
  endTime?: string
  pageSize?: number
  maxItems?: number
}

export interface CreateOrderParams {
  symbol: string
  side: 'BUY' | 'SELL'
  type: 'LIMIT' | 'MARKET' | 'STOP_LIMIT' | 'STOP_MARKET'
  quantity: string
  price?: string
  stopPrice?: string
  timeInForce?: 'GTC' | 'IOC' | 'FOK'
  clientOrderId?: string
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

  async get(orderId: string): Promise<Order> {
    const response = await send<Order>({
      method: 'GET',
      path: `/orders/${orderId}`,
    })
    return response.data
  },

  async create(params: CreateOrderParams): Promise<Order> {
    const response = await send<Order>({
      method: 'POST',
      path: '/orders',
      body: params,
    })
    return response.data
  },

  async cancel(orderId: string): Promise<Order> {
    const response = await send<Order>({
      method: 'DELETE',
      path: `/orders/${orderId}`,
    })
    return response.data
  },

  async cancelAll(symbol?: string): Promise<{ canceledCount: number }> {
    const response = await send<{ canceledCount: number }>({
      method: 'DELETE',
      path: '/orders',
      query: symbol ? { symbol } : undefined,
    })
    return response.data
  },
})
