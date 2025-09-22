import type { HttpResponseEnvelope } from "../types/envelopes";

export type SendFn = <T = any>(args: {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, any>;
  headers?: Record<string, string>;
  body?: unknown;
  operation?: string;
}) => Promise<HttpResponseEnvelope<T>>;

export interface DomainMethods<T> {
  list(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<T[]>>;
  get(params: { adAccountId: string; id: string; fields?: string[] }): Promise<HttpResponseEnvelope<T>>;
  stream(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<T>;
  getAll(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<T[]>;
}

export interface GlobalDomainMethods<T> {
  list(params?: { fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<T[]>>;
  get(params: { id: string; fields?: string[] }): Promise<HttpResponseEnvelope<T>>;
  stream(params?: { fields?: string[]; pageSize?: number }): AsyncIterable<T>;
  getAll(params?: { fields?: string[]; pageSize?: number; maxItems?: number }): Promise<T[]>;
}

export function createDomainFactory<T>(
  basePath: string,
  sendFn: SendFn
): DomainMethods<T> {
  return {
    async list(params) {
      const { adAccountId, fields, limit, after } = params;
      const query: Record<string, any> = {};

      if (fields?.length) query.fields = fields.join(",");
      if (limit) query.limit = limit.toString();
      if (after) query.after = after;

      const path = basePath.replace("{ad_account_id}", adAccountId);

      return sendFn({
        method: "GET",
        path,
        query,
      });
    },

    async get(params) {
      const { adAccountId, id, fields } = params;
      const query: Record<string, any> = {};

      if (fields?.length) query.fields = fields.join(",");

      const path = basePath.replace("{ad_account_id}", adAccountId);

      return sendFn({
        method: "GET",
        path: `${path}/${id}`,
        query,
      });
    },

    async* stream(params) {
      const { adAccountId, fields, pageSize = 25 } = params;
      let after: string | undefined;

      do {
        const response = await this.list({
          adAccountId,
          fields,
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

    async getAll(params) {
      const { maxItems = 1000, ...streamParams } = params;
      const items: T[] = [];
      let count = 0;

      for await (const item of this.stream(streamParams)) {
        items.push(item);
        count++;
        if (count >= maxItems) break;
      }

      return items;
    },
  };
}

export function createGlobalDomainFactory<T>(
  basePath: string,
  sendFn: SendFn
): GlobalDomainMethods<T> {
  return {
    async list(params) {
      const query: Record<string, any> = {};

      if (params?.fields?.length) query.fields = params.fields.join(",");
      if (params?.limit) query.limit = params.limit.toString();
      if (params?.after) query.after = params.after;

      return sendFn({
        method: "GET",
        path: basePath,
        query,
      });
    },

    async get(params) {
      const { id, fields } = params;
      const query: Record<string, any> = {};

      if (fields?.length) query.fields = fields.join(",");

      return sendFn({
        method: "GET",
        path: `/${id}`,
        query,
      });
    },

    async* stream(params) {
      const { fields, pageSize = 25 } = params || {};
      let after: string | undefined;

      do {
        const response = await this.list({
          fields,
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

    async getAll(params) {
      const { maxItems = 1000, ...streamParams } = params || {};
      const items: T[] = [];
      let count = 0;

      for await (const item of this.stream(streamParams)) {
        items.push(item);
        count++;
        if (count >= maxItems) break;
      }

      return items;
    },
  };
}