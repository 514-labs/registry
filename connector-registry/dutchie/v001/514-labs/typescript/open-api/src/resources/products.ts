// Products resource
// - Binds to GET /products
// - buildListQuery maps typed params to query string (isActive, fromLastModifiedDateUTC)
// - Dutchie API returns full array; we do client-side chunking only
import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import type { ProductDetail } from '../generated/types.gen'

export const createProductsResource = (send: SendFn) => {
  return makeCrudResource<ProductDetail, { isActive?: boolean; fromLastModifiedDateUTC?: string }>(
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


