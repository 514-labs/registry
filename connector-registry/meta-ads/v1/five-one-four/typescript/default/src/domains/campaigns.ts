import type { Campaign } from "../types/connector";
import { createDomainFactory, type SendFn } from "./factory";

export function buildCampaignsDomain(sendFn: SendFn) {
  const factory = createDomainFactory<Campaign>("/{ad_account_id}/campaigns", sendFn);

  return {
    listCampaigns: factory.list,
    getCampaign: factory.get,
    streamCampaigns: factory.stream,
    getCampaigns: factory.getAll,
  };
}