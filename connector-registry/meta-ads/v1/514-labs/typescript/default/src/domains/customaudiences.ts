import type { CustomAudience } from "../types/connector";
import { createDomainFactory, type SendFn } from "./factory";

export function buildCustomAudiencesDomain(sendFn: SendFn) {
  const factory = createDomainFactory<CustomAudience>("/{ad_account_id}/customaudiences", sendFn);

  return {
    list: factory.list,
    get: factory.get,
    stream: factory.stream,
    getAll: factory.getAll,
  };
}