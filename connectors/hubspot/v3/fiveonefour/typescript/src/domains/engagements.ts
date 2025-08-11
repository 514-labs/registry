import type { SendFn } from "../core/paginate";
import { paginateCursor } from "../core/paginate";

export function buildEngagementsDomain(send: SendFn) {
  const api = {
    listEngagements: (params: { objectType: "notes" | "calls" | "emails" | "meetings" | "tasks"; properties?: string[]; limit?: number; after?: string }) => {
      const { objectType } = params;
      const query: Record<string, any> = {};
      if (params?.properties?.length) query.properties = params.properties.join(",");
      if (params?.limit) query.limit = params.limit;
      if (params?.after) query.after = params.after;
      return send<{ results: any[]; paging?: any }>({ method: "GET", path: `/crm/v3/objects/${objectType}` as const, query });
    },
    getEngagement: (params: { objectType: "notes" | "calls" | "emails" | "meetings" | "tasks"; id: string; properties?: string[] }) => {
      const { objectType, id } = params;
      const query: Record<string, any> = {};
      if (params?.properties?.length) query.properties = params.properties.join(",");
      return send<any>({ method: "GET", path: `/crm/v3/objects/${objectType}/${id}` as const, query });
    },
    streamEngagements: async function* (params: { objectType: "notes" | "calls" | "emails" | "meetings" | "tasks"; properties?: string[]; pageSize?: number }) {
      const { objectType } = params;
      const query: Record<string, any> = {};
      if (params?.properties?.length) query.properties = params.properties.join(",");
      for await (const items of paginateCursor<any>({ send, path: `/crm/v3/objects/${objectType}` as const, query, pageSize: params?.pageSize })) {
        for (const item of items) yield item;
      }
    },
    getEngagements: async (params: { objectType: "notes" | "calls" | "emails" | "meetings" | "tasks"; properties?: string[]; pageSize?: number; maxItems?: number }) => {
      const results: any[] = [];
      for await (const item of api.streamEngagements(params)) {
        results.push(item);
        if (params?.maxItems && results.length >= params.maxItems) break;
      }
      return results;
    },
  };
  return api;
}


