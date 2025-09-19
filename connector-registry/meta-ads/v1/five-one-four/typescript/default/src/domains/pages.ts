import type { Page } from "../types/connector";
import { createGlobalDomainFactory, type SendFn } from "./factory";

export function buildPagesDomain(sendFn: SendFn) {
  const factory = createGlobalDomainFactory<Page>("/me/accounts", sendFn);

  return {
    listPages: factory.list,
    getPage: factory.get,
    streamPages: factory.stream,
    getPages: factory.getAll,
  };
}