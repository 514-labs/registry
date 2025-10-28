import type { AdImage } from "../types/connector";
import type { HttpResponseEnvelope } from "../types/envelopes";
import { createDomainFactory, type SendFn } from "./factory";

export function buildAdImagesDomain(sendFn: SendFn) {
  const factory = createDomainFactory<AdImage>("/{ad_account_id}/adimages", sendFn);

  return {
    list: factory.list,
    stream: factory.stream,
    getAll: factory.getAll,

    // Custom implementation for get since it uses 'hash' instead of 'id'
    async get(params: { adAccountId: string; hash: string; fields?: string[] }): Promise<HttpResponseEnvelope<AdImage>> {
      const { adAccountId, hash, fields } = params;
      const query: Record<string, any> = {};

      if (fields?.length) query.fields = fields.join(",");

      const path = `/${adAccountId}/adimages`.replace("{ad_account_id}", adAccountId);

      return sendFn({
        method: "GET",
        path: `${path}/${hash}`,
        query,
      });
    },
  };
}