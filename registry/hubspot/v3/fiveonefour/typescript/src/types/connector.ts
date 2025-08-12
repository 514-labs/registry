import type { HttpResponseEnvelope } from "./envelopes";
import type { ConnectorConfig } from "./config";
import type {
  Contact,
  Company,
  Deal,
  Ticket,
  Engagement,
  ContactsResponse,
  ContactResponse,
  CompaniesResponse,
  CompanyResponse,
  DealsResponse,
  DealResponse,
  TicketsResponse,
  TicketResponse,
  EngagementsResponse,
  EngagementResponse,
  ListParams,
  GetParams,
  StreamParams,
  GetAllParams,
  EngagementParams,
  GetEngagementParams,
  StreamEngagementParams,
  GetAllEngagementParams,
} from "../models";

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
  listContacts(params?: ListParams): Promise<HttpResponseEnvelope<ContactsResponse>>;

  getContact(params: GetParams): Promise<HttpResponseEnvelope<ContactResponse>>;

  // Convenience: stream and fetch all contacts
  streamContacts(params?: StreamParams): AsyncIterable<Contact>;
  getContacts(params?: GetAllParams): Promise<Contact[]>;

  // Domain: Companies
  listCompanies(params?: ListParams): Promise<HttpResponseEnvelope<CompaniesResponse>>;

  getCompany(params: GetParams): Promise<HttpResponseEnvelope<CompanyResponse>>;

  // Convenience: stream and fetch all companies
  streamCompanies(params?: StreamParams): AsyncIterable<Company>;
  getCompanies(params?: GetAllParams): Promise<Company[]>;

  // Domain: Deals
  listDeals(params?: ListParams): Promise<HttpResponseEnvelope<DealsResponse>>;

  getDeal(params: GetParams): Promise<HttpResponseEnvelope<DealResponse>>;

  // Convenience: stream and fetch all deals
  streamDeals(params?: StreamParams): AsyncIterable<Deal>;
  getDeals(params?: GetAllParams): Promise<Deal[]>;

  // Domain: Tickets
  listTickets(params?: ListParams): Promise<HttpResponseEnvelope<TicketsResponse>>;

  getTicket(params: GetParams): Promise<HttpResponseEnvelope<TicketResponse>>;

  // Convenience: stream and fetch all tickets
  streamTickets(params?: StreamParams): AsyncIterable<Ticket>;
  getTickets(params?: GetAllParams): Promise<Ticket[]>;

  // Domain: Engagements (activities)
  listEngagements(params: EngagementParams): Promise<HttpResponseEnvelope<EngagementsResponse>>;

  getEngagement(params: GetEngagementParams): Promise<HttpResponseEnvelope<EngagementResponse>>;

  // Convenience: stream and fetch all engagements for a type
  streamEngagements(params: StreamEngagementParams): AsyncIterable<Engagement>;
  getEngagements(params: GetAllEngagementParams): Promise<Engagement[]>;
}


