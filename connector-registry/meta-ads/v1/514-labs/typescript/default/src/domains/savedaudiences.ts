import type { SavedAudience } from "../types/connector";
import { createDomainFactory, type SendFn } from "./factory";

export function buildSavedAudiencesDomain(sendFn: SendFn) {
  const factory = createDomainFactory<SavedAudience>("/{ad_account_id}/saved_audiences", sendFn);

  return {
    list: factory.list,
    get: factory.get,
    stream: factory.stream,
    getAll: factory.getAll,
  };
}