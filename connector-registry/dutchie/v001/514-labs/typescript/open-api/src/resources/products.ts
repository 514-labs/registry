import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import type { Product as Model } from '../models/product'

export const createProductsResource = (send: SendFn) => {
  const base = makeCrudResource<Model, Model[], Model>('/products', send)
  const list = (params?: { fromLastModifiedDateUTC?: string; isActive?: boolean }) =>
    send<Model[]>({ method: 'GET', path: '/products', query: params as any })
  return { ...base, list }
}


