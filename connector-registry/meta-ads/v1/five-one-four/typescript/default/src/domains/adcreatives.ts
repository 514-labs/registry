import type { AdCreative } from "../types/connector";
import { createDomainFactory, type SendFn } from "./factory";

export function buildAdCreativesDomain(sendFn: SendFn) {
  const factory = createDomainFactory<AdCreative>("/{ad_account_id}/adcreatives", sendFn);

  return {
    listAdCreatives: factory.list,
    getAdCreative: factory.get,
    streamAdCreatives: factory.stream,
    getAdCreatives: factory.getAll,
  };
}