import type { Ad } from '../types/connector'
import { makeMetaResource } from '../lib/make-meta-resource'
import type { SendFn } from '../lib/paginate'

/**
 * Creates the ads resource for Meta Ads API.
 *
 * Ads require an adAccountId and support cursor-based pagination.
 */
export const createAdsResource = (send: SendFn) =>
  makeMetaResource<Ad>('/{ad_account_id}/ads', send)
