/**
 * CONNECTOR IMPLEMENTATION GUIDE
 * See CONNECTOR_GUIDE.md in the root of this connector for step-by-step instructions.
 *
 * Quick checklist:
 * [ ] Phase 3: Configure authentication (update ConnectorConfig type & init method below)
 * [ ] Phase 4: Implement pagination in src/lib/paginate.ts (offset/cursor/page)
 * [ ] Phase 5: Implement resources in src/resources/
 * [ ] Phase 6: Add schemas to schemas/raw/json/
 * [ ] Phase 7: Update .env.example and README.md
 * [ ] Phase 8: Write tests in tests/
 * [ ] Phase 9: Build and test (pnpm run build && pnpm test)
 *
 * Reference connectors:
 * - Simple API key: connector-registry/socrata/
 * - OAuth2: connector-registry/meta-ads/
 */

import { ApiConnectorBase } from '@connector-factory/core'
import type { ConnectorConfig as CoreConfig, Hook } from '@connector-factory/core'
import { createLoggingHooks } from '../observability/logging-hooks'
import { createMetricsHooks, InMemoryMetricsSink } from '../observability/metrics-hooks'
import { createResource as createBatchesResource } from '../resources/batches'
import { createResource as createBrandsResource } from '../resources/brands'
import { createResource as createBuyersResource } from '../resources/buyers'
import { createResource as createBuyerContactLogsResource } from '../resources/buyer-contact-logs'
import { createResource as createBuyerStagesResource } from '../resources/buyer-stages'
import { createResource as createProductsResource } from '../resources/products'

/**
 * Apex Trading API Connector Configuration
 */
export type ApexConnectorConfig = {
  /** Bearer token for API authentication */
  accessToken: string
  /** Base URL (default: https://app.apextrading.com/api) */
  baseUrl?: string
  /** Request timeout in milliseconds */
  timeoutMs?: number
  /** User agent string */
  userAgent?: string
  /** Logging configuration */
  logging?: { enabled?: boolean; level?: 'debug'|'info'|'warn'|'error'; includeQueryParams?: boolean; includeHeaders?: boolean; includeBody?: boolean; logger?: (level: string, event: Record<string, unknown>) => void }
  /** Metrics configuration */
  metrics?: { enabled?: boolean }
  /** Rate limiting configuration */
  rateLimit?: { requestsPerSecond?: number }
}

export type ConnectorConfig = CoreConfig & {
  logging?: { enabled?: boolean; level?: 'debug'|'info'|'warn'|'error'; includeQueryParams?: boolean; includeHeaders?: boolean; includeBody?: boolean; logger?: (level: string, event: Record<string, unknown>) => void }
  metrics?: { enabled?: boolean }
}

export class Connector extends ApiConnectorBase {
  /**
   * Initialize the Apex connector with user configuration
   */
  init(userConfig: ApexConnectorConfig) {
    const baseUrl = userConfig.baseUrl ?? 'https://app.apextrading.com/api'
    
    const coreConfig: CoreConfig = {
      baseUrl,
      userAgent: userConfig.userAgent ?? 'apex-connector/0.1.0',
      timeoutMs: userConfig.timeoutMs ?? 30000,
      auth: {
        type: 'bearer',
        bearer: { token: userConfig.accessToken }
      },
      defaultHeaders: {
        'Accept': 'application/json'
      },
      rateLimit: {
        requestsPerSecond: userConfig.rateLimit?.requestsPerSecond ?? 15
      }
    }

    this.initialize(coreConfig as any)

    const cfg = (this as any).config as ConnectorConfig
    const existing = cfg.hooks ?? {} as Partial<Record<'beforeRequest'|'afterResponse'|'onError'|'onRetry', Hook[]>>

    if (userConfig.logging?.enabled) {
      const logging = createLoggingHooks({ 
        level: userConfig.logging.level, 
        includeQueryParams: userConfig.logging.includeQueryParams, 
        includeHeaders: userConfig.logging.includeHeaders, 
        includeBody: userConfig.logging.includeBody, 
        logger: userConfig.logging.logger as any 
      })
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

  // Keep the old initialize method for backward compatibility
  initialize(userConfig: ConnectorConfig) {
    const withDefaults = (u: ConnectorConfig): ConnectorConfig => ({ userAgent: u.userAgent ?? 'apex', ...u })
    super.initialize(withDefaults(userConfig) as any, (cfg: any) => cfg)
    return this
  }

  private get sendLite() { return async (args: any) => (this as any).request(args) }

  // Resource getters
  get batches() { return createBatchesResource(this.sendLite as any) }
  get brands() { return createBrandsResource(this.sendLite as any) }
  get buyers() { return createBuyersResource(this.sendLite as any) }
  get buyerContactLogs() { return createBuyerContactLogsResource(this.sendLite as any) }
  get buyerStages() { return createBuyerStagesResource(this.sendLite as any) }
  get products() { return createProductsResource(this.sendLite as any) }
}

export function createConnector() { return new Connector() }
