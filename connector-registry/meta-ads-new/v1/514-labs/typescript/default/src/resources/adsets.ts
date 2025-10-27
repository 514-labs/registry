import type { AdSet } from '../types/connector'
import { makeMetaResource } from '../lib/make-meta-resource'
import type { SendFn } from '../lib/paginate'

/**
 * Creates the ad sets resource for Meta Ads API.
 *
 * Ad sets require an adAccountId and support cursor-based pagination.
 */
export const createAdSetsResource = (send: SendFn) =>
  makeMetaResource<AdSet>('/{ad_account_id}/adsets', send)
