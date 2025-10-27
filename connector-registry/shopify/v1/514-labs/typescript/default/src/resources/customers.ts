import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'

export interface Customer {
  id: string
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  createdAt?: string
  updatedAt?: string
  verifiedEmail?: boolean
  state?: string
  // Flattened default address fields
  address1?: string
  address2?: string
  city?: string
  province?: string
  country?: string
  zip?: string
}

export interface CustomerListParams {
  limit?: number
}

export const createCustomersResource = (send: SendFn) =>
  makeCrudResource<Customer, CustomerListParams>('/customers', send, {
    buildListQuery: (params) => ({
      query: {
        limit: params?.limit ?? 25
      }
    }),
  })
