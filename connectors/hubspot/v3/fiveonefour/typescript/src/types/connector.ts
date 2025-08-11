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

  // Convenience: stream and fetch all contacts
  streamContacts(params?: { properties?: string[]; pageSize?: number }): AsyncIterable<any>;
  getContacts(params?: { properties?: string[]; pageSize?: number; maxItems?: number }): Promise<any[]>;

  // Domain: Companies
  listCompanies(params?: {
    properties?: string[];
    limit?: number;
    after?: string;
  }): Promise<HttpResponseEnvelope<{ results: any[]; paging?: any }>>;

  getCompany(params: { id: string; properties?: string[] }): Promise<HttpResponseEnvelope<any>>;

  // Convenience: stream and fetch all companies
  streamCompanies(params?: { properties?: string[]; pageSize?: number }): AsyncIterable<any>;
  getCompanies(params?: { properties?: string[]; pageSize?: number; maxItems?: number }): Promise<any[]>;

  // Domain: Deals
  listDeals(params?: {
    properties?: string[];
    limit?: number;
    after?: string;
  }): Promise<HttpResponseEnvelope<{ results: any[]; paging?: any }>>;

  getDeal(params: { id: string; properties?: string[] }): Promise<HttpResponseEnvelope<any>>;

  // Convenience: stream and fetch all deals
  streamDeals(params?: { properties?: string[]; pageSize?: number }): AsyncIterable<any>;
  getDeals(params?: { properties?: string[]; pageSize?: number; maxItems?: number }): Promise<any[]>;

  // Domain: Tickets
  listTickets(params?: {
    properties?: string[];
    limit?: number;
    after?: string;
  }): Promise<HttpResponseEnvelope<{ results: any[]; paging?: any }>>;

  getTicket(params: { id: string; properties?: string[] }): Promise<HttpResponseEnvelope<any>>;

  // Convenience: stream and fetch all tickets
  streamTickets(params?: { properties?: string[]; pageSize?: number }): AsyncIterable<any>;
  getTickets(params?: { properties?: string[]; pageSize?: number; maxItems?: number }): Promise<any[]>;

  // Domain: Engagements (activities)
  listEngagements(params: {
    objectType: "notes" | "calls" | "emails" | "meetings" | "tasks";
    properties?: string[];
    limit?: number;
    after?: string;
  }): Promise<HttpResponseEnvelope<{ results: any[]; paging?: any }>>;

  getEngagement(params: { objectType: "notes" | "calls" | "emails" | "meetings" | "tasks"; id: string; properties?: string[] }): Promise<HttpResponseEnvelope<any>>;

  // Convenience: stream and fetch all engagements for a type
  streamEngagements(params: { objectType: "notes" | "calls" | "emails" | "meetings" | "tasks"; properties?: string[]; pageSize?: number }): AsyncIterable<any>;
  getEngagements(params: { objectType: "notes" | "calls" | "emails" | "meetings" | "tasks"; properties?: string[]; pageSize?: number; maxItems?: number }): Promise<any[]>;
}


