/**
 * Shared API parameter types for HubSpot endpoints
 */

// Base parameter types
export interface ListParams {
  properties?: string[];
  limit?: number;
  after?: string;
}

export interface GetParams {
  id: string;
  properties?: string[];
}

export interface StreamParams {
  properties?: string[];
  pageSize?: number;
}

export interface GetAllParams {
  properties?: string[];
  pageSize?: number;
  maxItems?: number;
}

// Engagement-specific parameter types
export interface EngagementParams extends ListParams {
  objectType: "notes" | "calls" | "emails" | "meetings" | "tasks";
}

export interface GetEngagementParams extends GetParams {
  objectType: "notes" | "calls" | "emails" | "meetings" | "tasks";
}

export interface StreamEngagementParams extends StreamParams {
  objectType: "notes" | "calls" | "emails" | "meetings" | "tasks";
}

export interface GetAllEngagementParams extends GetAllParams {
  objectType: "notes" | "calls" | "emails" | "meetings" | "tasks";
}
