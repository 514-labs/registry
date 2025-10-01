import type { AdCreative } from "../types/connector";
import { createDomainFactory, type SendFn } from "./factory";

export function buildAdCreativesDomain(sendFn: SendFn) {
  const factory = createDomainFactory<AdCreative>("/{ad_account_id}/adcreatives", sendFn);

  return {
    list: factory.list,
    get: factory.get,
    stream: factory.stream,
    getAll: factory.getAll,
  };
}