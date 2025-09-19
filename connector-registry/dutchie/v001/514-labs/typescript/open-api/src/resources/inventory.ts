import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import type { InventoryItem as Model } from '../models/inventory'

export const createInventoryResource = (send: SendFn) => {
  return makeCrudResource<Model, Model[], Model, { includeLabResults?: boolean; includeRoomQuantities?: boolean }>(
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


