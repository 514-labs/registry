import type { Ticket } from "./ticket";
import type { HubSpotListResponse, HubSpotSingleResponse } from "../shared";

/**
 * Ticket API Response Types
 * Strongly typed API contracts for HubSpot ticket endpoints
 */

export type TicketsResponse = HubSpotListResponse<Ticket>;
export type TicketResponse = HubSpotSingleResponse<Ticket>;
