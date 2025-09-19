import type { HttpResponseEnvelope } from "./envelopes";

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

  // Ad Accounts
  listAdAccounts(params?: { fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<AdAccount[]>>;
  streamAdAccounts(params?: { fields?: string[]; pageSize?: number }): AsyncIterable<AdAccount>;
  getAdAccounts(params?: { fields?: string[]; pageSize?: number; maxItems?: number }): Promise<AdAccount[]>;

  // Campaigns (requires adAccountId)
  listCampaigns(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<Campaign[]>>;
  getCampaign(params: { adAccountId: string; id: string; fields?: string[] }): Promise<HttpResponseEnvelope<Campaign>>;
  streamCampaigns(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<Campaign>;
  getCampaigns(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<Campaign[]>;

  // Ad Sets
  listAdSets(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<AdSet[]>>;
  getAdSet(params: { adAccountId: string; id: string; fields?: string[] }): Promise<HttpResponseEnvelope<AdSet>>;
  streamAdSets(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<AdSet>;
  getAdSets(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<AdSet[]>;

  // Ads
  listAds(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<Ad[]>>;
  getAd(params: { adAccountId: string; id: string; fields?: string[] }): Promise<HttpResponseEnvelope<Ad>>;
  streamAds(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<Ad>;
  getAds(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<Ad[]>;

  // Insights
  getInsights(params: { objectId: string; level: "account" | "campaign" | "adset" | "ad"; fields?: string[]; timeRange?: { since: string; until: string }; limit?: number; after?: string }): Promise<HttpResponseEnvelope<Insight[]>>;
  streamInsights(params: { objectId: string; level: "account" | "campaign" | "adset" | "ad"; fields?: string[]; timeRange?: { since: string; until: string }; pageSize?: number }): AsyncIterable<Insight>;
  getInsightsAll(params: { objectId: string; level: "account" | "campaign" | "adset" | "ad"; fields?: string[]; timeRange?: { since: string; until: string }; pageSize?: number; maxItems?: number }): Promise<Insight[]>;

  // Ad Creatives
  listAdCreatives(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<AdCreative[]>>;
  getAdCreative(params: { adAccountId: string; id: string; fields?: string[] }): Promise<HttpResponseEnvelope<AdCreative>>;
  streamAdCreatives(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<AdCreative>;
  getAdCreatives(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<AdCreative[]>;

  // Custom Audiences
  listCustomAudiences(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<CustomAudience[]>>;
  getCustomAudience(params: { adAccountId: string; id: string; fields?: string[] }): Promise<HttpResponseEnvelope<CustomAudience>>;
  streamCustomAudiences(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<CustomAudience>;
  getCustomAudiences(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<CustomAudience[]>;

  // Saved Audiences (Interests/Demographics targeting)
  listSavedAudiences(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<SavedAudience[]>>;
  getSavedAudience(params: { adAccountId: string; id: string; fields?: string[] }): Promise<HttpResponseEnvelope<SavedAudience>>;
  streamSavedAudiences(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<SavedAudience>;
  getSavedAudiences(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<SavedAudience[]>;

  // Ad Images
  listAdImages(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<AdImage[]>>;
  getAdImage(params: { adAccountId: string; hash: string; fields?: string[] }): Promise<HttpResponseEnvelope<AdImage>>;
  streamAdImages(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<AdImage>;
  getAdImages(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<AdImage[]>;

  // Ad Videos
  listAdVideos(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<AdVideo[]>>;
  getAdVideo(params: { adAccountId: string; id: string; fields?: string[] }): Promise<HttpResponseEnvelope<AdVideo>>;
  streamAdVideos(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<AdVideo>;
  getAdVideos(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<AdVideo[]>;

  // Business Manager
  listBusinesses(params?: { fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<Business[]>>;
  getBusiness(params: { id: string; fields?: string[] }): Promise<HttpResponseEnvelope<Business>>;
  streamBusinesses(params?: { fields?: string[]; pageSize?: number }): AsyncIterable<Business>;
  getBusinesses(params?: { fields?: string[]; pageSize?: number; maxItems?: number }): Promise<Business[]>;

  // Pages
  listPages(params?: { fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<Page[]>>;
  getPage(params: { id: string; fields?: string[] }): Promise<HttpResponseEnvelope<Page>>;
  streamPages(params?: { fields?: string[]; pageSize?: number }): AsyncIterable<Page>;
  getPages(params?: { fields?: string[]; pageSize?: number; maxItems?: number }): Promise<Page[]>;
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