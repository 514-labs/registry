import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'

export interface InventoryLevel {
  sku?: string
  tracked?: boolean
  available?: number
  locationId?: string
  locationName?: string
  updatedAt?: string
}

export interface InventoryListParams {
  limit?: number
  mode?: 'levels' | 'items'
}

export const createInventoryResource = (send: SendFn) =>
  makeCrudResource<InventoryLevel, InventoryListParams>('/inventory', send, {
    buildListQuery: (params) => ({
      query: {
        limit: params?.limit ?? 25,
        mode: params?.mode ?? 'levels'
      }
    }),
  })
