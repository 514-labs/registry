/**
 * Klaviyo Profiles Resource
 * 
 * Profiles represent individual contacts/customers in Klaviyo
 * API Endpoint: /api/profiles/
 */
import { paginateCursor } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

/**
 * Klaviyo Profile attributes
 */
export interface ProfileAttributes {
  email?: string
  phone_number?: string
  external_id?: string
  first_name?: string
  last_name?: string
  organization?: string
  title?: string
  image?: string
  created?: string
  updated?: string
  properties?: Record<string, any>
}

/**
 * Klaviyo Profile resource
 */
export interface Profile {
  type: 'profile'
  id: string
  attributes: ProfileAttributes
  links?: {
    self?: string
  }
}

/**
 * Parameters for listing profiles
 */
export interface ListProfilesParams {
  /** Filter by email addresses */
  'filter[email]'?: string
  /** Filter by phone numbers */
  'filter[phone_number]'?: string
  /** Filter by profile IDs */
  'filter[ids]'?: string
  /** Additional fields to include */
  'fields[profile]'?: string
  /** Number of items per page */
  pageSize?: number
  /** Maximum total items to fetch */
  maxItems?: number
}

/**
 * Create profiles resource operations
 */
export const createResource = (send: SendFn) => ({
  /**
   * List profiles with optional filtering
   */
  async *list(params?: ListProfilesParams) {
    const { pageSize, maxItems, ...filters } = params ?? {}

    yield* paginateCursor<Profile>({
      send,
      path: '/api/profiles/',
      query: filters,
      pageSize,
      maxItems,
    })
  },

  /**
   * Get a single profile by ID
   */
  async get(id: string, options?: { 'fields[profile]'?: string }): Promise<Profile> {
    const response = await send<{ data: Profile }>({
      method: 'GET',
      path: `/api/profiles/${id}`,
      query: options,
    })
    return response.data.data
  },
})
