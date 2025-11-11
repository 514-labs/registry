import { paginateOffset } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

export interface Trade {
  id: string
  orderId: string
  symbol: string
  side: 'BUY' | 'SELL'
  price: string
  quantity: string
  fee: string
  feeAsset: string
  isMaker: boolean
  createdAt: string
}

export interface ListTradesParams {
  symbol?: string
  orderId?: string
  startTime?: string
  endTime?: string
  pageSize?: number
  maxItems?: number
}

export const createResource = (send: SendFn) => ({
  async *list(params?: ListTradesParams) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginateOffset<Trade>({
      send,
      path: '/trades',
      query: filters,
      pageSize,
      maxItems,
    })
  },

  async get(tradeId: string): Promise<Trade> {
    const response = await send<Trade>({
      method: 'GET',
      path: `/trades/${tradeId}`,
    })
    return response.data
  },

  async *history(params?: ListTradesParams) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginateOffset<Trade>({
      send,
      path: '/trades/history',
      query: filters,
      pageSize,
      maxItems,
    })
  },
})
