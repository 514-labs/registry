import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import { paginateOffset } from '../lib/paginate'
import type { Brand as Model } from '../models/brand'

export const createBrandResource = (send: SendFn) => {
  return makeCrudResource<Model, Model[], Model, { pageSize?: number }>(
    '/brand',
    send,
    {
      paginate: async function* ({ send, path, pageSize }) {
        for await (const items of paginateOffset<Model>({ send, path, pageSize })) {
          yield items
        }
      },
    }
  )
}


