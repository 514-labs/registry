import type { AdVideo } from "../types/connector";
import { createDomainFactory, type SendFn } from "./factory";

export function buildAdVideosDomain(sendFn: SendFn) {
  const factory = createDomainFactory<AdVideo>("/{ad_account_id}/advideos", sendFn);

  return {
    listAdVideos: factory.list,
    getAdVideo: factory.get,
    streamAdVideos: factory.stream,
    getAdVideos: factory.getAll,
  };
}