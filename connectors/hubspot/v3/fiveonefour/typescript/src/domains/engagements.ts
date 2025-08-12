/**
 * Engagements domain (activities)
 *
 * Why the `objectType` union?
 * - In HubSpot CRM v3, activity records are modeled as separate CRM objects that
 *   share the same REST shape and pagination semantics but live under different
 *   object types: `notes`, `calls`, `emails`, `meetings`, and `tasks`.
 * - The endpoints are `/crm/v3/objects/{objectType}` and `/crm/v3/objects/{objectType}/{id}`.
 * - Constraining `objectType` to this union catches typos at compile time and
 *   documents the set of supported engagement types.
 * - https://developers.hubspot.com/docs/guides/api/crm/engagements/engagement-details
 *
 * Contrast with fixed domains (contacts/companies/deals/tickets): those bind a
 * constant path (e.g., `/crm/v3/objects/contacts`). Engagements are parameterized
 * by `objectType`, but the CRUD/pagination behavior remains identical.
 */
import type { SendFn } from "../core/paginate";
import { paginateCursor } from "../core/paginate";
import type { Engagement, EngagementsResponse, EngagementResponse } from "../models/engagements";

export function buildEngagementsDomain(send: SendFn) {
  const api = {
    listEngagements: (params: { objectType: "notes" | "calls" | "emails" | "meetings" | "tasks"; properties?: string[]; limit?: number; after?: string }) => {
      const { objectType } = params;
      const query: Record<string, any> = {};
      if (params?.properties?.length) query.properties = params.properties.join(",");
      if (params?.limit) query.limit = params.limit;
      if (params?.after) query.after = params.after;
      return send<EngagementsResponse>({ method: "GET", path: `/crm/v3/objects/${objectType}` as const, query });
    },
    getEngagement: (params: { objectType: "notes" | "calls" | "emails" | "meetings" | "tasks"; id: string; properties?: string[] }) => {
      const { objectType, id } = params;
      const query: Record<string, any> = {};
      if (params?.properties?.length) query.properties = params.properties.join(",");
      return send<EngagementResponse>({ method: "GET", path: `/crm/v3/objects/${objectType}/${id}` as const, query });
    },
    streamEngagements: async function* (params: { objectType: "notes" | "calls" | "emails" | "meetings" | "tasks"; properties?: string[]; pageSize?: number }) {
      const { objectType } = params;
      const query: Record<string, any> = {};
      if (params?.properties?.length) query.properties = params.properties.join(",");
      for await (const items of paginateCursor<Engagement>({ send, path: `/crm/v3/objects/${objectType}` as const, query, pageSize: params?.pageSize })) {
        for (const item of items) yield item;
      }
    },
    getEngagements: async (params: { objectType: "notes" | "calls" | "emails" | "meetings" | "tasks"; properties?: string[]; pageSize?: number; maxItems?: number }) => {
      const results: Engagement[] = [];
      for await (const item of api.streamEngagements(params)) {
        results.push(item);
        if (params?.maxItems && results.length >= params.maxItems) break;
      }
      return results;
    },
  };
  return api;
}


