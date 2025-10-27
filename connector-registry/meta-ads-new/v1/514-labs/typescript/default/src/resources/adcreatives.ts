import type { AdCreative } from '../types/connector'
import { makeMetaResource } from '../lib/make-meta-resource'
import type { SendFn } from '../lib/paginate'

/**
 * Creates the ad creatives resource for Meta Ads API.
 *
 * Ad creatives require an adAccountId and support cursor-based pagination.
 */
export const createAdCreativesResource = (send: SendFn) =>
  makeMetaResource<AdCreative>('/{ad_account_id}/adcreatives', send)
