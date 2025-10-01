import type { HttpResponseEnvelope } from "./envelopes";

// Resource interfaces
export interface AdAccountsResource {
  list(params?: { fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<AdAccount[]>>;
  stream(params?: { fields?: string[]; pageSize?: number }): AsyncIterable<AdAccount>;
  getAll(params?: { fields?: string[]; pageSize?: number; maxItems?: number }): Promise<AdAccount[]>;
}

export interface CampaignsResource {
  list(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<Campaign[]>>;
  get(params: { adAccountId: string; id: string; fields?: string[] }): Promise<HttpResponseEnvelope<Campaign>>;
  stream(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<Campaign>;
  getAll(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<Campaign[]>;
}

export interface AdSetsResource {
  list(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<AdSet[]>>;
  get(params: { adAccountId: string; id: string; fields?: string[] }): Promise<HttpResponseEnvelope<AdSet>>;
  stream(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<AdSet>;
  getAll(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<AdSet[]>;
}

export interface AdsResource {
  list(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<Ad[]>>;
  get(params: { adAccountId: string; id: string; fields?: string[] }): Promise<HttpResponseEnvelope<Ad>>;
  stream(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<Ad>;
  getAll(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<Ad[]>;
}

export interface InsightsResource {
  get(params: { objectId: string; level: "account" | "campaign" | "adset" | "ad"; fields?: string[]; timeRange?: { since: string; until: string }; limit?: number; after?: string }): Promise<HttpResponseEnvelope<Insight[]>>;
  stream(params: { objectId: string; level: "account" | "campaign" | "adset" | "ad"; fields?: string[]; timeRange?: { since: string; until: string }; pageSize?: number }): AsyncIterable<Insight>;
  getAll(params: { objectId: string; level: "account" | "campaign" | "adset" | "ad"; fields?: string[]; timeRange?: { since: string; until: string }; pageSize?: number; maxItems?: number }): Promise<Insight[]>;
}

export interface AdCreativesResource {
  list(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<AdCreative[]>>;
  get(params: { adAccountId: string; id: string; fields?: string[] }): Promise<HttpResponseEnvelope<AdCreative>>;
  stream(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<AdCreative>;
  getAll(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<AdCreative[]>;
}

export interface CustomAudiencesResource {
  list(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<CustomAudience[]>>;
  get(params: { adAccountId: string; id: string; fields?: string[] }): Promise<HttpResponseEnvelope<CustomAudience>>;
  stream(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<CustomAudience>;
  getAll(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<CustomAudience[]>;
}

export interface SavedAudiencesResource {
  list(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<SavedAudience[]>>;
  get(params: { adAccountId: string; id: string; fields?: string[] }): Promise<HttpResponseEnvelope<SavedAudience>>;
  stream(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<SavedAudience>;
  getAll(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<SavedAudience[]>;
}

export interface AdImagesResource {
  list(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<AdImage[]>>;
  get(params: { adAccountId: string; hash: string; fields?: string[] }): Promise<HttpResponseEnvelope<AdImage>>;
  stream(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<AdImage>;
  getAll(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<AdImage[]>;
}

export interface AdVideosResource {
  list(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<AdVideo[]>>;
  get(params: { adAccountId: string; id: string; fields?: string[] }): Promise<HttpResponseEnvelope<AdVideo>>;
  stream(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<AdVideo>;
  getAll(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<AdVideo[]>;
}

export interface BusinessesResource {
  list(params?: { fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<Business[]>>;
  get(params: { id: string; fields?: string[] }): Promise<HttpResponseEnvelope<Business>>;
  stream(params?: { fields?: string[]; pageSize?: number }): AsyncIterable<Business>;
  getAll(params?: { fields?: string[]; pageSize?: number; maxItems?: number }): Promise<Business[]>;
}

export interface PagesResource {
  list(params?: { fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<Page[]>>;
  get(params: { id: string; fields?: string[] }): Promise<HttpResponseEnvelope<Page>>;
  stream(params?: { fields?: string[]; pageSize?: number }): AsyncIterable<Page>;
  getAll(params?: { fields?: string[]; pageSize?: number; maxItems?: number }): Promise<Page[]>;
}

export interface ConversionsResource {
  list(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<Conversion[]>>;
  get(params: { adAccountId: string; id: string; fields?: string[] }): Promise<HttpResponseEnvelope<Conversion>>;
  stream(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<Conversion>;
  getAll(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<Conversion[]>;
}

export interface PixelsResource {
  list(params?: { fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<Pixel[]>>;
  stream(params?: { fields?: string[]; pageSize?: number }): AsyncIterable<Pixel>;
  getAll(params?: { fields?: string[]; pageSize?: number; maxItems?: number }): Promise<Pixel[]>;
}

export interface AdLabelsResource {
  list(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<AdLabel[]>>;
  get(params: { adAccountId: string; id: string; fields?: string[] }): Promise<HttpResponseEnvelope<AdLabel>>;
  stream(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<AdLabel>;
  getAll(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<AdLabel[]>;
}

export interface LeadGenFormsResource {
  list(params?: { fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<LeadGenForm[]>>;
  get(params: { id: string; fields?: string[] }): Promise<HttpResponseEnvelope<LeadGenForm>>;
  stream(params?: { fields?: string[]; pageSize?: number }): AsyncIterable<LeadGenForm>;
  getAll(params?: { fields?: string[]; pageSize?: number; maxItems?: number }): Promise<LeadGenForm[]>;
}

export interface MetaAdsConnector {
  // Lifecycle methods
  initialize(config: any): Promise<void> | void;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;

  // Low-level request method
  request(options: {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    query?: Record<string, string | number | boolean | undefined>;
    headers?: Record<string, string>;
    body?: unknown;
    timeoutMs?: number;
    operation?: string;
  }): Promise<HttpResponseEnvelope<any>>;

  // Resources
  readonly adAccounts: AdAccountsResource;
  readonly campaigns: CampaignsResource;
  readonly adSets: AdSetsResource;
  readonly ads: AdsResource;
  readonly insights: InsightsResource;
  readonly adCreatives: AdCreativesResource;
  readonly customAudiences: CustomAudiencesResource;
  readonly savedAudiences: SavedAudiencesResource;
  readonly adImages: AdImagesResource;
  readonly adVideos: AdVideosResource;
  readonly businesses: BusinessesResource;
  readonly pages: PagesResource;
  readonly conversions: ConversionsResource;
  readonly pixels: PixelsResource;
  readonly adLabels: AdLabelsResource;
  readonly leadGenForms: LeadGenFormsResource;
}

export interface AdAccount {
  id: string;
  name: string;
  account_status: number;
  currency: string;
  timezone_name?: string;
  business?: {
    id: string;
    name: string;
  };
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
  objective?: string;
  created_time?: string;
  updated_time?: string;
  start_time?: string;
  stop_time?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  budget_remaining?: string;
  account_id?: string;
}

export interface AdSet {
  id: string;
  name: string;
  status: string;
  campaign_id?: string;
  created_time?: string;
  updated_time?: string;
  start_time?: string;
  end_time?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  budget_remaining?: string;
  billing_event?: string;
  optimization_goal?: string;
  targeting?: any;
}

export interface Ad {
  id: string;
  name: string;
  status: string;
  adset_id?: string;
  campaign_id?: string;
  created_time?: string;
  updated_time?: string;
  creative?: any;
  tracking_specs?: any[];
  conversion_specs?: any[];
}

export interface Insight {
  date_start: string;
  date_stop: string;
  impressions?: string;
  clicks?: string;
  spend?: string;
  reach?: string;
  frequency?: string;
  ctr?: string;
  cpc?: string;
  cpm?: string;
  cpp?: string;
  cost_per_unique_click?: string;
  unique_clicks?: string;
  unique_ctr?: string;
  actions?: any[];
  conversions?: any[];
  conversion_values?: any[];
  cost_per_action_type?: any[];
  video_play_actions?: any[];
  video_p25_watched_actions?: any[];
  video_p50_watched_actions?: any[];
  video_p75_watched_actions?: any[];
  video_p95_watched_actions?: any[];
  video_p100_watched_actions?: any[];
}

export interface AdCreative {
  id: string;
  name: string;
  title?: string;
  body?: string;
  image_hash?: string;
  image_url?: string;
  video_id?: string;
  thumbnail_url?: string;
  link_url?: string;
  call_to_action_type?: string;
  object_story_spec?: any;
  asset_feed_spec?: any;
  degrees_of_freedom_spec?: any;
  status: string;
  created_time?: string;
  updated_time?: string;
}

export interface CustomAudience {
  id: string;
  name: string;
  description?: string;
  audience_type?: string;
  subtype?: string;
  approximate_count?: number;
  data_source?: string;
  delivery_status?: string;
  operation_status?: string;
  opt_out_link?: string;
  permission_for_actions?: string;
  pixel_id?: string;
  retention_days?: number;
  rule?: string;
  time_created?: string;
  time_updated?: string;
}

export interface SavedAudience {
  id: string;
  name: string;
  audience_type?: string;
  description?: string;
  targeting?: any;
  time_created?: string;
  time_updated?: string;
  sentence_lines?: string[];
  approximate_count?: number;
}

export interface AdImage {
  hash: string;
  url: string;
  url_128?: string;
  width?: number;
  height?: number;
  original_width?: number;
  original_height?: number;
  name?: string;
  status?: string;
  account_id?: string;
  created_time?: string;
}

export interface AdVideo {
  id: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  source?: string;
  status?: string;
  length?: number;
  created_time?: string;
  updated_time?: string;
  file_size?: number;
  format?: any[];
}

export interface Business {
  id: string;
  name: string;
  link?: string;
  primary_page?: any;
  timezone_id?: number;
  two_factor_type?: string;
  updated_time?: string;
  verification_status?: string;
  vertical?: string;
  vertical_id?: number;
}

export interface Page {
  id: string;
  name: string;
  category?: string;
  category_list?: any[];
  link?: string;
  picture?: any;
  access_token?: string;
  fan_count?: number;
  talking_about_count?: number;
  username?: string;
  website?: string;
  about?: string;
  phone?: string;
  emails?: string[];
}

export interface Conversion {
  id: string;
  name: string;
  description?: string;
  event_source_type?: string;
  rule?: string;
  creation_time?: string;
  last_fired_time?: string;
  is_archived?: boolean;
  is_unavailable?: boolean;
  pixel?: {
    id: string;
    name: string;
  };
}

export interface Pixel {
  id: string;
  name: string;
  creation_time?: string;
  last_fired_time?: string;
  code?: string;
  is_created_by_business?: boolean;
  owner_business?: {
    id: string;
    name: string;
  };
  owner_ad_account?: {
    id: string;
    name: string;
  };
}

export interface AdLabel {
  id: string;
  name: string;
  created_time?: string;
  updated_time?: string;
  account?: {
    id: string;
    name: string;
  };
}

export interface LeadGenForm {
  id: string;
  name: string;
  status: string;
  locale?: string;
  page?: {
    id: string;
    name: string;
  };
  privacy_policy_url?: string;
  questions?: any[];
  created_time?: string;
  leads_count?: number;
  follow_up_action_url?: string;
  is_optimized_for_quality?: boolean;
}