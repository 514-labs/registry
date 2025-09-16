import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import type { Product as Model } from '../models/product'

export const createProductsResource = (send: SendFn) =>
  makeCrudResource<Model, Model[], Model>('/products', send)


