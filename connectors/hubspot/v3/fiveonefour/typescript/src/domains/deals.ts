/**
 * Deals domain
 * Binds the deals path to shared CRUD and streaming helpers; models live in `src/models/deals`.
 */
import type { SendFn } from "../core/paginate";
import { makeCrudDomain } from "../core/make-crud-domain";
import type { Deal, DealsResponse, DealResponse } from "../models/deals";

export function buildDealsDomain(send: SendFn) {
  const base = makeCrudDomain<Deal, DealsResponse, DealResponse>("/crm/v3/objects/deals", send);
  return {
    listDeals: base.list,
    getDeal: base.get,
    streamDeals: base.streamAll,
    getDeals: base.getAll,
  };
}


