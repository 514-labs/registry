import type { SavedAudience } from '../types/connector'
import { makeMetaResource } from '../lib/make-meta-resource'
import type { SendFn } from '../lib/paginate'

/**
 * Creates the saved audiences resource for Meta Ads API.
 *
 * Saved audiences require an adAccountId and support cursor-based pagination.
 */
export const createSavedAudiencesResource = (send: SendFn) =>
  makeMetaResource<SavedAudience>('/{ad_account_id}/savedaudiences', send)
