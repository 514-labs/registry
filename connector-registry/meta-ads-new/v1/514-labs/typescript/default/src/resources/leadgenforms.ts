import type { LeadGenForm } from '../types/connector'
import { makeMetaResource } from '../lib/make-meta-resource'
import type { SendFn } from '../lib/paginate'

/**
 * Creates the lead gen forms resource for Meta Ads API.
 *
 * Lead gen forms require an adAccountId and support cursor-based pagination.
 */
export const createLeadGenFormsResource = (send: SendFn) =>
  makeMetaResource<LeadGenForm>('/{ad_account_id}/leadgen_forms', send)
