import { paginateCursor } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

export interface Customer {
  id: number
  email: string
  accepts_marketing: boolean
  created_at: string
  updated_at: string
  first_name: string
  last_name: string
  state: string
  note: string | null
  verified_email: boolean
  multipass_identifier: string | null
  tax_exempt: boolean
  phone: string | null
  email_marketing_consent: EmailMarketingConsent | null
  sms_marketing_consent: SmsMarketingConsent | null
  tags: string
  currency: string
  accepts_marketing_updated_at: string
  marketing_opt_in_level: string | null
  tax_exemptions: string[]
  admin_graphql_api_id: string
  default_address?: Address
  addresses?: Address[]
}

export interface EmailMarketingConsent {
  state: string
  opt_in_level: string
  consent_updated_at: string | null
}

export interface SmsMarketingConsent {
  state: string
  opt_in_level: string
  consent_updated_at: string | null
  consent_collected_from: string
}

export interface Address {
  id?: number
  customer_id?: number
  first_name: string | null
  last_name: string | null
  company: string | null
  address1: string
  address2: string | null
  city: string
  province: string | null
  country: string
  zip: string
  phone: string | null
  name: string
  province_code: string | null
  country_code: string
  country_name: string
  default: boolean
}

export interface ListCustomersParams {
  ids?: string
  limit?: number
  since_id?: number
  created_at_min?: string
  created_at_max?: string
  updated_at_min?: string
  updated_at_max?: string
  fields?: string
}

export const createResource = (send: SendFn) => ({
  async *list(params?: ListCustomersParams & { pageSize?: number; maxItems?: number }) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginateCursor<Customer>({
      send,
      path: '/customers.json',
      query: filters,
      pageSize: pageSize ?? 50,
      maxItems,
      extractItems: (res: any) => res.customers || [],
    })
  },

  async get(id: number | string): Promise<Customer> {
    const response = await send<{ customer: Customer }>({
      method: 'GET',
      path: `/customers/${id}.json`,
    })
    return response.data.customer
  },

  async count(): Promise<number> {
    const response = await send<{ count: number }>({
      method: 'GET',
      path: '/customers/count.json',
    })
    return response.data.count
  },

  async search(params: { query: string; limit?: number; fields?: string }): Promise<Customer[]> {
    const response = await send<{ customers: Customer[] }>({
      method: 'GET',
      path: '/customers/search.json',
      query: params,
    })
    return response.data.customers
  },
})
