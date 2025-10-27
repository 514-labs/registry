import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import type { Keyword } from '../generated/types.gen'

export interface KeywordListParams {
  customerId?: string
  campaignId?: string
  adGroupId?: string
  status?: 'ENABLED' | 'PAUSED' | 'REMOVED'
}

export const createKeywordsResource = (send: SendFn) => {
  return makeCrudResource<Keyword, KeywordListParams>(
    '/keywords',
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
