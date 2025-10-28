import type { AdLabel } from "../types/connector";
import { createDomainFactory, type SendFn } from "./factory";

export function buildAdLabelsDomain(sendFn: SendFn) {
  const factory = createDomainFactory<AdLabel>("/{ad_account_id}/adlabels", sendFn);

  return {
    list: factory.list,
    get: factory.get,
    stream: factory.stream,
    getAll: factory.getAll,
  };
}