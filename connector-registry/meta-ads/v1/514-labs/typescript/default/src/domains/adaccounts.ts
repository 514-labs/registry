import type { AdAccount } from "../types/connector";
import { createGlobalDomainFactory, type SendFn } from "./factory";

export function buildAdAccountsDomain(sendFn: SendFn) {
  const factory = createGlobalDomainFactory<AdAccount>("/me/adaccounts", sendFn);

  return {
    list: factory.list,
    stream: factory.stream,
    getAll: factory.getAll,
  };
}