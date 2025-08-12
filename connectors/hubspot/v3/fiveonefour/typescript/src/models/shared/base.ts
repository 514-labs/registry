/**
 * Shared base types for all HubSpot CRM objects.
 *
 * These types intentionally mirror HubSpot's object/response shape so that
 * domain models (contacts/companies/deals/tickets/engagements) can extend
 * them without redefining pagination or metadata fields. Custom objects can
 * also use these directly via `HubSpotObject`.
 */

// Base HubSpot object structure
export interface HubSpotObject {
  id: string;
  properties: Record<string, string | null>;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
  archived: boolean;
}

// API Response structures
export interface HubSpotListResponse<T> {
  results: T[];
  paging?: {
    next?: {
      after: string;
      link: string;
    };
    prev?: {
      before: string;
      link: string;
    };
  };
}

export interface HubSpotSingleResponse<T> {
  id: string;
  properties: T extends { properties: infer P } ? P : any;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}
