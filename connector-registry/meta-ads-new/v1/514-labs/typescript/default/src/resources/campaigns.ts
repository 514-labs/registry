import type { Campaign } from '../types/connector'
import { makeMetaResource } from '../lib/make-meta-resource'
import type { SendFn } from '../lib/paginate'

/**
 * Creates the campaigns resource for Meta Ads API.
 *
 * Campaigns require an adAccountId and support cursor-based pagination.
 */
export const createCampaignsResource = (send: SendFn) =>
  makeMetaResource<Campaign>('/{ad_account_id}/campaigns', send)
