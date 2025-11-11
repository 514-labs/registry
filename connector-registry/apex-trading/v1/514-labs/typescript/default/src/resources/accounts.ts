import { paginateOffset } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

export interface Account {
  id: string
  userId: string
  balance: string
  availableBalance: string
  lockedBalance: string
  equity: string
  totalMargin: string
  freeMargin: string
  unrealizedPnl: string
  createdAt: string
  updatedAt: string
}

export interface ListAccountsParams {
  pageSize?: number
  maxItems?: number
}

export const createResource = (send: SendFn) => ({
  async *list(params?: ListAccountsParams) {
    const { pageSize, maxItems } = params ?? {}

    yield* paginateOffset<Account>({
      send,
      path: '/accounts',
      pageSize,
      maxItems,
    })
  },

  async get(id: string): Promise<Account> {
    const response = await send<Account>({
      method: 'GET',
      path: `/accounts/${id}`,
    })
    return response.data
  },

  async getBalance(): Promise<{ balance: string; availableBalance: string; lockedBalance: string }> {
    const response = await send<any>({
      method: 'GET',
      path: '/account/balance',
    })
    return response.data
  },
})
