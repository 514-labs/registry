/**
 * API contracts for the deals endpoints
 *
 * Role in architecture:
 * - Encapsulate the wire-level list/single response shapes for deals
 * - Imported by the deals domain to type HTTP responses
 */
import type { Deal } from "./deal";
import type { HubSpotListResponse, HubSpotSingleResponse } from "../shared";

/**
 * Deal API Response Types
 * Strongly typed API contracts for HubSpot deal endpoints
 */
export type DealsResponse = HubSpotListResponse<Deal>;
export type DealResponse = HubSpotSingleResponse<Deal>;
