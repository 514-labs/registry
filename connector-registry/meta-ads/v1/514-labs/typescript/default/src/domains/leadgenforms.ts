import type { LeadGenForm } from "../types/connector";
import { createGlobalDomainFactory, type SendFn } from "./factory";

export function buildLeadGenFormsDomain(sendFn: SendFn) {
  const factory = createGlobalDomainFactory<LeadGenForm>("/me/leadgen_forms", sendFn);

  return {
    list: factory.list,
    get: factory.get,
    stream: factory.stream,
    getAll: factory.getAll,
  };
}