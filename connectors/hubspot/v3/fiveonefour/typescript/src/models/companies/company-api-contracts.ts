import type { Company } from "./company";
import type { HubSpotListResponse, HubSpotSingleResponse } from "../shared";

/**
 * Company API Response Types
 * Strongly typed API contracts for HubSpot company endpoints
 */

export type CompaniesResponse = HubSpotListResponse<Company>;
export type CompanyResponse = HubSpotSingleResponse<Company>;
