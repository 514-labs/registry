import type { Deal } from "./deal";
import type { HubSpotListResponse, HubSpotSingleResponse } from "../shared";

/**
 * Deal API Response Types
 * Strongly typed API contracts for HubSpot deal endpoints
 */

export type DealsResponse = HubSpotListResponse<Deal>;
export type DealResponse = HubSpotSingleResponse<Deal>;
