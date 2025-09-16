import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import type { InventoryItem as Model } from '../models/inventory'

export const createInventoryResource = (send: SendFn) => {
  const base = makeCrudResource<Model, Model[], Model>('/inventory', send)
  const list = (params?: { includeLabResults?: boolean; includeRoomQuantities?: boolean }) =>
    send<Model[]>({ method: 'GET', path: '/inventory', query: params as any })
  return { ...base, list }
}


