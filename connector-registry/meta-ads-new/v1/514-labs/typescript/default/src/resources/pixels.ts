import type { Pixel } from '../types/connector'
import { makeMetaResource } from '../lib/make-meta-resource'
import type { SendFn } from '../lib/paginate'

/**
 * Creates the pixels resource for Meta Ads API.
 *
 * Pixels require an adAccountId and support cursor-based pagination.
 */
export const createPixelsResource = (send: SendFn) =>
  makeMetaResource<Pixel>('/{ad_account_id}/adspixels', send)
