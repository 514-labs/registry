import type { AdLabel } from '../types/connector'
import { makeMetaResource } from '../lib/make-meta-resource'
import type { SendFn } from '../lib/paginate'

/**
 * Creates the ad labels resource for Meta Ads API.
 *
 * Ad labels require an adAccountId and support cursor-based pagination.
 */
export const createAdLabelsResource = (send: SendFn) =>
  makeMetaResource<AdLabel>('/{ad_account_id}/adlabels', send)
