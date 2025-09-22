// Brand resource
// - Binds to GET /brand
// - Uses offset-based pagination (limit/offset) because the API returns a simple array
// - No list query parameters are required for brands
import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import { paginateOffset } from '../lib/paginate'
import type { Brand } from '../generated/types.gen'

export const createBrandResource = (send: SendFn) => {
  return makeCrudResource<Brand, Brand[], Brand, { pageSize?: number }>(
    '/brand',
    send,
    {
      // Fetch pages until an empty page is returned
      paginate: async function* ({ send, path, pageSize }) {
        for await (const items of paginateOffset<Brand>({ send, path, pageSize })) {
          yield items
        }
      },
    }
  )
}


