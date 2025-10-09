import type { AdSet } from "../types/connector";
import { createDomainFactory, type SendFn } from "./factory";

export function buildAdSetsDomain(sendFn: SendFn) {
  const factory = createDomainFactory<AdSet>("/{ad_account_id}/adsets", sendFn);

  return {
    list: factory.list,
    get: factory.get,
    stream: factory.stream,
    getAll: factory.getAll,
  };
}