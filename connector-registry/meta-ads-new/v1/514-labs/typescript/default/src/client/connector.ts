import { ApiConnectorBase, type RateLimitOptions } from '@connector-factory/core'
import type { ConnectorConfig as CoreConfig, Hook } from '@connector-factory/core'
import { createLoggingHooks } from '../observability/logging-hooks'
import { createMetricsHooks, InMemoryMetricsSink } from '../observability/metrics-hooks'
import type { ConnectorConfig } from '../types/config'
import { withDerivedDefaults } from '../config/defaults'
import { ConnectorError } from '../types/errors'
import type { MetaAdsConnector } from '../types/connector'
import type { SendFn } from '../lib/paginate'

// Import all resources
import { createAdAccountsResource } from '../resources/adaccounts'
import { createCampaignsResource } from '../resources/campaigns'
import { createAdSetsResource } from '../resources/adsets'
import { createAdsResource } from '../resources/ads'
import { createInsightsResource } from '../resources/insights'
import { createAdCreativesResource } from '../resources/adcreatives'
import { createCustomAudiencesResource } from '../resources/customaudiences'
import { createSavedAudiencesResource } from '../resources/savedaudiences'
import { createAdImagesResource } from '../resources/adimages'
import { createAdVideosResource } from '../resources/advideos'
import { createBusinessesResource } from '../resources/businesses'
import { createPagesResource } from '../resources/pages'
import { createConversionsResource } from '../resources/conversions'
import { createPixelsResource } from '../resources/pixels'
import { createAdLabelsResource } from '../resources/adlabels'
import { createLeadGenFormsResource } from '../resources/leadgenforms'

export class MetaAdsApiConnector extends ApiConnectorBase implements MetaAdsConnector {
  initialize(userConfig: ConnectorConfig) {
    const rateLimitOptions: RateLimitOptions = {
      onRateLimitSignal: (info) => {
        // Facebook Graph API uses different rate limit headers
        if (this.config?.rateLimit?.adaptiveFromHeaders && this.limiter) {
          (this.limiter as any).updateFromResponse(info)
        }
      },
    }

    super.initialize(
      userConfig,
      withDerivedDefaults,
      ({ headers }: { headers: Record<string, string> }) => {
        if (this.config?.auth.type === 'bearer') {
          const token = this.config?.auth.bearer?.token
          if (!token) {
            throw new ConnectorError({
              message: 'Authentication failed – missing bearer token',
              code: 'AUTH_FAILED',
              source: 'auth',
              retryable: false,
            })
          }
          headers['Authorization'] = `Bearer ${token}`
        }
      },
      rateLimitOptions
    )
  }

  private get sendLite(): SendFn {
    return async (args) => this.send<any>(args)
  }

  // Low-level request method
  request = (options: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    path: string
    query?: Record<string, string | number | boolean | undefined>
    headers?: Record<string, string>
    body?: unknown
    timeoutMs?: number
    operation?: string
  }) => this.send<any>(options)

  // Resources
  get adAccounts() { return createAdAccountsResource(this.sendLite) }
  get campaigns() { return createCampaignsResource(this.sendLite) }
  get adSets() { return createAdSetsResource(this.sendLite) }
  get ads() { return createAdsResource(this.sendLite) }
  get insights() { return createInsightsResource(this.sendLite) }
  get adCreatives() { return createAdCreativesResource(this.sendLite) }
  get customAudiences() { return createCustomAudiencesResource(this.sendLite) }
  get savedAudiences() { return createSavedAudiencesResource(this.sendLite) }
  get adImages() { return createAdImagesResource(this.sendLite) }
  get adVideos() { return createAdVideosResource(this.sendLite) }
  get businesses() { return createBusinessesResource(this.sendLite) }
  get pages() { return createPagesResource(this.sendLite) }
  get conversions() { return createConversionsResource(this.sendLite) }
  get pixels() { return createPixelsResource(this.sendLite) }
  get adLabels() { return createAdLabelsResource(this.sendLite) }
  get leadGenForms() { return createLeadGenFormsResource(this.sendLite) }
}

export function createMetaAdsConnector(): MetaAdsConnector {
  return new MetaAdsApiConnector()
}
