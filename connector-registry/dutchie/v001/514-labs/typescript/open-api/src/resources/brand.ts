import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import { paginateOffset } from '../lib/paginate'
import type { Brand as Model } from '../models/brand'

export const createBrandResource = (send: SendFn) => {
  const base = makeCrudResource<Model, Model[], Model>('/brand', send)
  const streamAll = async function* (params?: { pageSize?: number }) {
    for await (const items of paginateOffset<Model>({ send, path: '/brand', pageSize: params?.pageSize })) {
      for (const item of items) yield item
    }
  }
  return { ...base, streamAll }
}


