import { paginateCursor, type SendFn } from "./paginate";

/**
 * makeCrudDomain
 *
 * Role in architecture:
 * - Creates a thin CRUD surface for a HubSpot CRM object path using the shared
 *   paginator and the connector's transport (`send`).
 * - Used by files in `src/domains/*` to bind a concrete API path and model types
 *   without duplicating request/pagination logic.
 *
 * Generics
 * - TObject: item model (e.g., `Contact`, `Company`)
 * - TListResponse: list API contract (e.g., `ContactsResponse`)
 * - TSingleResponse: single API contract (e.g., `ContactResponse`)
 *
 * Parameters
 * - objectPath: HubSpot REST path for the object (e.g., `/crm/v3/objects/contacts`)
 * - send: transport function provided by the connector that applies retries,
 *   rate‑limits, auth, and hooks.
 */
export function makeCrudDomain<TObject, TListResponse, TSingleResponse>(objectPath: string, send: SendFn) {
  const api = {
    // GET /objects with properties/limit/after
    list: (params?: { properties?: string[]; limit?: number; after?: string }) => {
      const query: Record<string, any> = {};
      if (params?.properties?.length) query.properties = params.properties.join(",");
      if (params?.limit) query.limit = params.limit;
      if (params?.after) query.after = params.after;
      return send<TListResponse>({ method: "GET", path: objectPath, query });
    },
    // GET /objects/{id} with optional properties
    get: (params: { id: string; properties?: string[] }) => {
      const query: Record<string, any> = {};
      if (params?.properties?.length) query.properties = params.properties.join(",");
      return send<TSingleResponse>({ method: "GET", path: `${objectPath}/${params.id}` as const, query });
    },
    // Async iterator over all items using cursor pagination
    streamAll: async function* (params?: { properties?: string[]; pageSize?: number }) {
      const query: Record<string, any> = {};
      if (params?.properties?.length) query.properties = params.properties.join(",");
      for await (const items of paginateCursor<TObject>({ send, path: objectPath, query, pageSize: params?.pageSize })) {
        for (const item of items) yield item;
      }
    },
    // Collect items into an array with an optional max cap
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


