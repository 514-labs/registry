import type { Ad } from "../types/connector";
import { createDomainFactory, type SendFn } from "./factory";

export function buildAdsDomain(sendFn: SendFn) {
  const factory = createDomainFactory<Ad>("/{ad_account_id}/ads", sendFn);

  return {
    list: factory.list,
    get: factory.get,
    stream: factory.stream,
    getAll: factory.getAll,
  };
}