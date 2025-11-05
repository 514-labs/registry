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
import { createResource as createWeatherResource } from '../resources/weather'
import { createResource as createForecastResource } from '../resources/forecast'
import { createResource as createAirPollutionResource } from '../resources/air-pollution'
import { createResource as createGeocodingResource } from '../resources/geocoding'

export type OpenWeatherConfig = {
  apiKey: string
  units?: 'standard' | 'metric' | 'imperial'
  lang?: string
  baseUrl?: string
  logging?: { enabled?: boolean; level?: 'debug'|'info'|'warn'|'error'; includeQueryParams?: boolean; includeHeaders?: boolean; includeBody?: boolean; logger?: (level: string, event: Record<string, unknown>) => void }
  metrics?: { enabled?: boolean }
}

export type ConnectorConfig = CoreConfig & {
  logging?: { enabled?: boolean; level?: 'debug'|'info'|'warn'|'error'; includeQueryParams?: boolean; includeHeaders?: boolean; includeBody?: boolean; logger?: (level: string, event: Record<string, unknown>) => void },
  metrics?: { enabled?: boolean }
}

export class Connector extends ApiConnectorBase {
  private apiKey?: string
  private defaultUnits?: string
  private defaultLang?: string

  init(userConfig: OpenWeatherConfig) {
    this.apiKey = userConfig.apiKey
    this.defaultUnits = userConfig.units || 'standard'
    this.defaultLang = userConfig.lang

    const coreConfig: CoreConfig = {
      baseUrl: userConfig.baseUrl || 'https://api.openweathermap.org',
      userAgent: 'openweather-connector',
      auth: { type: 'bearer', bearer: { token: '' } }, // We use query params for auth
    }

    const apiKeyHook: Hook = {
      name: 'openweather-auth',
      execute: async (ctx) => {
        if (ctx.type === 'beforeRequest') {
          // Add API key to query params
          const url = new URL(ctx.request.url)
          url.searchParams.set('appid', this.apiKey!)
          
          // Add default units if not already specified
          if (this.defaultUnits && !url.searchParams.has('units')) {
            url.searchParams.set('units', this.defaultUnits)
          }
          
          // Add default language if not already specified
          if (this.defaultLang && !url.searchParams.has('lang')) {
            url.searchParams.set('lang', this.defaultLang)
          }
          
          ctx.modifyRequest({ url: url.toString() })
        }
      }
    }

    const configWithAuth: CoreConfig = {
      ...coreConfig,
      hooks: {
        beforeRequest: [apiKeyHook]
      }
    }

    super.initialize(configWithAuth as any, (cfg: any) => cfg)

    // Set up logging/metrics as before
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

    return this
  }

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

  get weather() { return createWeatherResource(this.sendLite as any) }
  get forecast() { return createForecastResource(this.sendLite as any) }
  get airPollution() { return createAirPollutionResource(this.sendLite as any) }
  get geocoding() { return createGeocodingResource(this.sendLite as any) }
}

export function createConnector() { return new Connector() }
