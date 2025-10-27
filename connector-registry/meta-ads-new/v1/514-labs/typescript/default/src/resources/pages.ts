import type { Page } from '../types/connector'
import { makeGlobalMetaResource } from '../lib/make-meta-resource'
import type { SendFn } from '../lib/paginate'

/**
 * Creates the pages resource for Meta Ads API.
 *
 * Pages are global and do not require an adAccountId parameter.
 */
export const createPagesResource = (send: SendFn) =>
  makeGlobalMetaResource<Page>('/me/accounts', send)
