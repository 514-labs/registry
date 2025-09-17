import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import type { Product as Model } from '../models/product'

export const createProductsResource = (send: SendFn) => {
  return makeCrudResource<Model, Model[], Model, { isActive?: boolean; fromLastModifiedDateUTC?: string }>(
    '/products',
    send,
    {
      buildListQuery: (params) => ({
        ...(params?.isActive !== undefined ? { isActive: params.isActive } : {}),
        ...(params?.fromLastModifiedDateUTC ? { fromLastModifiedDateUTC: params.fromLastModifiedDateUTC } : {}),
      }),
    }
  )
}


