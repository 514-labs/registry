/**
 * Klaviyo Lists Resource
 * 
 * Lists are groups of profiles used for segmentation and targeting
 * API Endpoint: /api/lists/
 */
import { paginateCursor } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

/**
 * Klaviyo List attributes
 */
export interface ListAttributes {
  name: string
  created?: string
  updated?: string
}

/**
 * Klaviyo List resource
 */
export interface List {
  type: 'list'
  id: string
  attributes: ListAttributes
  links?: {
    self?: string
  }
}

/**
 * Parameters for listing lists
 */
export interface ListListsParams {
  /** Additional fields to include */
  'fields[list]'?: string
  /** Number of items per page */
  pageSize?: number
  /** Maximum total items to fetch */
  maxItems?: number
}

/**
 * Create lists resource operations
 */
export const createResource = (send: SendFn) => ({
  /**
   * List all lists
   */
  async *list(params?: ListListsParams) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginateCursor<List>({
      send,
      path: '/api/lists/',
      query: filters,
      pageSize,
      maxItems,
    })
  },

  /**
   * Get a single list by ID
   */
  async get(id: string, options?: { 'fields[list]'?: string }): Promise<List> {
    const response = await send<{ data: List }>({
      method: 'GET',
      path: `/api/lists/${id}`,
      query: options,
    })
    return response.data.data
  },
})
