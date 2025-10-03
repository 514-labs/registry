import type { Hook } from '../lib/hooks'
import { assert } from 'typia'
import type { Brand, ProductsGetResponses, InventoryGetResponses } from '../generated/types.gen'

type ProductArray = ProductsGetResponses[200]
type InventoryArray = InventoryGetResponses[200]

export function createTypiaValidationHooks(params?: { strict?: boolean }): { afterResponse: any[] } {
  const strict = Boolean(params?.strict)

  const validate = (path: string, data: unknown) => {
    try {
      if (path === '/brand') assert<Brand[]>(data)
      else if (path === '/products') assert<ProductArray>(data)
      else if (path === '/inventory') assert<InventoryArray>(data)
    } catch (err: any) {
      if (strict) throw err
      console.warn('[validation] non-strict validation warning:', err?.message || String(err))
    }
  }

  const after = {
    name: 'validation:afterResponse',
    execute: async (ctx: any) => {
      if (ctx.type !== 'afterResponse' || !ctx.response || !ctx.request) return
      validate(ctx.request.path, ctx.response.data)
    }
  } as any

  return { afterResponse: [after] }
}


