import { paginatePages } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

/**
 * Product resource from Apex API
 */
export interface Product {
  id: number
  uuid: string
  name: string
  featured: boolean
  list_to_buyers: boolean
  list_to_clearinghouse: boolean
  description: string
  brand_id: number
  product_sku: string
  product_category_id: number
  product_type_id: number
  product_unit_measurement_id: number
  units_per_package: number
  units_per_case: number
  gram_per_preroll?: number
  feminized: boolean
  sold_as: string
  for_pets: boolean
  archived: boolean
  predominate_canabinoid_id: number
  for_distributors: boolean
  for_retailers: boolean
  for_wholesalers: boolean
  listing_price: string
  listing_price_base_unit: string
  pto_oneg_listing_price: string
  pto_twog_listing_price: string
  pto_eighthoz_listing_price: string
  pto_quarteroz_listing_price: string
  pto_halfoz_listing_price: string
  pto_oneoz_listing_price: string
  pto_quarterpound_listing_price: string
  pto_halfpound_listing_price: string
  pto_onepound_listing_price: string
  created_at: string
  updated_at: string
  brand: {
    id: number
    name: string
  }
  category: {
    id: number
    name: string
    short_display_name: string
    long_display_name: string
  }
  product_type: {
    id: number
    name: string
    product_category_id: number
    company_id: number
  }
  unit_measurement: {
    name: string
    alias: string
  }
  predominate_canabinoid: {
    id: number
    name: string
    abbreviation: string
    display_name: string
  }
  images: ProductImage[]
  government_agencies: any[]
  additives: any[]
  environmental_issues: any[]
}

export interface ProductImage {
  id: number
  sort_order: number
  link: string
  created_at: string
}

export interface ListProductsParams {
  /** Filter by updated_at timestamp (ISO 8601) */
  updated_at_from?: string
  /** Filter to only products with available batches */
  has_available_batches?: boolean
  /** Include sold out batches in the response */
  include_sold_out_batches?: boolean
  /** Items per page (default: 15, max: 500) */
  per_page?: number
}

export const createResource = (send: SendFn) => ({
  /**
   * List all products with pagination
   */
  async *list(params?: ListProductsParams & { pageSize?: number; maxItems?: number }) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginatePages<Product>({
      send,
      path: '/v1/products',
      query: filters,
      pageSize: pageSize ?? 15,
      maxItems,
      extractItems: (res: any) => {
        return Array.isArray(res.products) ? res.products : []
      }
    })
  },

  /**
   * Get a single product by ID
   */
  async get(productId: number): Promise<Product> {
    const response = await send<{ product: Product }>({
      method: 'GET',
      path: `/v1/products/${productId}`,
    })
    return response.data.product
  },

  /**
   * Create a new product
   */
  async create(data: Partial<Product>): Promise<Product> {
    const response = await send<{ product: Product }>({
      method: 'POST',
      path: '/v1/products',
      body: data,
    })
    return response.data.product
  },

  /**
   * Update a product
   */
  async update(productId: number, data: Partial<Product>): Promise<Product> {
    const response = await send<{ product: Product }>({
      method: 'PATCH',
      path: `/v1/products/${productId}`,
      body: data,
    })
    return response.data.product
  }
})
