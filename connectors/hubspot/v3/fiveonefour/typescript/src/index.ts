import type { HubSpotConnector } from "./types/connector";
import type { ConnectorConfig } from "./types/config";
import type { HttpResponseEnvelope } from "./types/envelopes";
import { withDerivedDefaults } from "./config/defaults";
import { Client as HubSpotClient } from "@hubspot/api-client";
// Strong SDK object types (property bag remains dynamic in the SDK)
import type { SimplePublicObject as ContactObject } from "@hubspot/api-client/lib/codegen/crm/contacts";
import type { SimplePublicObject as CompanyObject } from "@hubspot/api-client/lib/codegen/crm/companies";
import type { SimplePublicObject as DealObject } from "@hubspot/api-client/lib/codegen/crm/deals";
import type { SimplePublicObject as TicketObject } from "@hubspot/api-client/lib/codegen/crm/tickets";
import { mapContact, type HubSpotContact } from "./models/contact";
import { mapCompany, type HubSpotCompany } from "./models/company";
import { mapDeal, type HubSpotDeal } from "./models/deal";
import { mapTicket, type HubSpotTicket } from "./models/ticket";

type Page<T> = { results: T[]; paging?: any };

export class HubSpotApiConnector implements HubSpotConnector {
  private config?: ConnectorConfig;
  private connected = false;
  private client?: HubSpotClient;

  initialize(userConfig: ConnectorConfig) {
    this.config = withDerivedDefaults(userConfig);
    if (this.config.auth.type === "bearer") {
      const token = this.config.auth.bearer?.token;
      if (!token) throw new Error("Missing bearer token");
      this.client = new HubSpotClient({ accessToken: token });
    } else if (this.config.auth.type === "oauth2") {
      const accessToken = this.config.auth.oauth2?.accessToken;
      if (!accessToken) throw new Error("Missing OAuth2 access token");
      this.client = new HubSpotClient({ accessToken });
    } else {
      throw new Error("Unsupported auth type");
    }
  }

  async connect() {
    this.connected = true;
  }

  async disconnect() {
    this.connected = false;
  }

  isConnected() {
    return this.connected;
  }

  private requireClient(): HubSpotClient {
    if (!this.client) throw new Error("Connector not initialized");
    return this.client;
  }

  // Low-level request via SDK (advanced usage)
  async request<T = any>(options: {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    query?: Record<string, any>;
    headers?: Record<string, string>;
    body?: unknown;
    timeoutMs?: number;
    operation?: string;
  }): Promise<HttpResponseEnvelope<T>> {
    const client = this.requireClient();
    const res: any = await client.apiRequest({
      method: options.method,
      path: options.path,
      body: options.body,
      query: options.query,
      headers: options.headers,
    } as any);
    // The SDK typically returns { data, status, headers }
    const data = (res?.data ?? res) as T;
    const status = res?.status ?? 200;
    const headers = (res?.headers ?? {}) as Record<string, string>;
    return {
      data,
      status,
      headers,
      meta: {
        timestamp: new Date().toISOString(),
        durationMs: 0,
        requestId: (headers["x-request-id"] as any) ?? (headers["x-trace"] as any),
      },
    };
  }

  // Generic paginator over a GET endpoint using SDK apiRequest
  async *paginate<T = any>(options: {
    path: string;
    query?: Record<string, any>;
    pageSize?: number;
    extractItems?: (res: any) => T[];
    extractNextCursor?: (res: any) => string | undefined;
  }): AsyncIterable<T[]> {
    const extractItems = options.extractItems ?? ((res: any) => (res?.results ?? []) as T[]);
    const extractNext = options.extractNextCursor ?? ((res: any) => res?.paging?.next?.after as string | undefined);
    let after: string | undefined = options.query?.after as string | undefined;
    const limit = options.pageSize ?? (options.query?.limit as number | undefined) ?? 100;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const res = await this.request<any>({ method: "GET", path: options.path, query: { ...(options.query ?? {}), limit, after } });
      const items = extractItems(res.data);
      yield items;
      const next = extractNext(res.data);
      if (!next) break;
      after = next;
    }
  }

  // Contacts
  async listContacts(params?: { properties?: readonly string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<Page<HubSpotContact>>> {
    const client = this.requireClient();
    const limit = params?.limit;
    const after = params?.after;
    const properties = params?.properties;
    const page = await client.crm.contacts.basicApi.getPage(limit, after, properties as any);
    const results: HubSpotContact[] = ((page as any)?.results ?? []).map((o: ContactObject) => mapContact(o));
    return { data: { results, paging: (page as any)?.paging }, status: 200, headers: {} };
  }

  async getContact(params: { id: string; properties?: readonly string[] }): Promise<HttpResponseEnvelope<HubSpotContact>> {
    const client = this.requireClient();
    const obj = await client.crm.contacts.basicApi.getById(params.id, params.properties as any);
    return { data: mapContact(obj), status: 200, headers: {} };
  }

  async *streamContacts(params?: { properties?: readonly string[]; pageSize?: number }): AsyncIterable<HubSpotContact> {
    const client = this.requireClient();
    let after: string | undefined = undefined;
    const limit = params?.pageSize ?? 100;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const page = await client.crm.contacts.basicApi.getPage(limit, after, params?.properties as any);
      const items: ContactObject[] = (page as any)?.results ?? [];
      for (const item of items) yield mapContact(item as any);
      const next = page?.paging?.next?.after as string | undefined;
      if (!next) break;
      after = next;
    }
  }

  async getContacts(params?: { properties?: readonly string[]; pageSize?: number; maxItems?: number }): Promise<HubSpotContact[]> {
    const results: HubSpotContact[] = [];
    for await (const item of this.streamContacts({ properties: params?.properties as any, pageSize: params?.pageSize })) {
      results.push(item);
      if (params?.maxItems && results.length >= params.maxItems) break;
    }
    return results;
  }

  // Companies
  async listCompanies(params?: { properties?: readonly string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<Page<HubSpotCompany>>> {
    const client = this.requireClient();
    const page = await client.crm.companies.basicApi.getPage(params?.limit, params?.after, params?.properties as any);
    const results: HubSpotCompany[] = ((page as any)?.results ?? []).map((o: CompanyObject) => mapCompany(o));
    return { data: { results, paging: (page as any)?.paging }, status: 200, headers: {} };
  }

  async getCompany(params: { id: string; properties?: readonly string[] }): Promise<HttpResponseEnvelope<HubSpotCompany>> {
    const client = this.requireClient();
    const obj = await client.crm.companies.basicApi.getById(params.id, params.properties as any);
    return { data: mapCompany(obj), status: 200, headers: {} };
  }

  async *streamCompanies(params?: { properties?: readonly string[]; pageSize?: number }): AsyncIterable<HubSpotCompany> {
    const client = this.requireClient();
    let after: string | undefined = undefined;
    const limit = params?.pageSize ?? 100;
    while (true) {
      const page = await client.crm.companies.basicApi.getPage(limit, after, params?.properties as any);
      const items: CompanyObject[] = (page as any)?.results ?? [];
      for (const item of items) yield mapCompany(item as any);
      const next = page?.paging?.next?.after as string | undefined;
      if (!next) break;
      after = next;
    }
  }

  async getCompanies(params?: { properties?: readonly string[]; pageSize?: number; maxItems?: number }): Promise<HubSpotCompany[]> {
    const results: HubSpotCompany[] = [];
    for await (const item of this.streamCompanies({ properties: params?.properties as any, pageSize: params?.pageSize })) {
      results.push(item);
      if (params?.maxItems && results.length >= params.maxItems) break;
    }
    return results;
  }

  // Deals
  async listDeals(params?: { properties?: readonly string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<Page<HubSpotDeal>>> {
    const client = this.requireClient();
    const page = await client.crm.deals.basicApi.getPage(params?.limit, params?.after, params?.properties as any);
    const results: HubSpotDeal[] = ((page as any)?.results ?? []).map((o: DealObject) => mapDeal(o));
    return { data: { results, paging: (page as any)?.paging }, status: 200, headers: {} };
  }

  async getDeal(params: { id: string; properties?: readonly string[] }): Promise<HttpResponseEnvelope<HubSpotDeal>> {
    const client = this.requireClient();
    const obj = await client.crm.deals.basicApi.getById(params.id, params.properties as any);
    return { data: mapDeal(obj), status: 200, headers: {} };
  }

  async *streamDeals(params?: { properties?: readonly string[]; pageSize?: number }): AsyncIterable<HubSpotDeal> {
    const client = this.requireClient();
    let after: string | undefined = undefined;
    const limit = params?.pageSize ?? 100;
    while (true) {
      const page = await client.crm.deals.basicApi.getPage(limit, after, params?.properties as any);
      const items: DealObject[] = (page as any)?.results ?? [];
      for (const item of items) yield mapDeal(item as any);
      const next = page?.paging?.next?.after as string | undefined;
      if (!next) break;
      after = next;
    }
  }

  async getDeals(params?: { properties?: readonly string[]; pageSize?: number; maxItems?: number }): Promise<HubSpotDeal[]> {
    const results: HubSpotDeal[] = [];
    for await (const item of this.streamDeals({ properties: params?.properties as any, pageSize: params?.pageSize })) {
      results.push(item);
      if (params?.maxItems && results.length >= params.maxItems) break;
    }
    return results;
  }

  // Tickets
  async listTickets(params?: { properties?: readonly string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<Page<HubSpotTicket>>> {
    const client = this.requireClient();
    const page = await client.crm.tickets.basicApi.getPage(params?.limit, params?.after, params?.properties as any);
    const results: HubSpotTicket[] = ((page as any)?.results ?? []).map((o: TicketObject) => mapTicket(o));
    return { data: { results, paging: (page as any)?.paging }, status: 200, headers: {} };
  }

  async getTicket(params: { id: string; properties?: readonly string[] }): Promise<HttpResponseEnvelope<HubSpotTicket>> {
    const client = this.requireClient();
    const obj = await client.crm.tickets.basicApi.getById(params.id, params.properties as any);
    return { data: mapTicket(obj), status: 200, headers: {} };
  }

  async *streamTickets(params?: { properties?: readonly string[]; pageSize?: number }): AsyncIterable<HubSpotTicket> {
    const client = this.requireClient();
    let after: string | undefined = undefined;
    const limit = params?.pageSize ?? 100;
    while (true) {
      const page = await client.crm.tickets.basicApi.getPage(limit, after, params?.properties as any);
      const items: TicketObject[] = (page as any)?.results ?? [];
      for (const item of items) yield mapTicket(item as any);
      const next = page?.paging?.next?.after as string | undefined;
      if (!next) break;
      after = next;
    }
  }

  async getTickets(params?: { properties?: readonly string[]; pageSize?: number; maxItems?: number }): Promise<HubSpotTicket[]> {
    const results: HubSpotTicket[] = [];
    for await (const item of this.streamTickets({ properties: params?.properties as any, pageSize: params?.pageSize })) {
      results.push(item);
      if (params?.maxItems && results.length >= params.maxItems) break;
    }
    return results;
  }
}

export function createHubSpotConnector(): HubSpotConnector {
  return new HubSpotApiConnector();
}

export type { HubSpotConnector } from "./types/connector";
export type { ConnectorConfig } from "./types/config";
export type { HttpResponseEnvelope } from "./types/envelopes";


