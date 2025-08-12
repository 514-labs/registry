/**
 * Ticket model: strong typing for ticket `properties` with base fields.
 * Used by the tickets domain to type list/get/stream/getAll.
 */
import type { HubSpotObject } from "../shared";

/**
 * Ticket Properties
 * Common HubSpot ticket properties with strong typing
 */
export interface TicketProperties {
  subject?: string;
  content?: string;
  hs_pipeline?: string;
  hs_pipeline_stage?: string;
  hs_ticket_priority?: string;
  hubspot_owner_id?: string;
  source_type?: string;
  createdate?: string;
  hs_lastmodifieddate?: string;
  hs_object_id?: string;
  [key: string]: string | null | undefined; // Allow custom properties
}

/**
 * Ticket Model
 * Represents a HubSpot ticket with strongly typed properties
 */
export interface Ticket extends Omit<HubSpotObject, 'properties'> {
  properties: TicketProperties;
}
