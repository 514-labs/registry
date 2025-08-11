import type { HttpResponseEnvelope } from "./envelopes";
import type { ConnectorConfig } from "./config";

export interface HubSpotConnector {
  initialize(config: ConnectorConfig): Promise<void> | void;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;

  request(options: {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    query?: Record<string, string | number | boolean | undefined>;
    headers?: Record<string, string>;
    body?: unknown;
    timeoutMs?: number;
    operation?: string;
  }): Promise<HttpResponseEnvelope<any>>;

  paginate<T = any>(options: {
    path: string;
    query?: Record<string, any>;
    pageSize?: number;
    extractItems?: (res: any) => T[];
    extractNextCursor?: (res: any) => string | undefined;
  }): AsyncIterable<T[]>;

  // Domain: Contacts
  listContacts(params?: {
    properties?: string[];
    limit?: number;
    after?: string;
  }): Promise<HttpResponseEnvelope<{ results: any[]; paging?: any }>>;

  getContact(params: { id: string; properties?: string[] }): Promise<HttpResponseEnvelope<any>>;

  // Domain: Companies
  listCompanies(params?: {
    properties?: string[];
    limit?: number;
    after?: string;
  }): Promise<HttpResponseEnvelope<{ results: any[]; paging?: any }>>;

  getCompany(params: { id: string; properties?: string[] }): Promise<HttpResponseEnvelope<any>>;

  // Domain: Deals
  listDeals(params?: {
    properties?: string[];
    limit?: number;
    after?: string;
  }): Promise<HttpResponseEnvelope<{ results: any[]; paging?: any }>>;

  getDeal(params: { id: string; properties?: string[] }): Promise<HttpResponseEnvelope<any>>;

  // Domain: Tickets
  listTickets(params?: {
    properties?: string[];
    limit?: number;
    after?: string;
  }): Promise<HttpResponseEnvelope<{ results: any[]; paging?: any }>>;

  getTicket(params: { id: string; properties?: string[] }): Promise<HttpResponseEnvelope<any>>;

  // Domain: Engagements (activities)
  listEngagements(params: {
    objectType: "notes" | "calls" | "emails" | "meetings" | "tasks";
    properties?: string[];
    limit?: number;
    after?: string;
  }): Promise<HttpResponseEnvelope<{ results: any[]; paging?: any }>>;

  getEngagement(params: { objectType: "notes" | "calls" | "emails" | "meetings" | "tasks"; id: string; properties?: string[] }): Promise<HttpResponseEnvelope<any>>;
}


