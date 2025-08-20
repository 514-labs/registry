/**
 * API contracts for the engagements (activities) endpoints
 *
 * Role in architecture:
 * - Encapsulate the wire-level list/single response shapes for engagements
 * - Imported by the engagements domain to type HTTP responses
 */
import type { Engagement } from "./engagement";
import type { HubSpotListResponse, HubSpotSingleResponse } from "../shared";

/**
 * Engagement API Response Types
 * Strongly typed API contracts for HubSpot engagement endpoints
 */
export type EngagementsResponse = HubSpotListResponse<Engagement>;
export type EngagementResponse = HubSpotSingleResponse<Engagement>;
