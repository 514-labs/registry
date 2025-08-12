import { paginateCursor, type SendFn } from "./paginate";

export function makeCrudDomain<TObject, TListResponse, TSingleResponse>(objectPath: string, send: SendFn) {
  const api = {
    list: (params?: { properties?: string[]; limit?: number; after?: string }) => {
      const query: Record<string, any> = {};
      if (params?.properties?.length) query.properties = params.properties.join(",");
      if (params?.limit) query.limit = params.limit;
      if (params?.after) query.after = params.after;
      return send<TListResponse>({ method: "GET", path: objectPath, query });
    },
    get: (params: { id: string; properties?: string[] }) => {
      const query: Record<string, any> = {};
      if (params?.properties?.length) query.properties = params.properties.join(",");
      return send<TSingleResponse>({ method: "GET", path: `${objectPath}/${params.id}` as const, query });
    },
    streamAll: async function* (params?: { properties?: string[]; pageSize?: number }) {
      const query: Record<string, any> = {};
      if (params?.properties?.length) query.properties = params.properties.join(",");
      for await (const items of paginateCursor<TObject>({ send, path: objectPath, query, pageSize: params?.pageSize })) {
        for (const item of items) yield item;
      }
    },
    getAll: async (params?: { properties?: string[]; pageSize?: number; maxItems?: number }) => {
      const results: TObject[] = [];
      for await (const item of api.streamAll({ properties: params?.properties, pageSize: params?.pageSize })) {
        results.push(item);
        if (params?.maxItems && results.length >= params.maxItems) break;
      }
      return results;
    },
  };
  return api;
}


