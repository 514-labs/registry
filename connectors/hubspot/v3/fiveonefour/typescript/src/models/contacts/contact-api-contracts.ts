/**
 * API contracts for the contacts endpoints
 *
 * Role in architecture:
 * - Encapsulate the wire-level list/single response shapes for contacts
 * - Imported by the contacts domain to type HTTP responses
 */
import type { Contact } from "./contact";
import type { HubSpotListResponse, HubSpotSingleResponse } from "../shared";

/**
 * Contact API Response Types
 * Strongly typed API contracts for HubSpot contact endpoints
 */
export type ContactsResponse = HubSpotListResponse<Contact>;
export type ContactResponse = HubSpotSingleResponse<Contact>;
