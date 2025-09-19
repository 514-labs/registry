import type { Business } from "../types/connector";
import { createGlobalDomainFactory, type SendFn } from "./factory";

export function buildBusinessesDomain(sendFn: SendFn) {
  const factory = createGlobalDomainFactory<Business>("/me/businesses", sendFn);

  return {
    listBusinesses: factory.list,
    getBusiness: factory.get,
    streamBusinesses: factory.stream,
    getBusinesses: factory.getAll,
  };
}