import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import type { Ad } from '../generated/types.gen'

export interface AdListParams {
  customerId?: string
  campaignId?: string
  adGroupId?: string
  status?: 'ENABLED' | 'PAUSED' | 'REMOVED'
}

export const createAdsResource = (send: SendFn) => {
  return makeCrudResource<Ad, AdListParams>(
    '/ads',
    send,
    {
      buildListQuery: (params) => ({
        ...(params?.customerId ? { customer_id: params.customerId } : {}),
        ...(params?.campaignId ? { campaign_id: params.campaignId } : {}),
        ...(params?.adGroupId ? { ad_group_id: params.adGroupId } : {}),
        ...(params?.status ? { status: params.status } : {}),
      }),
    }
  )
}
