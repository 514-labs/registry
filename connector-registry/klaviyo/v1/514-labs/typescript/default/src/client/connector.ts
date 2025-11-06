/**
 * Klaviyo Connector Implementation
 * 
 * Klaviyo API uses:
 * - Authentication: Private API Key via "Authorization: Klaviyo-API-Key <key>" header
 * - Base URL: https://a.klaviyo.com
 * - Pagination: Cursor-based using page[cursor] and page[size] parameters
 * - API Version: 2024-10-15 (revision) passed via header
 */
import { ApiConnectorBase } from '@connector-factory/core'
import type { ConnectorConfig as CoreConfig, Hook } from '@connector-factory/core'
import { createLoggingHooks } from '../observability/logging-hooks'
import { createMetricsHooks, InMemoryMetricsSink } from '../observability/metrics-hooks'
import { createResource as createProfilesResource } from '../resources/profiles'
import { createResource as createListsResource } from '../resources/lists'
import { createResource as createCampaignsResource } from '../resources/campaigns'

/**
 * Configuration for Klaviyo connector
 */
export type KlaviyoConnectorConfig = {
  /** Private API key from Klaviyo dashboard */
  apiKey: string
  /** API revision date (default: 2024-10-15) */
  revision?: string
  /** Request timeout in milliseconds (default: 30000) */
  timeoutMs?: number
  /** Logging configuration */
  logging?: { enabled?: boolean; level?: 'debug'|'info'|'warn'|'error'; includeQueryParams?: boolean; includeHeaders?: boolean; includeBody?: boolean; logger?: (level: string, event: Record<string, unknown>) => void }
  /** Metrics configuration */
  metrics?: { enabled?: boolean }
}

export class Connector extends ApiConnectorBase {
  init(userConfig: KlaviyoConnectorConfig) {
    const coreConfig: CoreConfig = {
      baseUrl: 'https://a.klaviyo.com',
      userAgent: 'klaviyo-connector',
      defaultHeaders: {
        'Authorization': `Klaviyo-API-Key ${userConfig.apiKey}`,
        'revision': userConfig.revision ?? '2024-10-15',
      },
      auth: { type: 'bearer', bearer: { token: '' } }, // Auth handled via headers
      timeoutMs: userConfig.timeoutMs ?? 30000,
    }

    super.initialize(coreConfig, (cfg) => cfg)

    const cfg = (this as any).config as CoreConfig & { logging?: any; metrics?: any }
    const existing = cfg.hooks ?? {} as Partial<Record<'beforeRequest'|'afterResponse'|'onError'|'onRetry', Hook[]>>

    if (userConfig.logging?.enabled) {
      const logging = createLoggingHooks({ level: userConfig.logging.level, includeQueryParams: userConfig.logging.includeQueryParams, includeHeaders: userConfig.logging.includeHeaders, includeBody: userConfig.logging.includeBody, logger: userConfig.logging.logger as any })
      cfg.hooks = {
        beforeRequest: [...(existing.beforeRequest ?? []), ...(logging.beforeRequest ?? [])],
        afterResponse: [...(existing.afterResponse ?? []), ...(logging.afterResponse ?? [])],
        onError: [...(existing.onError ?? []), ...(logging.onError ?? [])],
        onRetry: [...(existing.onRetry ?? []), ...(logging.onRetry ?? [])],
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
    
    return this
  }

  private get sendLite() { return async (args: any) => (this as any).request(args) }

  get profiles() { return createProfilesResource(this.sendLite as any) }
  get lists() { return createListsResource(this.sendLite as any) }
  get campaigns() { return createCampaignsResource(this.sendLite as any) }
}

export function createConnector() { return new Connector() }

