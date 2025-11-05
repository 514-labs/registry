import { ApiConnectorBase } from '@connector-factory/core'
import type { ConnectorConfig as CoreConfig, Hook } from '@connector-factory/core'
import { createLoggingHooks } from '../observability/logging-hooks'
import { createMetricsHooks, InMemoryMetricsSink } from '../observability/metrics-hooks'
import { createResource as createDefaultResource } from '../resources/current-weather'

export type ConnectorConfig = CoreConfig & {
  logging?: { enabled?: boolean; level?: 'debug'|'info'|'warn'|'error'; includeQueryParams?: boolean; includeHeaders?: boolean; includeBody?: boolean; logger?: (level: string, event: Record<string, unknown>) => void },
  metrics?: { enabled?: boolean }
}

export class Connector extends ApiConnectorBase {
  initialize(userConfig: ConnectorConfig) {
    const withDefaults = (u: ConnectorConfig): ConnectorConfig => ({ userAgent: u.userAgent ?? 'open-weather', ...u })
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

  get current-weather() { return createDefaultResource(this.sendLite as any) }
}

export function createConnector() { return new Connector() }
