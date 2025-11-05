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

// TODO: Update ConnectorConfig type with your API's required fields (apiKey, domain, etc.)
// TODO: Implement init() method to transform your config to CoreConfig
// TODO: Add resource getters at the bottom of this file (get yourResource() { ... })
import { ApiConnectorBase } from '@connector-factory/core'
import type { ConnectorConfig as CoreConfig, Hook } from '@connector-factory/core'
import { createLoggingHooks } from '../observability/logging-hooks'
import { createMetricsHooks, InMemoryMetricsSink } from '../observability/metrics-hooks'
import { createResource as createDefaultResource } from '../resources/weather'

export type ConnectorConfig = CoreConfig & {
  logging?: { enabled?: boolean; level?: 'debug'|'info'|'warn'|'error'; includeQueryParams?: boolean; includeHeaders?: boolean; includeBody?: boolean; logger?: (level: string, event: Record<string, unknown>) => void },
  metrics?: { enabled?: boolean }
}

export class Connector extends ApiConnectorBase {
  initialize(userConfig: ConnectorConfig) {
    const withDefaults = (u: ConnectorConfig): ConnectorConfig => ({ userAgent: u.userAgent ?? 'openweather', ...u })
    super.initialize(withDefaults(userConfig) as any, (cfg: any) => cfg)

    const cfg = (this as any).config as ConnectorConfig
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
  }

  private get sendLite() { return async (args: any) => (this as any).request(args) }

  get weather() { return createDefaultResource(this.sendLite as any) }
}

export function createConnector() { return new Connector() }
