import type { SavedAudience } from "../types/connector";
import { createDomainFactory, type SendFn } from "./factory";

export function buildSavedAudiencesDomain(sendFn: SendFn) {
  const factory = createDomainFactory<SavedAudience>("/{ad_account_id}/saved_audiences", sendFn);

  return {
    listSavedAudiences: factory.list,
    getSavedAudience: factory.get,
    streamSavedAudiences: factory.stream,
    getSavedAudiences: factory.getAll,
  };
}