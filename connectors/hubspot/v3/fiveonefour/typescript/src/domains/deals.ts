import type { SendFn } from "../core/paginate";
import { makeCrudDomain } from "../core/make-crud-domain";

export function buildDealsDomain(send: SendFn) {
  const base = makeCrudDomain("/crm/v3/objects/deals", send);
  return {
    listDeals: base.list,
    getDeal: base.get,
    streamDeals: base.streamAll,
    getDeals: base.getAll,
  };
}


