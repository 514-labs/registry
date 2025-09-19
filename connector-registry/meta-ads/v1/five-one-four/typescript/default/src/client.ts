import type { MetaAdsConnector } from "./types/connector";
import type { ConnectorConfig } from "./types/config";
import { withDerivedDefaults } from "./config/defaults";
import { ApiConnectorBase, type RateLimitOptions } from "@connector-factory/core";
import { ConnectorError } from "./types/errors";
import { buildAdAccountsDomain } from "./domains/adaccounts";
import { buildCampaignsDomain } from "./domains/campaigns";
import { buildAdSetsDomain } from "./domains/adsets";
import { buildAdsDomain } from "./domains/ads";
import { buildInsightsDomain } from "./domains/insights";
import { buildAdCreativesDomain } from "./domains/adcreatives";
import { buildCustomAudiencesDomain } from "./domains/customaudiences";
import { buildSavedAudiencesDomain } from "./domains/savedaudiences";
import { buildAdImagesDomain } from "./domains/adimages";
import { buildAdVideosDomain } from "./domains/advideos";
import { buildBusinessesDomain } from "./domains/businesses";
import { buildPagesDomain } from "./domains/pages";
import type { SendFn } from "./domains/factory";

export class MetaAdsApiConnector extends ApiConnectorBase implements MetaAdsConnector {
  initialize(userConfig: ConnectorConfig) {
    const rateLimitOptions: RateLimitOptions = {
      onRateLimitSignal: (info) => {
        // Facebook Graph API uses different rate limit headers
        if (this.config?.rateLimit?.adaptiveFromHeaders && this.limiter) {
          (this.limiter as any).updateFromResponse(info);
        }
      },
    };

    super.initialize(
      userConfig,
      withDerivedDefaults,
      ({ headers }: { headers: Record<string, string> }) => {
        if (this.config?.auth.type === "bearer") {
          const token = this.config?.auth.bearer?.token;
          if (!token) {
            throw new ConnectorError({
              message: "Authentication failed – missing bearer token",
              code: "AUTH_FAILED",
              source: "auth",
              retryable: false,
            });
          }
          headers["Authorization"] = `Bearer ${token}`;
        }
      },
      rateLimitOptions
    );
  }

  private get domain() {
    const sendLite: SendFn = async (args) => this.send<any>(args);
    return {
      ...buildAdAccountsDomain(sendLite),
      ...buildCampaignsDomain(sendLite),
      ...buildAdSetsDomain(sendLite),
      ...buildAdsDomain(sendLite),
      ...buildInsightsDomain(sendLite),
      ...buildAdCreativesDomain(sendLite),
      ...buildCustomAudiencesDomain(sendLite),
      ...buildSavedAudiencesDomain(sendLite),
      ...buildAdImagesDomain(sendLite),
      ...buildAdVideosDomain(sendLite),
      ...buildBusinessesDomain(sendLite),
      ...buildPagesDomain(sendLite),
    };
  }

  // Low-level request method
  request = (options: {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    query?: Record<string, string | number | boolean | undefined>;
    headers?: Record<string, string>;
    body?: unknown;
    timeoutMs?: number;
    operation?: string;
  }) => this.send<any>(options);

  // Ad Accounts
  listAdAccounts = (params?: { fields?: string[]; limit?: number; after?: string }) => this.domain.listAdAccounts(params);
  streamAdAccounts = (params?: { fields?: string[]; pageSize?: number }) => this.domain.streamAdAccounts(params);
  getAdAccounts = (params?: { fields?: string[]; pageSize?: number; maxItems?: number }) => this.domain.getAdAccounts(params);

  // Campaigns
  listCampaigns = (params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }) => this.domain.listCampaigns(params);
  getCampaign = (params: { adAccountId: string; id: string; fields?: string[] }) => this.domain.getCampaign(params);
  streamCampaigns = (params: { adAccountId: string; fields?: string[]; pageSize?: number }) => this.domain.streamCampaigns(params);
  getCampaigns = (params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }) => this.domain.getCampaigns(params);

  // Ad Sets
  listAdSets = (params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }) => this.domain.listAdSets(params);
  getAdSet = (params: { adAccountId: string; id: string; fields?: string[] }) => this.domain.getAdSet(params);
  streamAdSets = (params: { adAccountId: string; fields?: string[]; pageSize?: number }) => this.domain.streamAdSets(params);
  getAdSets = (params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }) => this.domain.getAdSets(params);

  // Ads
  listAds = (params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }) => this.domain.listAds(params);
  getAd = (params: { adAccountId: string; id: string; fields?: string[] }) => this.domain.getAd(params);
  streamAds = (params: { adAccountId: string; fields?: string[]; pageSize?: number }) => this.domain.streamAds(params);
  getAds = (params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }) => this.domain.getAds(params);

  // Insights
  getInsights = (params: { objectId: string; level: "account" | "campaign" | "adset" | "ad"; fields?: string[]; timeRange?: { since: string; until: string }; limit?: number; after?: string }) => this.domain.getInsights(params);
  streamInsights = (params: { objectId: string; level: "account" | "campaign" | "adset" | "ad"; fields?: string[]; timeRange?: { since: string; until: string }; pageSize?: number }) => this.domain.streamInsights(params);
  getInsightsAll = (params: { objectId: string; level: "account" | "campaign" | "adset" | "ad"; fields?: string[]; timeRange?: { since: string; until: string }; pageSize?: number; maxItems?: number }) => this.domain.getInsightsAll(params);

  // Ad Creatives
  listAdCreatives = (params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }) => this.domain.listAdCreatives(params);
  getAdCreative = (params: { adAccountId: string; id: string; fields?: string[] }) => this.domain.getAdCreative(params);
  streamAdCreatives = (params: { adAccountId: string; fields?: string[]; pageSize?: number }) => this.domain.streamAdCreatives(params);
  getAdCreatives = (params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }) => this.domain.getAdCreatives(params);

  // Custom Audiences
  listCustomAudiences = (params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }) => this.domain.listCustomAudiences(params);
  getCustomAudience = (params: { adAccountId: string; id: string; fields?: string[] }) => this.domain.getCustomAudience(params);
  streamCustomAudiences = (params: { adAccountId: string; fields?: string[]; pageSize?: number }) => this.domain.streamCustomAudiences(params);
  getCustomAudiences = (params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }) => this.domain.getCustomAudiences(params);

  // Saved Audiences
  listSavedAudiences = (params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }) => this.domain.listSavedAudiences(params);
  getSavedAudience = (params: { adAccountId: string; id: string; fields?: string[] }) => this.domain.getSavedAudience(params);
  streamSavedAudiences = (params: { adAccountId: string; fields?: string[]; pageSize?: number }) => this.domain.streamSavedAudiences(params);
  getSavedAudiences = (params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }) => this.domain.getSavedAudiences(params);

  // Ad Images
  listAdImages = (params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }) => this.domain.listAdImages(params);
  getAdImage = (params: { adAccountId: string; hash: string; fields?: string[] }) => this.domain.getAdImage(params);
  streamAdImages = (params: { adAccountId: string; fields?: string[]; pageSize?: number }) => this.domain.streamAdImages(params);
  getAdImages = (params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }) => this.domain.getAdImages(params);

  // Ad Videos
  listAdVideos = (params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }) => this.domain.listAdVideos(params);
  getAdVideo = (params: { adAccountId: string; id: string; fields?: string[] }) => this.domain.getAdVideo(params);
  streamAdVideos = (params: { adAccountId: string; fields?: string[]; pageSize?: number }) => this.domain.streamAdVideos(params);
  getAdVideos = (params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }) => this.domain.getAdVideos(params);

  // Businesses
  listBusinesses = (params?: { fields?: string[]; limit?: number; after?: string }) => this.domain.listBusinesses(params);
  getBusiness = (params: { id: string; fields?: string[] }) => this.domain.getBusiness(params);
  streamBusinesses = (params?: { fields?: string[]; pageSize?: number }) => this.domain.streamBusinesses(params);
  getBusinesses = (params?: { fields?: string[]; pageSize?: number; maxItems?: number }) => this.domain.getBusinesses(params);

  // Pages
  listPages = (params?: { fields?: string[]; limit?: number; after?: string }) => this.domain.listPages(params);
  getPage = (params: { id: string; fields?: string[] }) => this.domain.getPage(params);
  streamPages = (params?: { fields?: string[]; pageSize?: number }) => this.domain.streamPages(params);
  getPages = (params?: { fields?: string[]; pageSize?: number; maxItems?: number }) => this.domain.getPages(params);
}

export function createMetaAdsConnector(): MetaAdsConnector {
  return new MetaAdsApiConnector();
}