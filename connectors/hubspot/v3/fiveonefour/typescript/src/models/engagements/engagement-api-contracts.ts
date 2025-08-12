import type { Engagement } from "./engagement";
import type { HubSpotListResponse, HubSpotSingleResponse } from "../shared";

/**
 * Engagement API Response Types
 * Strongly typed API contracts for HubSpot engagement endpoints
 */

export type EngagementsResponse = HubSpotListResponse<Engagement>;
export type EngagementResponse = HubSpotSingleResponse<Engagement>;
