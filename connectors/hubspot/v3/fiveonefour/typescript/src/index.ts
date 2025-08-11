import type { HubSpotConnector } from "./types/connector";
import type { ConnectorConfig } from "./types/config";
import type { HttpResponseEnvelope } from "./types/envelopes";
import { withDerivedDefaults } from "./config/defaults";
import { HttpClient } from "./client/http-client";
import { TokenBucketLimiter } from "./rate-limit/token-bucket";
import { paginateCursor, type SendFn } from "./core/paginate";
import { buildContactsDomain } from "./domains/contacts";
import { buildCompaniesDomain } from "./domains/companies";
import { buildDealsDomain } from "./domains/deals";
import { buildTicketsDomain } from "./domains/tickets";
import { buildEngagementsDomain } from "./domains/engagements";

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

  // Generic paginator (advanced)
  async *paginate<T = any>(options: { path: string; query?: Record<string, any>; pageSize?: number; extractItems?: (res: any) => T[]; extractNextCursor?: (res: any) => string | undefined }) {
    const sendLite: SendFn = async (args) => this.send<any>(args);
    yield* paginateCursor<T>({ send: sendLite, path: options.path, query: options.query, pageSize: options.pageSize, extractItems: options.extractItems, extractNextCursor: options.extractNextCursor });
  }

  // Build domain delegates
  private get domain() {
    const sendLite: SendFn = async (args) => this.send<any>(args);
    return {
      ...buildContactsDomain(sendLite),
      ...buildCompaniesDomain(sendLite),
      ...buildDealsDomain(sendLite),
      ...buildTicketsDomain(sendLite),
      ...buildEngagementsDomain(sendLite),
    };
  }

  // Contacts
  listContacts = (params?: { properties?: string[]; limit?: number; after?: string }) => this.domain.listContacts(params);
  getContact = (params: { id: string; properties?: string[] }) => this.domain.getContact(params);
  streamContacts = (params?: { properties?: string[]; pageSize?: number }) => this.domain.streamContacts(params);
  getContacts = (params?: { properties?: string[]; pageSize?: number; maxItems?: number }) => this.domain.getContacts(params);

  // Companies
  listCompanies = (params?: { properties?: string[]; limit?: number; after?: string }) => this.domain.listCompanies(params);
  getCompany = (params: { id: string; properties?: string[] }) => this.domain.getCompany(params);
  streamCompanies = (params?: { properties?: string[]; pageSize?: number }) => this.domain.streamCompanies(params);
  getCompanies = (params?: { properties?: string[]; pageSize?: number; maxItems?: number }) => this.domain.getCompanies(params);

  // Deals
  listDeals = (params?: { properties?: string[]; limit?: number; after?: string }) => this.domain.listDeals(params);
  getDeal = (params: { id: string; properties?: string[] }) => this.domain.getDeal(params);
  streamDeals = (params?: { properties?: string[]; pageSize?: number }) => this.domain.streamDeals(params);
  getDeals = (params?: { properties?: string[]; pageSize?: number; maxItems?: number }) => this.domain.getDeals(params);

  // Tickets
  listTickets = (params?: { properties?: string[]; limit?: number; after?: string }) => this.domain.listTickets(params);
  getTicket = (params: { id: string; properties?: string[] }) => this.domain.getTicket(params);
  streamTickets = (params?: { properties?: string[]; pageSize?: number }) => this.domain.streamTickets(params);
  getTickets = (params?: { properties?: string[]; pageSize?: number; maxItems?: number }) => this.domain.getTickets(params);

  // Engagements
  listEngagements = (params: { objectType: "notes" | "calls" | "emails" | "meetings" | "tasks"; properties?: string[]; limit?: number; after?: string }) => this.domain.listEngagements(params);
  getEngagement = (params: { objectType: "notes" | "calls" | "emails" | "meetings" | "tasks"; id: string; properties?: string[] }) => this.domain.getEngagement(params);
  streamEngagements = (params: { objectType: "notes" | "calls" | "emails" | "meetings" | "tasks"; properties?: string[]; pageSize?: number }) => this.domain.streamEngagements(params);
  getEngagements = (params: { objectType: "notes" | "calls" | "emails" | "meetings" | "tasks"; properties?: string[]; pageSize?: number; maxItems?: number }) => this.domain.getEngagements(params);
}

export function createHubSpotConnector(): HubSpotConnector {
  return new HubSpotApiConnector();
}

export type { HubSpotConnector } from "./types/connector";
export type { ConnectorConfig } from "./types/config";
export type { HttpResponseEnvelope } from "./types/envelopes";


