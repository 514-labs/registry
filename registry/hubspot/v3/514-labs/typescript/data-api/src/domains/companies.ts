/**
 * Companies domain
 * Binds the companies path to shared CRUD and streaming helpers; models live in `src/models/companies`.
 */
import type { SendFn } from "../core/paginate";
import { makeCrudDomain } from "../core/make-crud-domain";
import type { Company, CompaniesResponse, CompanyResponse } from "../models/companies";

export function buildCompaniesDomain(send: SendFn) {
  const base = makeCrudDomain<Company, CompaniesResponse, CompanyResponse>("/crm/v3/objects/companies", send);
  return {
    listCompanies: base.list,
    getCompany: base.get,
    streamCompanies: base.streamAll,
    getCompanies: base.getAll,
  };
}


