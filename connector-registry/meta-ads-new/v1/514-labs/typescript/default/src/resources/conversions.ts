import type { Conversion } from '../types/connector'
import { makeMetaResource } from '../lib/make-meta-resource'
import type { SendFn } from '../lib/paginate'

/**
 * Creates the conversions resource for Meta Ads API.
 *
 * Conversions require an adAccountId and support cursor-based pagination.
 */
export const createConversionsResource = (send: SendFn) =>
  makeMetaResource<Conversion>('/{ad_account_id}/customconversions', send)
