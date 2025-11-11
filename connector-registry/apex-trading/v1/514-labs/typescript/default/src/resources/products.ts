import { paginateOffset } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

export interface Product {
  id: string
  symbol: string
  baseAsset: string
  quoteAsset: string
  status: 'TRADING' | 'HALT' | 'BREAK'
  baseAssetPrecision: number
  quoteAssetPrecision: number
  minPrice: string
  maxPrice: string
  tickSize: string
  minQuantity: string
  maxQuantity: string
  stepSize: string
  minNotional: string
}

export interface ListProductsParams {
  symbol?: string
  status?: 'TRADING' | 'HALT' | 'BREAK'
  pageSize?: number
  maxItems?: number
}

export interface Ticker {
  symbol: string
  lastPrice: string
  priceChange: string
  priceChangePercent: string
  volume: string
  quoteVolume: string
  openPrice: string
  highPrice: string
  lowPrice: string
  timestamp: string
}

export interface OrderBook {
  symbol: string
  bids: Array<[string, string]>  // [price, quantity]
  asks: Array<[string, string]>  // [price, quantity]
  timestamp: string
}

export interface PublicTrade {
  id: string
  price: string
  quantity: string
  timestamp: string
  isBuyerMaker: boolean
}

export const createResource = (send: SendFn) => ({
  async *list(params?: ListProductsParams) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginateOffset<Product>({
      send,
      path: '/products',
      query: filters,
      pageSize,
      maxItems,
    })
  },

  async get(symbol: string): Promise<Product> {
    const response = await send<Product>({
      method: 'GET',
      path: `/products/${symbol}`,
    })
    return response.data
  },

  async getTicker(symbol: string): Promise<Ticker> {
    const response = await send<Ticker>({
      method: 'GET',
      path: '/ticker',
      query: { symbol },
    })
    return response.data
  },

  async getOrderBook(symbol: string, limit?: number): Promise<OrderBook> {
    const response = await send<OrderBook>({
      method: 'GET',
      path: '/depth',
      query: { symbol, limit },
    })
    return response.data
  },

  async *getRecentTrades(symbol: string, limit?: number) {
    const response = await send<PublicTrade[]>({
      method: 'GET',
      path: '/trades',
      query: { symbol, limit },
    })
    
    const trades = Array.isArray(response.data) ? response.data : []
    yield trades
  },
})

