/**
 * Deal model: strong typing for deal `properties` with base fields.
 * Used by the deals domain to type list/get/stream/getAll.
 */
import type { HubSpotObject } from "../shared";

/**
 * Deal Properties
 * Common HubSpot deal properties with strong typing
 */
export interface DealProperties {
  dealname?: string;
  amount?: string;
  dealstage?: string;
  pipeline?: string;
  closedate?: string;
  createdate?: string;
  hs_lastmodifieddate?: string;
  hubspot_owner_id?: string;
  dealtype?: string;
  description?: string;
  hs_object_id?: string;
  [key: string]: string | null | undefined; // Allow custom properties
}

/**
 * Deal Model
 * Represents a HubSpot deal with strongly typed properties
 */
export interface Deal extends Omit<HubSpotObject, 'properties'> {
  properties: DealProperties;
}
