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
import { buildConversionsDomain } from "./domains/conversions";
import { buildPixelsDomain } from "./domains/pixels";
import { buildAdLabelsDomain } from "./domains/adlabels";
import { buildLeadGenFormsDomain } from "./domains/leadgenforms";
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

  private get sendLite(): SendFn {
    return async (args) => this.send<any>(args);
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

  // Resources
  get adAccounts() { return buildAdAccountsDomain(this.sendLite) }
  get campaigns() { return buildCampaignsDomain(this.sendLite) }
  get adSets() { return buildAdSetsDomain(this.sendLite) }
  get ads() { return buildAdsDomain(this.sendLite) }
  get insights() { return buildInsightsDomain(this.sendLite) }
  get adCreatives() { return buildAdCreativesDomain(this.sendLite) }
  get customAudiences() { return buildCustomAudiencesDomain(this.sendLite) }
  get savedAudiences() { return buildSavedAudiencesDomain(this.sendLite) }
  get adImages() { return buildAdImagesDomain(this.sendLite) }
  get adVideos() { return buildAdVideosDomain(this.sendLite) }
  get businesses() { return buildBusinessesDomain(this.sendLite) }
  get pages() { return buildPagesDomain(this.sendLite) }
  get conversions() { return buildConversionsDomain(this.sendLite) }
  get pixels() { return buildPixelsDomain(this.sendLite) }
  get adLabels() { return buildAdLabelsDomain(this.sendLite) }
  get leadGenForms() { return buildLeadGenFormsDomain(this.sendLite) }
}

export function createMetaAdsConnector(): MetaAdsConnector {
  return new MetaAdsApiConnector();
}