import type { Campaign } from "../types/connector";
import { createDomainFactory, type SendFn } from "./factory";

export function buildCampaignsDomain(sendFn: SendFn) {
  const factory = createDomainFactory<Campaign>("/{ad_account_id}/campaigns", sendFn);

  return {
    list: factory.list,
    get: factory.get,
    stream: factory.stream,
    getAll: factory.getAll,
  };
}