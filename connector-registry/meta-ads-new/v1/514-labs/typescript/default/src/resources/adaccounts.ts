import type { AdAccount } from '../types/connector'
import { makeGlobalMetaResource } from '../lib/make-meta-resource'
import type { SendFn } from '../lib/paginate'

/**
 * Creates the ad accounts resource for Meta Ads API.
 *
 * Ad accounts are global and do not require an adAccountId parameter.
 */
export const createAdAccountsResource = (send: SendFn) =>
  makeGlobalMetaResource<AdAccount>('/me/adaccounts', send)
