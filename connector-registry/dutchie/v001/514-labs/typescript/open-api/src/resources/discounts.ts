// Discounts resource
// - Binds to GET /discounts/v2/list
// - Transforms DiscountApiResponse -> DiscountApiResponseFlat at runtime (post-fetch)
// - Returns async generator of DiscountApiResponseFlat[] with client-side chunking
import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import type { Hook } from '@connector-factory/core'
import { createMapArrayAfterResponseHook } from '@connector-factory/core'
import type { DiscountApiResponse } from '../generated/types.gen'
import type { DiscountApiResponseFlat } from '../generated/flat.gen'

function mapDiscountApiResponseToFlat(raw: DiscountApiResponse): DiscountApiResponseFlat {
  const flat: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(raw)) {
    if (value === null || value === undefined) continue
    if (typeof value !== 'object' || Array.isArray(value)) flat[key] = value
  }
  const flatten = (parent: string, obj: unknown) => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) flat[`${parent}_${k}`] = v
  }
  flatten('reward', raw.reward)
  flatten('menuDisplay', raw.menuDisplay)
  flatten('paymentRestrictions', raw.paymentRestrictions)
  return flat as DiscountApiResponseFlat
}

const discountsTransformHook: Hook = createMapArrayAfterResponseHook<DiscountApiResponse, DiscountApiResponseFlat>(mapDiscountApiResponseToFlat)

export const createDiscountsResource = (send: SendFn) => {
  return makeCrudResource<DiscountApiResponseFlat, { includeInactive?: boolean; includeInclusionExclusionData?: boolean, includePaymentRestrictions?: boolean }>(
    '/discounts/v2/list',
    send,
    {
      buildListQuery: (params) => ({
        ...(params?.includeInactive !== undefined ? { includeInactive: params.includeInactive } : {}),
        ...(params?.includeInclusionExclusionData !== undefined ? { includeInclusionExclusionData: params.includeInclusionExclusionData } : {}),
        ...(params?.includePaymentRestrictions !== undefined ? { includePaymentRestrictions: params.includePaymentRestrictions } : {}),
      }),
      resourceHooks: { afterResponse: [discountsTransformHook] },
    }
  )
}


