import type { HubSpotConnector } from "./types/connector";
import type { ConnectorConfig } from "./types/config";
import type { HttpResponseEnvelope } from "./types/envelopes";
import { withDerivedDefaults } from "./config/defaults";
import { HttpClient } from "./client/http-client";
import { TokenBucketLimiter } from "./rate-limit/token-bucket";

export class HubSpotApiConnector implements HubSpotConnector {
  private config?: ConnectorConfig;
  private connected = false;
  private http?: HttpClient;
  private limiter?: TokenBucketLimiter;

  initialize(userConfig: ConnectorConfig) {
    this.config = withDerivedDefaults(userConfig);
    this.http = new HttpClient(this.config, {
      applyAuth: ({ headers }) => {
        if (this.config?.auth.type === "bearer") {
          const token = this.config?.auth.bearer?.token;
          if (!token) throw new Error("Missing bearer token");
          headers["Authorization"] = `Bearer ${token}`;
        }
      },
    });
    const rps = this.config.rateLimit?.requestsPerSecond ?? 0;
    const capacity = this.config.rateLimit?.burstCapacity ?? rps;
    if (rps > 0) this.limiter = new TokenBucketLimiter({ capacity, refillPerSec: rps });
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

  private requireClient(): HttpClient {
    if (!this.http) throw new Error("Connector not initialized");
    return this.http;
  }

  private async send<T>(opts: Parameters<HttpClient["request"]>[0]): Promise<HttpResponseEnvelope<T>> {
    if (this.limiter) await this.limiter.waitForSlot();
    return this.requireClient().request<T>(opts);
  }

  request(opts: Parameters<HttpClient["request"]>[0]) {
    return this.send(opts);
  }

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
      const res = await this.send<any>({ method: "GET", path: options.path, query: { ...(options.query ?? {}), limit, after }, operation: "paginate" });
      const items = extractItems(res.data);
      yield items;
      const next = extractNext(res.data);
      if (!next) break;
      after = next;
    }
  }

  // Domain: Contacts
  listContacts(params?: { properties?: string[]; limit?: number; after?: string }) {
    const query: Record<string, any> = {};
    if (params?.properties?.length) query.properties = params.properties.join(",");
    if (params?.limit) query.limit = params.limit;
    if (params?.after) query.after = params.after;
    return this.send<{ results: any[]; paging?: any }>({ method: "GET", path: "/crm/v3/objects/contacts", query, operation: "listContacts" });
  }

  getContact(params: { id: string; properties?: string[] }) {
    const query: Record<string, any> = {};
    if (params?.properties?.length) query.properties = params.properties.join(",");
    return this.send<any>({ method: "GET", path: `/crm/v3/objects/contacts/${params.id}`, query, operation: "getContact" });
  }

  // Domain: Companies
  listCompanies(params?: { properties?: string[]; limit?: number; after?: string }) {
    const query: Record<string, any> = {};
    if (params?.properties?.length) query.properties = params.properties.join(",");
    if (params?.limit) query.limit = params.limit;
    if (params?.after) query.after = params.after;
    return this.send<{ results: any[]; paging?: any }>({ method: "GET", path: "/crm/v3/objects/companies", query, operation: "listCompanies" });
  }

  getCompany(params: { id: string; properties?: string[] }) {
    const query: Record<string, any> = {};
    if (params?.properties?.length) query.properties = params.properties.join(",");
    return this.send<any>({ method: "GET", path: `/crm/v3/objects/companies/${params.id}`, query, operation: "getCompany" });
  }

  // Domain: Deals
  listDeals(params?: { properties?: string[]; limit?: number; after?: string }) {
    const query: Record<string, any> = {};
    if (params?.properties?.length) query.properties = params.properties.join(",");
    if (params?.limit) query.limit = params.limit;
    if (params?.after) query.after = params.after;
    return this.send<{ results: any[]; paging?: any }>({ method: "GET", path: "/crm/v3/objects/deals", query, operation: "listDeals" });
  }

  getDeal(params: { id: string; properties?: string[] }) {
    const query: Record<string, any> = {};
    if (params?.properties?.length) query.properties = params.properties.join(",");
    return this.send<any>({ method: "GET", path: `/crm/v3/objects/deals/${params.id}`, query, operation: "getDeal" });
  }

  // Domain: Tickets
  listTickets(params?: { properties?: string[]; limit?: number; after?: string }) {
    const query: Record<string, any> = {};
    if (params?.properties?.length) query.properties = params.properties.join(",");
    if (params?.limit) query.limit = params.limit;
    if (params?.after) query.after = params.after;
    return this.send<{ results: any[]; paging?: any }>({ method: "GET", path: "/crm/v3/objects/tickets", query, operation: "listTickets" });
  }

  getTicket(params: { id: string; properties?: string[] }) {
    const query: Record<string, any> = {};
    if (params?.properties?.length) query.properties = params.properties.join(",");
    return this.send<any>({ method: "GET", path: `/crm/v3/objects/tickets/${params.id}`, query, operation: "getTicket" });
  }

  // Domain: Engagements (activities)
  listEngagements(params: { objectType: "notes" | "calls" | "emails" | "meetings" | "tasks"; properties?: string[]; limit?: number; after?: string }) {
    const { objectType } = params;
    const query: Record<string, any> = {};
    if (params?.properties?.length) query.properties = params.properties.join(",");
    if (params?.limit) query.limit = params.limit;
    if (params?.after) query.after = params.after;
    return this.send<{ results: any[]; paging?: any }>({ method: "GET", path: `/crm/v3/objects/${objectType}` as const, query, operation: "listEngagements" });
  }

  getEngagement(params: { objectType: "notes" | "calls" | "emails" | "meetings" | "tasks"; id: string; properties?: string[] }) {
    const { objectType, id } = params;
    const query: Record<string, any> = {};
    if (params?.properties?.length) query.properties = params.properties.join(",");
    return this.send<any>({ method: "GET", path: `/crm/v3/objects/${objectType}/${id}` as const, query, operation: "getEngagement" });
  }
}

export function createHubSpotConnector(): HubSpotConnector {
  return new HubSpotApiConnector();
}

export type { HubSpotConnector } from "./types/connector";
export type { ConnectorConfig } from "./types/config";
export type { HttpResponseEnvelope } from "./types/envelopes";


