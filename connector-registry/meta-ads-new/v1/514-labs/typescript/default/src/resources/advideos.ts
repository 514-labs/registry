import type { AdVideo } from '../types/connector'
import { makeMetaResource } from '../lib/make-meta-resource'
import type { SendFn } from '../lib/paginate'

/**
 * Creates the ad videos resource for Meta Ads API.
 *
 * Ad videos require an adAccountId and support cursor-based pagination.
 */
export const createAdVideosResource = (send: SendFn) =>
  makeMetaResource<AdVideo>('/{ad_account_id}/advideos', send)
