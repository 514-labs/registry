// Products resource
// - Binds to GET /products
// - buildListQuery maps typed params to query string (isActive, fromLastModifiedDateUTC)
// - Pagination uses the default cursor strategy in makeCrudResource (no override needed here)
import { makeCrudResource } from '../lib/make-resource'
import { paginateOffset, type SendFn } from '../lib/paginate'
import type { ProductDetail } from '../generated/types.gen'

export const createProductsResource = (send: SendFn) => {
  return makeCrudResource<ProductDetail, ProductDetail[], ProductDetail, { isActive?: boolean; fromLastModifiedDateUTC?: string }>(
    '/products',
    send,
    {
      buildListQuery: (params) => ({
        ...(params?.isActive !== undefined ? { isActive: params.isActive } : {}),
        ...(params?.fromLastModifiedDateUTC ? { fromLastModifiedDateUTC: params.fromLastModifiedDateUTC } : {}),
      }),
      paginate: async function* ({ send: s, path, query, pageSize }) {
        for await (const items of paginateOffset<ProductDetail>({ send: s, path, query, pageSize })) {
          yield items
        }
      },
    }
  )
}


