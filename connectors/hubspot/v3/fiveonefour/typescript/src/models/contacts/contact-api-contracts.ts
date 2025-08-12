import type { Contact } from "./contact";
import type { HubSpotListResponse, HubSpotSingleResponse } from "../shared";

/**
 * Contact API Response Types
 * Strongly typed API contracts for HubSpot contact endpoints
 */

export type ContactsResponse = HubSpotListResponse<Contact>;
export type ContactResponse = HubSpotSingleResponse<Contact>;
