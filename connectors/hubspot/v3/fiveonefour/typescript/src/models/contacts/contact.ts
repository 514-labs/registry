import type { HubSpotObject } from "../shared";

/**
 * Contact Properties
 * Common HubSpot contact properties with strong typing
 */
export interface ContactProperties {
  email?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  company?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  jobtitle?: string;
  lifecyclestage?: string;
  lead_status?: string;
  createdate?: string;
  lastmodifieddate?: string;
  hs_object_id?: string;
  [key: string]: string | null | undefined; // Allow custom properties
}

/**
 * Contact Model
 * Represents a HubSpot contact with strongly typed properties
 */
export interface Contact extends Omit<HubSpotObject, 'properties'> {
  properties: ContactProperties;
}
