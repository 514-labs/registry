import type { CustomAudience } from '../types/connector'
import { makeMetaResource } from '../lib/make-meta-resource'
import type { SendFn } from '../lib/paginate'

/**
 * Creates the custom audiences resource for Meta Ads API.
 *
 * Custom audiences require an adAccountId and support cursor-based pagination.
 */
export const createCustomAudiencesResource = (send: SendFn) =>
  makeMetaResource<CustomAudience>('/{ad_account_id}/customaudiences', send)
