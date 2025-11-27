import { paginateCursor } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

export interface Product {
  id: number
  title: string
  body_html: string | null
  vendor: string
  product_type: string
  created_at: string
  handle: string
  updated_at: string
  published_at: string | null
  template_suffix: string | null
  published_scope: string
  tags: string
  status: string
  admin_graphql_api_id: string
  variants: ProductVariant[]
  options: ProductOption[]
  images: ProductImage[]
  image: ProductImage | null
}

export interface ProductVariant {
  id: number
  product_id: number
  title: string
  price: string
  sku: string
  position: number
  inventory_policy: string
  compare_at_price: string | null
  fulfillment_service: string
  inventory_management: string | null
  option1: string | null
  option2: string | null
  option3: string | null
  created_at: string
  updated_at: string
  taxable: boolean
  barcode: string | null
  grams: number
  image_id: number | null
  weight: number
  weight_unit: string
  inventory_item_id: number
  inventory_quantity: number
  old_inventory_quantity: number
  requires_shipping: boolean
  admin_graphql_api_id: string
}

export interface ProductOption {
  id: number
  product_id: number
  name: string
  position: number
  values: string[]
}

export interface ProductImage {
  id: number
  product_id: number
  position: number
  created_at: string
  updated_at: string
  alt: string | null
  width: number
  height: number
  src: string
  variant_ids: number[]
  admin_graphql_api_id: string
}

export interface ListProductsParams {
  ids?: string
  limit?: number
  since_id?: number
  title?: string
  vendor?: string
  handle?: string
  product_type?: string
  status?: 'active' | 'archived' | 'draft'
  collection_id?: number
  created_at_min?: string
  created_at_max?: string
  updated_at_min?: string
  updated_at_max?: string
  published_at_min?: string
  published_at_max?: string
  published_status?: 'published' | 'unpublished' | 'any'
  fields?: string
  presentment_currencies?: string
}

export const createResource = (send: SendFn) => ({
  async *list(params?: ListProductsParams & { pageSize?: number; maxItems?: number }) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginateCursor<Product>({
      send,
      path: '/products.json',
      query: filters,
      pageSize: pageSize ?? 50,
      maxItems,
      extractItems: (res: any) => res.products || [],
    })
  },

  async get(id: number | string): Promise<Product> {
    const response = await send<{ product: Product }>({
      method: 'GET',
      path: `/products/${id}.json`,
    })
    return response.data.product
  },

  async count(params?: Pick<ListProductsParams, 'vendor' | 'product_type' | 'collection_id' | 'created_at_min' | 'created_at_max' | 'updated_at_min' | 'updated_at_max' | 'published_at_min' | 'published_at_max' | 'published_status'>): Promise<number> {
    const response = await send<{ count: number }>({
      method: 'GET',
      path: '/products/count.json',
      query: params,
    })
    return response.data.count
  },
})
