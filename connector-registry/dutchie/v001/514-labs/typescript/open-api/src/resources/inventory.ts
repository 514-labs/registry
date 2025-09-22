// Inventory resource
// - Binds to GET /inventory
// - buildListQuery maps optional flags to query string (includeLabResults, includeRoomQuantities)
// - Pagination uses the default strategy (list returns arrays)
import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import type { InventoryItem } from '../generated/types.gen'

export const createInventoryResource = (send: SendFn) => {
  return makeCrudResource<InventoryItem, InventoryItem[], InventoryItem, { includeLabResults?: boolean; includeRoomQuantities?: boolean }>(
    '/inventory',
    send,
    {
      buildListQuery: (params) => ({
        ...(params?.includeLabResults !== undefined ? { includeLabResults: params.includeLabResults } : {}),
        ...(params?.includeRoomQuantities !== undefined ? { includeRoomQuantities: params.includeRoomQuantities } : {}),
      }),
    }
  )
}


