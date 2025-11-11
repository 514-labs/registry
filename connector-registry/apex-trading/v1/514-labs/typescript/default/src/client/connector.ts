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
import type { ConnectorConfig, Hook } from '@connector-factory/core'
import { createLoggingHooks } from '../observability/logging-hooks'
import { createMetricsHooks, InMemoryMetricsSink } from '../observability/metrics-hooks'
import { createResource as createAccountsResource } from '../resources/accounts'
import { createResource as createOrdersResource } from '../resources/orders'
import { createResource as createTradesResource } from '../resources/trades'
import { createResource as createProductsResource } from '../resources/products'

export type ApexTradingConfig = ConnectorConfig & {
  apiKey?: string
  apiSecret?: string
  apiPassphrase?: string
  environment?: 'production' | 'testnet'
  logging?: { enabled?: boolean; level?: 'debug'|'info'|'warn'|'error'; includeQueryParams?: boolean; includeHeaders?: boolean; includeBody?: boolean; logger?: (level: string, event: Record<string, unknown>) => void }
  metrics?: { enabled?: boolean }
}

export class Connector extends ApiConnectorBase {
  initialize(userConfig: ApexTradingConfig) {
    const baseUrl = userConfig.baseUrl ?? 
      (userConfig.environment === 'testnet' 
        ? 'https://testnet.apex.exchange/api/v3'
        : 'https://omni.apex.exchange/api/v3')
    
    const apiKey = userConfig.apiKey ?? userConfig.auth?.bearer?.token
    
    const config: ConnectorConfig = {
      ...userConfig,
      baseUrl,
      userAgent: userConfig.userAgent ?? 'apex-trading-connector',
      defaultHeaders: {
        ...userConfig.defaultHeaders,
        ...(apiKey ? { 'X-API-Key': apiKey } : {}),
      },
      auth: userConfig.auth ?? {
        type: 'bearer',
        bearer: { token: apiKey ?? '' }
      },
      retry: userConfig.retry ?? {
        maxAttempts: 3,
        retryableStatusCodes: [429, 500, 502, 503, 504],
      },
      rateLimit: userConfig.rateLimit ?? {
        requestsPerSecond: 15, // API limit is 15 req/sec
      },
    }
    
    super.initialize(config, (cfg) => cfg)

    const cfg = (this as any).config as ConnectorConfig
    const existing = cfg.hooks ?? {}

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
  }

  private get sendLite() { return async (args: any) => (this as any).request(args) }

  get accounts() { return createAccountsResource(this.sendLite as any) }
  get orders() { return createOrdersResource(this.sendLite as any) }
  get trades() { return createTradesResource(this.sendLite as any) }
  get products() { return createProductsResource(this.sendLite as any) }
}

export function createConnector() { return new Connector() }


