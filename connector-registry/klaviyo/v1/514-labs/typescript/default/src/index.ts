/**
 * Klaviyo API Connector
 * 
 * Provides access to Klaviyo's marketing automation API including:
 * - Profiles (customer/contact data)
 * - Lists (audience segments)
 * - Campaigns (email campaigns)
 */
export * from './client/connector'
export type { Profile, ProfileAttributes, ListProfilesParams } from './resources/profiles'
export type { List, ListAttributes, ListListsParams } from './resources/lists'
export type { Campaign, CampaignAttributes, ListCampaignsParams } from './resources/campaigns'

