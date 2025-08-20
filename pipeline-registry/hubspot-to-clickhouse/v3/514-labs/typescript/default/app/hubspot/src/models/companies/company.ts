/**
 * Company model: strong typing for company `properties` with base fields.
 * Used by the companies domain to type list/get/stream/getAll.
 */
import type { HubSpotObject } from "../shared";

/**
 * Company Properties
 * Common HubSpot company properties with strong typing
 */
export interface CompanyProperties {
  name?: string;
  domain?: string;
  country?: string;
  industry?: string;
  description?: string;
  phone?: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  web_technologies?: string;
  numberofemployees?: string;
  annualrevenue?: string;
  type?: string;
  createdate?: string;
  hs_lastmodifieddate?: string;
  hs_object_id?: string;
  [key: string]: string | null | undefined; // Allow custom properties
}

/**
 * Company Model
 * Represents a HubSpot company with strongly typed properties
 */
export interface Company extends Omit<HubSpotObject, 'properties'> {
  properties: CompanyProperties;
}
