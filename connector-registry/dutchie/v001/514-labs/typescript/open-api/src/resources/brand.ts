// Brand resource
// - Binds to GET /brand
// - Dutchie API returns full array; we do client-side chunking only
import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import type { Brand } from '../generated/types.gen'

export const createBrandResource = (send: SendFn) => {
  return makeCrudResource<Brand, { pageSize?: number }>(
    '/brand',
    send,
  )
}


