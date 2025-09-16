import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import type { InventoryItem as Model } from '../models/inventory'

export const createInventoryResource = (send: SendFn) =>
  makeCrudResource<Model, Model[], Model>('/inventory', send)


