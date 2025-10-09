import type { Conversion } from "../types/connector";
import { createDomainFactory, type SendFn } from "./factory";

export function buildConversionsDomain(sendFn: SendFn) {
  const factory = createDomainFactory<Conversion>("/{ad_account_id}/customconversions", sendFn);

  return {
    list: factory.list,
    get: factory.get,
    stream: factory.stream,
    getAll: factory.getAll,
  };
}