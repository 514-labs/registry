import { paginatePages } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

/**
 * Shipping Order resource from Apex API
 */
export interface ShippingOrder {
  id: number
  uuid: string
  invoice_number: string
  subtotal: string
  total: string
  excise_tax: string
  excise_tax_percentage: number | null
  additional_discount: string
  delivery_cost: string
  cultivation_tax: string
  cultivation_tax_percentage: number | null
  order_date: string
  created_by: string
  operation_id: number | null
  order_status_id: number
  cancelled: boolean
  deal_flow_id: number | null
  net_terms_id: number | null
  pricing_tier_id: number | null
  delivery_date: string | null
  due_date: string | null
  estimated_departure_date: string | null
  estimated_arrival_date: string | null
  manifest_number: string | null
  invoice_note: string | null
  shipping_method: string | null
  ship_name: string | null
  ship_line_one: string | null
  ship_line_two: string | null
  ship_city: string | null
  ship_state: string | null
  ship_zip: string | null
  ship_country: string | null
  ship_from_name: string | null
  ship_from_line_one: string | null
  ship_from_line_two: string | null
  ship_from_city: string | null
  ship_from_state: string | null
  ship_from_zip: string | null
  ship_from_country: string | null
  turnaround_time: string | null
  ship_tracking_number: string | null
  ship_receiving_details: string | null
  total_payments: string
  total_credits: string
  payment_status: string
  payments_currently_due: string
  total_write_offs: string
  total_trades: string
  backorder: boolean
  backorder_status: string | null
  buyer_note: string | null
  seller_company_id: number
  buyer_id: number
  buyer_company_id: number
  buyer_contact_name: string | null
  buyer_contact_phone: string | null
  buyer_contact_email: string | null
  buyer_state_license: string | null
  buyer_location_id: number | null
  created_at: string
  updated_at: string
  transporters: any[]
  buyer: {
    id: number
    name: string
  }
  order_status: {
    id: number
    name: string
    payment_percentage: number
    archived: boolean
    position: number
    parent_status: {
      id: number
      name: string
    }
  }
  sales_reps: any[]
}

export interface ListShippingOrdersParams {
  /** Filter by updated_at timestamp (ISO 8601) - REQUIRED */
  updated_at_from: string
  /** Filter by updated_at before timestamp (ISO 8601) */
  updated_at_to?: string
  /** Filter by created_at timestamp (ISO 8601) */
  created_at_from?: string
  /** Filter by created_at before timestamp (ISO 8601) */
  created_at_to?: string
  /** Filter by order IDs */
  ids?: number[]
  /** Filter by invoice number */
  invoice_number?: string
  /** Filter by buyer IDs */
  buyer_ids?: number[]
  /** Filter by cancelled status */
  cancelled?: boolean
  /** Filter by order status IDs */
  order_status_ids?: number[]
  /** Include order items in response */
  with_items?: boolean
  /** Include payments in response */
  with_payments?: boolean
  /** Items per page (default: 15, max: 500) */
  per_page?: number
}

export interface GetShippingOrderParams {
  /** Include order history */
  with_history?: boolean
  /** Include deal flow information */
  with_deal_flow?: boolean
}

export const createResource = (send: SendFn) => ({
  /**
   * List all shipping orders with pagination
   * Note: updated_at_from is REQUIRED
   */
  async *list(params: ListShippingOrdersParams & { pageSize?: number; maxItems?: number }) {
    const { pageSize, maxItems, ids, buyer_ids, order_status_ids, ...filters } = params

    // Build query with array parameters
    const query: any = { ...filters }
    if (ids) {
      ids.forEach((id, index) => {
        query[`ids[${index}]`] = id
      })
    }
    if (buyer_ids) {
      buyer_ids.forEach((id, index) => {
        query[`buyer_ids[${index}]`] = id
      })
    }
    if (order_status_ids) {
      order_status_ids.forEach((id, index) => {
        query[`order_status_ids[${index}]`] = id
      })
    }

    yield* paginatePages<ShippingOrder>({
      send,
      path: '/v1/shipping-orders',
      query,
      pageSize: pageSize ?? 15,
      maxItems,
      extractItems: (res: any) => {
        return Array.isArray(res.orders) ? res.orders : []
      }
    })
  },

  /**
   * Get a single shipping order by ID
   */
  async get(orderId: number, params?: GetShippingOrderParams): Promise<ShippingOrder> {
    const response = await send<{ order: ShippingOrder }>({
      method: 'GET',
      path: `/v1/shipping-orders/${orderId}`,
      query: params
    })
    return response.data.order
  }
})
