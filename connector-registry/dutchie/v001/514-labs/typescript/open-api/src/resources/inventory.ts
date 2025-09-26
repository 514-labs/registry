// Inventory resource
// - Binds to GET /inventory
// - buildListQuery maps typed params to query string (includeLabResults, includeRoomQuantities)
// - Dutchie API returns full array; we do client-side chunking only
import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import type { InventoryItem } from '../generated/types.gen'

export const createInventoryResource = (send: SendFn) => {
  return makeCrudResource<InventoryItem, { includeLabResults?: boolean; includeRoomQuantities?: boolean }>(
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


