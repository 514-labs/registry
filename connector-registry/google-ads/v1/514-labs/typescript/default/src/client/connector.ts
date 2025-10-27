import { ApiConnectorBase } from '@connector-factory/core'
import type { ConnectorConfig as CoreConfig, Hook } from '@connector-factory/core'
import { createLoggingHooks } from '../observability/logging-hooks'
import { createMetricsHooks, InMemoryMetricsSink } from '../observability/metrics-hooks'
import { createTypiaValidationHooks } from '../validation/typia-hooks'
import { createAdsResource } from '../resources/ads'
import { createCampaignsResource } from '../resources/campaigns'
import { createAdGroupsResource } from '../resources/ad_groups'
import { createKeywordsResource } from '../resources/keywords'
import { createCustomersResource } from '../resources/customers'

export type ConnectorConfig = CoreConfig & {
  logging?: { enabled?: boolean; level?: 'debug'|'info'|'warn'|'error'; includeQueryParams?: boolean; includeHeaders?: boolean; includeBody?: boolean; logger?: (level: string, event: Record<string, unknown>) => void }
  metrics?: { enabled?: boolean }
  validation?: { enabled?: boolean; strict?: boolean }
}

export class Connector extends ApiConnectorBase {
  initialize(userConfig: ConnectorConfig) {
    const withDefaults = (u: ConnectorConfig): ConnectorConfig => ({
      baseUrl: u.baseUrl ?? 'https://googleads.googleapis.com/v21',  // Updated to v21 (v16-v18 are deprecated)
      userAgent: u.userAgent ?? 'google-ads-connector',
      timeoutMs: u.timeoutMs ?? 30000,
      ...u
    })
    super.initialize(withDefaults(userConfig) as any, (cfg: any) => cfg)

    const cfg = (this as any).config as ConnectorConfig
    const existing = cfg.hooks ?? {} as Partial<Record<'beforeRequest'|'afterResponse'|'onError'|'onRetry', Hook[]>>

    if (userConfig.validation?.enabled) {
      const validation = createTypiaValidationHooks({ strict: userConfig.validation?.strict })
      const curr = cfg.hooks ?? {}
      cfg.hooks = {
        beforeRequest: [...(curr.beforeRequest ?? [])],
        afterResponse: [...(curr.afterResponse ?? []), ...(validation.afterResponse ?? [])],
        onError: [...(curr.onError ?? [])],
        onRetry: [...(curr.onRetry ?? [])],
      }
    }

    if (userConfig.logging?.enabled) {
      const logging = createLoggingHooks({ level: userConfig.logging.level, includeQueryParams: userConfig.logging.includeQueryParams, includeHeaders: userConfig.logging.includeHeaders, includeBody: userConfig.logging.includeBody, logger: userConfig.logging.logger as any })
      const curr = cfg.hooks ?? {}
      cfg.hooks = {
        beforeRequest: [...(curr.beforeRequest ?? []), ...(logging.beforeRequest ?? [])],
        afterResponse: [...(curr.afterResponse ?? []), ...(logging.afterResponse ?? [])],
        onError: [...(curr.onError ?? []), ...(logging.onError ?? [])],
        onRetry: [...(curr.onRetry ?? []), ...(logging.onRetry ?? [])],
      }
    }

    if (userConfig.metrics?.enabled) {
      const sink = new InMemoryMetricsSink()
      const metrics = createMetricsHooks(sink)
      const curr = cfg.hooks ?? {}
      cfg.hooks = {
        beforeRequest: [...(curr.beforeRequest ?? []), ...(metrics.beforeRequest ?? [])],
        afterResponse: [...(curr.afterResponse ?? []), ...(metrics.afterResponse ?? [])],
        onError: [...(curr.onError ?? []), ...(metrics.onError ?? [])],
        onRetry: [...(curr.onRetry ?? []), ...(metrics.onRetry ?? [])],
      }
      ;(this as any)._metricsSink = sink
    }
  }

  private get sendLite() { return async (args: any) => (this as any).request(args) }

  get ads() { return createAdsResource(this.sendLite as any) }
  get campaigns() { return createCampaignsResource(this.sendLite as any) }
  get adGroups() { return createAdGroupsResource(this.sendLite as any) }
  get keywords() { return createKeywordsResource(this.sendLite as any) }
  get customers() { return createCustomersResource(this.sendLite as any) }
}

export function createConnector() { return new Connector() }
