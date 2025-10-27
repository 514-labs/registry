import type { Business } from '../types/connector'
import { makeGlobalMetaResource } from '../lib/make-meta-resource'
import type { SendFn } from '../lib/paginate'

/**
 * Creates the businesses resource for Meta Ads API.
 *
 * Businesses are global and do not require an adAccountId parameter.
 */
export const createBusinessesResource = (send: SendFn) =>
  makeGlobalMetaResource<Business>('/me/businesses', send)
