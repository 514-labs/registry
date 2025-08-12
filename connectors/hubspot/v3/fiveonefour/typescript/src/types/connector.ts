import type { HttpResponseEnvelope } from "./envelopes";
import type { ConnectorConfig } from "./config";
// SDK types
import type { HubSpotContact } from "../models/contact";
import type { HubSpotCompany } from "../models/company";
import type { HubSpotDeal } from "../models/deal";
import type { HubSpotTicket } from "../models/ticket";

type Page<T> = { results: T[]; paging?: any };

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
    properties?: readonly string[];
    limit?: number;
    after?: string;
  }): Promise<HttpResponseEnvelope<Page<HubSpotContact>>>;

  getContact(params: { id: string; properties?: readonly string[] }): Promise<HttpResponseEnvelope<HubSpotContact>>;

  // Convenience: stream and fetch all contacts
  streamContacts(params?: { properties?: readonly string[]; pageSize?: number }): AsyncIterable<HubSpotContact>;
  getContacts(params?: { properties?: readonly string[]; pageSize?: number; maxItems?: number }): Promise<HubSpotContact[]>;

  // Domain: Companies
  listCompanies(params?: {
    properties?: readonly string[];
    limit?: number;
    after?: string;
  }): Promise<HttpResponseEnvelope<Page<HubSpotCompany>>>;

  getCompany(params: { id: string; properties?: readonly string[] }): Promise<HttpResponseEnvelope<HubSpotCompany>>;

  // Convenience: stream and fetch all companies
  streamCompanies(params?: { properties?: readonly string[]; pageSize?: number }): AsyncIterable<HubSpotCompany>;
  getCompanies(params?: { properties?: readonly string[]; pageSize?: number; maxItems?: number }): Promise<HubSpotCompany[]>;

  // Domain: Deals
  listDeals(params?: {
    properties?: readonly string[];
    limit?: number;
    after?: string;
  }): Promise<HttpResponseEnvelope<Page<HubSpotDeal>>>;

  getDeal(params: { id: string; properties?: readonly string[] }): Promise<HttpResponseEnvelope<HubSpotDeal>>;

  // Convenience: stream and fetch all deals
  streamDeals(params?: { properties?: readonly string[]; pageSize?: number }): AsyncIterable<HubSpotDeal>;
  getDeals(params?: { properties?: readonly string[]; pageSize?: number; maxItems?: number }): Promise<HubSpotDeal[]>;

  // Domain: Tickets
  listTickets(params?: {
    properties?: readonly string[];
    limit?: number;
    after?: string;
  }): Promise<HttpResponseEnvelope<Page<HubSpotTicket>>>;

  getTicket(params: { id: string; properties?: readonly string[] }): Promise<HttpResponseEnvelope<HubSpotTicket>>;

  // Convenience: stream and fetch all tickets
  streamTickets(params?: { properties?: readonly string[]; pageSize?: number }): AsyncIterable<HubSpotTicket>;
  getTickets(params?: { properties?: readonly string[]; pageSize?: number; maxItems?: number }): Promise<HubSpotTicket[]>;
}


