import type { Page } from "../types/connector";
import { createGlobalDomainFactory, type SendFn } from "./factory";

export function buildPagesDomain(sendFn: SendFn) {
  const factory = createGlobalDomainFactory<Page>("/me/accounts", sendFn);

  return {
    list: factory.list,
    get: factory.get,
    stream: factory.stream,
    getAll: factory.getAll,
  };
}