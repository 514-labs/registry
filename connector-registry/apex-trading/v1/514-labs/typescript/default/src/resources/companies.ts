import { paginateOffset } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

export interface Company {
  id: string
  name: string
  type: 'distributor' | 'retailer' | 'manufacturer' | 'cultivator'
  license_number?: string
  contact_email?: string
  contact_phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zip_code?: string
  }
  created_at: string
  updated_at: string
}

export interface ListCompaniesParams {
  type?: string
  state?: string
  pageSize?: number
  maxItems?: number
}

export const createResource = (send: SendFn) => ({
  async *list(params?: ListCompaniesParams) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginateOffset<Company>({
      send,
      path: '/companies',
      query: filters,
      pageSize,
      maxItems,
    })
  },

  async get(id: string): Promise<Company> {
    const response = await send<Company>({
      method: 'GET',
      path: `/companies/${id}`,
    })
    return response.data
  },
})
