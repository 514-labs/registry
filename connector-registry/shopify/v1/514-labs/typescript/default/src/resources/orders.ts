import { paginateCursor } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

export interface Order {
  id: number
  admin_graphql_api_id: string
  app_id: number | null
  browser_ip: string | null
  buyer_accepts_marketing: boolean
  cancel_reason: string | null
  cancelled_at: string | null
  cart_token: string | null
  checkout_id: number | null
  checkout_token: string | null
  client_details: any | null
  closed_at: string | null
  company: any | null
  confirmation_number: string | null
  confirmed: boolean
  contact_email: string | null
  created_at: string
  currency: string
  current_subtotal_price: string
  current_subtotal_price_set: PriceSet
  current_total_additional_fees_set: any | null
  current_total_discounts: string
  current_total_discounts_set: PriceSet
  current_total_duties_set: any | null
  current_total_price: string
  current_total_price_set: PriceSet
  current_total_tax: string
  current_total_tax_set: PriceSet
  customer_locale: string | null
  device_id: number | null
  discount_codes: DiscountCode[]
  email: string
  estimated_taxes: boolean
  financial_status: string
  fulfillment_status: string | null
  landing_site: string | null
  landing_site_ref: string | null
  line_items: LineItem[]
  location_id: number | null
  merchant_of_record_app_id: number | null
  name: string
  note: string | null
  note_attributes: any[]
  number: number
  order_number: number
  order_status_url: string
  original_total_additional_fees_set: any | null
  original_total_duties_set: any | null
  payment_gateway_names: string[]
  phone: string | null
  po_number: string | null
  presentment_currency: string
  processed_at: string
  reference: string | null
  referring_site: string | null
  source_identifier: string | null
  source_name: string
  source_url: string | null
  subtotal_price: string
  subtotal_price_set: PriceSet
  tags: string
  tax_exempt: boolean
  tax_lines: TaxLine[]
  taxes_included: boolean
  test: boolean
  token: string
  total_discounts: string
  total_discounts_set: PriceSet
  total_line_items_price: string
  total_line_items_price_set: PriceSet
  total_outstanding: string
  total_price: string
  total_price_set: PriceSet
  total_shipping_price_set: PriceSet
  total_tax: string
  total_tax_set: PriceSet
  total_tip_received: string
  total_weight: number
  updated_at: string
  user_id: number | null
}

export interface PriceSet {
  shop_money: Money
  presentment_money: Money
}

export interface Money {
  amount: string
  currency_code: string
}

export interface DiscountCode {
  code: string
  amount: string
  type: string
}

export interface LineItem {
  id: number
  admin_graphql_api_id: string
  attributed_staffs: any[]
  current_quantity: number
  fulfillable_quantity: number
  fulfillment_service: string
  fulfillment_status: string | null
  gift_card: boolean
  grams: number
  name: string
  price: string
  price_set: PriceSet
  product_exists: boolean
  product_id: number | null
  properties: any[]
  quantity: number
  requires_shipping: boolean
  sku: string
  taxable: boolean
  title: string
  total_discount: string
  total_discount_set: PriceSet
  variant_id: number | null
  variant_inventory_management: string | null
  variant_title: string | null
  vendor: string | null
  tax_lines: TaxLine[]
  duties: any[]
  discount_allocations: any[]
}

export interface TaxLine {
  channel_liable: boolean
  price: string
  price_set: PriceSet
  rate: number
  title: string
}

export interface ListOrdersParams {
  ids?: string
  limit?: number
  since_id?: number
  created_at_min?: string
  created_at_max?: string
  updated_at_min?: string
  updated_at_max?: string
  processed_at_min?: string
  processed_at_max?: string
  attribution_app_id?: number
  status?: 'open' | 'closed' | 'cancelled' | 'any'
  financial_status?: 'authorized' | 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'voided' | 'partially_refunded' | 'unpaid' | 'any'
  fulfillment_status?: 'shipped' | 'partial' | 'unshipped' | 'any' | 'unfulfilled'
  fields?: string
}

export const createResource = (send: SendFn) => ({
  async *list(params?: ListOrdersParams & { pageSize?: number; maxItems?: number }) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginateCursor<Order>({
      send,
      path: '/orders.json',
      query: filters,
      pageSize: pageSize ?? 50,
      maxItems,
      extractItems: (res: any) => res.orders || [],
    })
  },

  async get(id: number | string): Promise<Order> {
    const response = await send<{ order: Order }>({
      method: 'GET',
      path: `/orders/${id}.json`,
    })
    return response.data.order
  },

  async count(params?: Pick<ListOrdersParams, 'created_at_min' | 'created_at_max' | 'updated_at_min' | 'updated_at_max' | 'status' | 'financial_status' | 'fulfillment_status'>): Promise<number> {
    const response = await send<{ count: number }>({
      method: 'GET',
      path: '/orders/count.json',
      query: params,
    })
    return response.data.count
  },
})
