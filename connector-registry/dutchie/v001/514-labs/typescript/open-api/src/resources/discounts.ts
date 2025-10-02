// Discounts resource
// - Binds to GET /discounts/v2/list
// - Transforms DiscountApiResponse -> DiscountApiResponseFlat at runtime (post-fetch)
// - Returns async generator of DiscountApiResponseFlat[] with client-side chunking
import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import type { Hook } from '@connector-factory/core'
import { createFlattenAfterResponseHook } from '@connector-factory/core'
import type { DiscountApiResponse } from '../generated/types.gen'
import type { DiscountApiResponseFlat } from '../generated/flat.gen'

export const createDiscountsResource = (send: SendFn, log?: (level: string, event: Record<string, unknown>) => void) => {
  const discountsTransformHook: Hook = createFlattenAfterResponseHook<DiscountApiResponse, DiscountApiResponseFlat>({ 
    delimiter: '_',
    log
  })
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


