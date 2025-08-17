/**
 * Engagement model: strong typing for engagement `properties` with base fields.
 * Used by the engagements domain to type list/get/stream/getAll.
 */
import type { HubSpotObject } from "../shared";

/**
 * Engagement Properties
 * Common HubSpot engagement properties with strong typing
 * Supports notes, calls, emails, meetings, and tasks
 */
export interface EngagementProperties {
  hs_timestamp?: string;
  hubspot_owner_id?: string;
  hs_body_preview?: string;
  hs_body_preview_html?: string;
  hs_body_preview_is_truncated?: string;
  
  // Note-specific properties
  hs_note_body?: string;
  
  // Call-specific properties
  hs_call_body?: string;
  hs_call_duration?: string;
  
  // Email-specific properties
  hs_email_subject?: string;
  hs_email_html?: string;
  
  // Meeting-specific properties
  hs_meeting_title?: string;
  hs_meeting_body?: string;
  
  // Task-specific properties
  hs_task_body?: string;
  hs_task_subject?: string;
  hs_task_status?: string;
  
  // Common properties
  createdate?: string;
  hs_lastmodifieddate?: string;
  hs_object_id?: string;
  [key: string]: string | null | undefined; // Allow custom properties
}

/**
 * Engagement Model
 * Represents a HubSpot engagement (note, call, email, meeting, or task) with strongly typed properties
 */
export interface Engagement extends Omit<HubSpotObject, 'properties'> {
  properties: EngagementProperties;
}
