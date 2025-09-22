import type { AdSet } from "../types/connector";
import { createDomainFactory, type SendFn } from "./factory";

export function buildAdSetsDomain(sendFn: SendFn) {
  const factory = createDomainFactory<AdSet>("/{ad_account_id}/adsets", sendFn);

  return {
    listAdSets: factory.list,
    getAdSet: factory.get,
    streamAdSets: factory.stream,
    getAdSets: factory.getAll,
  };
}