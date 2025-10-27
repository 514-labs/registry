import type { AdImage } from '../types/connector'
import { makeMetaResource } from '../lib/make-meta-resource'
import type { SendFn } from '../lib/paginate'
import type { HttpResponseEnvelope } from '../types/envelopes'

/**
 * Creates the ad images resource for Meta Ads API.
 *
 * Ad images require an adAccountId and support cursor-based pagination.
 * Note: Ad images use 'hash' instead of 'id' for identifying individual images.
 */
export const createAdImagesResource = (send: SendFn) => {
  const base = makeMetaResource<AdImage>('/{ad_account_id}/adimages', send)

  return {
    list: base.list,
    stream: base.stream,
    getAll: base.getAll,

    // Override get method to use 'hash' instead of 'id'
    async get(params: {
      adAccountId: string
      hash: string
      fields?: string[]
    }): Promise<HttpResponseEnvelope<AdImage>> {
      return base.get({
        adAccountId: params.adAccountId,
        id: params.hash,  // Map hash to id for the base method
        fields: params.fields
      })
    }
  }
}
