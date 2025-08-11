import type { SendFn } from "../core/paginate";
import { makeCrudDomain } from "../core/make-crud-domain";

export function buildCompaniesDomain(send: SendFn) {
  const base = makeCrudDomain("/crm/v3/objects/companies", send);
  return {
    listCompanies: base.list,
    getCompany: base.get,
    streamCompanies: base.streamAll,
    getCompanies: base.getAll,
  };
}


