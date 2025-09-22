import type { Ad } from "../types/connector";
import { createDomainFactory, type SendFn } from "./factory";

export function buildAdsDomain(sendFn: SendFn) {
  const factory = createDomainFactory<Ad>("/{ad_account_id}/ads", sendFn);

  return {
    listAds: factory.list,
    getAd: factory.get,
    streamAds: factory.stream,
    getAds: factory.getAll,
  };
}