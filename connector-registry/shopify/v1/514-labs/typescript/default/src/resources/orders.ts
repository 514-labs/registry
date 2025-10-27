import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'

export interface Order {
  // Core order information
  id: string
  name?: string
  orderNumber?: number
  createdAt?: string
  updatedAt?: string
  processedAt?: string
  cancelledAt?: string
  closedAt?: string

  // Financial information
  totalPrice?: number
  subtotalPrice?: number
  totalTax?: number
  totalDiscounts?: number
  currency?: string
  presentmentCurrency?: string

  // Status information
  financialStatus?: string
  fulfillmentStatus?: string
  confirmationNumber?: string

  // Customer information
  customerId?: string
  customerEmail?: string
  customerPhone?: string

  // Billing address (flattened)
  billingAddress1?: string
  billingAddress2?: string
  billingCity?: string
  billingProvince?: string
  billingCountry?: string
  billingZip?: string

  // Shipping address (flattened)
  shippingAddress1?: string
  shippingAddress2?: string
  shippingCity?: string
  shippingProvince?: string
  shippingCountry?: string
  shippingZip?: string

  // Order metadata
  test?: boolean
  tags?: string
  note?: string
  sourceName?: string
  referringSite?: string

  // Line items summary
  totalLineItemsQuantity?: number
  lineItemsCount?: number
}

export interface OrderListParams {
  limit?: number
  status?: 'any' | 'open' | 'closed' | 'cancelled'
}

export const createOrdersResource = (send: SendFn) =>
  makeCrudResource<Order, OrderListParams>('/orders', send, {
    buildListQuery: (params) => ({
      limit: params?.limit ?? 25,
      status: params?.status ?? 'any'
    }),
  })
