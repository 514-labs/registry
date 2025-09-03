/**
 * HubSpotApiConnector
 *
 * Responsibilities:
 * - Initialize transport concerns (HTTP client, auth application, rate limiter)
 * - Expose lifecycle (`initialize`, `connect`, `disconnect`, `isConnected`)
 * - Provide a single `request` primitive and a generic `paginate` iterator
 * - Delegate object‑specific operations to small "domains" that bind paths and models
 *
 * Why domains?
 * - Separation of concerns: transport/retries/hooks stay here; paths/types live in domains
 * - Reuse: domains are built from a shared CRUD factory + paginator to avoid duplication
 * - Type safety: each domain binds its own response models for IntelliSense
 * - Extensibility: adding an object = bind path + types; rest is inherited
 */
import type { HubSpotConnector } from "./types/connector";
import type { ConnectorConfig } from "./types/config";
import type { HttpResponseEnvelope } from "./types/envelopes";
import { withDerivedDefaults } from "./config/defaults";
import { ApiConnectorBase } from "@connector-factory/core";
import type { SendFn } from "@connector-factory/core";
import { buildContactsDomain } from "./domains/contacts";
import { buildCompaniesDomain } from "./domains/companies";
import { buildDealsDomain } from "./domains/deals";
import { buildTicketsDomain } from "./domains/tickets";
import { buildEngagementsDomain } from "./domains/engagements";

export class HubSpotApiConnector extends ApiConnectorBase implements HubSpotConnector {
  initialize(userConfig: ConnectorConfig) {
    super.initialize(userConfig, withDerivedDefaults, ({ headers }) => {
      if (this.config?.auth.type === "bearer") {
        const token = this.config?.auth.bearer?.token;
        if (!token) throw new Error("Missing bearer token");
        headers["Authorization"] = `Bearer ${token}`;
      }
    });
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
// Export all model types for external use
export type * from "./models";


