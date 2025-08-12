/**
 * API contracts for the companies endpoints
 *
 * Role in architecture:
 * - Encapsulate the wire-level list/single response shapes for companies
 * - Imported by the companies domain to type HTTP responses
 */
import type { Company } from "./company";
import type { HubSpotListResponse, HubSpotSingleResponse } from "../shared";

/**
 * Company API Response Types
 * Strongly typed API contracts for HubSpot company endpoints
 */
export type CompaniesResponse = HubSpotListResponse<Company>;
export type CompanyResponse = HubSpotSingleResponse<Company>;
