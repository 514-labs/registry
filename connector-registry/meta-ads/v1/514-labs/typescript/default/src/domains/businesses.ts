import type { Business } from "../types/connector";
import { createGlobalDomainFactory, type SendFn } from "./factory";

export function buildBusinessesDomain(sendFn: SendFn) {
  const factory = createGlobalDomainFactory<Business>("/me/businesses", sendFn);

  return {
    list: factory.list,
    get: factory.get,
    stream: factory.stream,
    getAll: factory.getAll,
  };
}