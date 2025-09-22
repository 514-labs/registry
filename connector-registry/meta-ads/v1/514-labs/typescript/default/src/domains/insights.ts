import type { Insight } from "../types/connector";
import type { HttpResponseEnvelope } from "../types/envelopes";
import type { SendFn } from "./factory";

interface InsightsParams {
  objectId: string;
  level: "account" | "campaign" | "adset" | "ad";
  fields?: string[];
  timeRange?: { since: string; until: string };
  limit?: number;
  after?: string;
}

interface InsightsStreamParams {
  objectId: string;
  level: "account" | "campaign" | "adset" | "ad";
  fields?: string[];
  timeRange?: { since: string; until: string };
  pageSize?: number;
}

export function buildInsightsDomain(sendFn: SendFn) {
  const api = {
    async getInsights(params: InsightsParams): Promise<HttpResponseEnvelope<Insight[]>> {
      const { objectId, level, fields, timeRange, limit, after } = params;
      const query: Record<string, any> = { level };

      if (fields?.length) query.fields = fields.join(",");
      if (timeRange) {
        query.time_range = JSON.stringify(timeRange);
      }
      if (limit) query.limit = limit.toString();
      if (after) query.after = after;

      return sendFn({
        method: "GET",
        path: `/${objectId}/insights`,
        query,
      });
    },

    async* streamInsights(params: InsightsStreamParams): AsyncIterable<Insight> {
      const { pageSize = 25, ...requestParams } = params;
      let after: string | undefined;

      do {
        const response = await api.getInsights({
          ...requestParams,
          limit: pageSize,
          after,
        });

        if (response.data && Array.isArray(response.data)) {
          for (const item of response.data) {
            yield item;
          }
        }

        after = response.paging?.cursors?.after;
      } while (after);
    },

    async getInsightsAll(params: InsightsStreamParams & { maxItems?: number }): Promise<Insight[]> {
      const { maxItems = 1000, ...streamParams } = params;
      const items: Insight[] = [];
      let count = 0;

      for await (const item of api.streamInsights(streamParams)) {
        items.push(item);
        count++;
        if (count >= maxItems) break;
      }

      return items;
    },
  };

  return api;
}