import { ApiConnectorBase } from '@connector-factory/core'
import type { ConnectorConfig as CoreConfig, Hook } from '@connector-factory/core'
import { createLoggingHooks } from '../observability/logging-hooks'
import { createMetricsHooks, InMemoryMetricsSink } from '../observability/metrics-hooks'
import { createResource as createCurrentWeatherResource } from '../resources/current-weather'
import { createResource as createForecastResource } from '../resources/forecast'
import { createResource as createAirPollutionResource } from '../resources/air-pollution'
import { createResource as createGeocodingResource } from '../resources/geocoding'

export type OpenWeatherConnectorConfig = {
  apiKey: string
  units?: 'standard' | 'metric' | 'imperial'
  lang?: string
  logging?: { 
    enabled?: boolean
    level?: 'debug'|'info'|'warn'|'error'
    includeQueryParams?: boolean
    includeHeaders?: boolean
    includeBody?: boolean
    logger?: (level: string, event: Record<string, unknown>) => void 
  }
  metrics?: { enabled?: boolean }
}

export class Connector extends ApiConnectorBase {
  private apiKey!: string
  private defaultUnits?: string
  private defaultLang?: string

  init(userConfig: OpenWeatherConnectorConfig) {
    this.apiKey = userConfig.apiKey
    this.defaultUnits = userConfig.units
    this.defaultLang = userConfig.lang

    const coreConfig: CoreConfig = {
      baseUrl: 'https://api.openweathermap.org',
      userAgent: 'openweather-connector',
      auth: { type: 'bearer', bearer: { token: '' } }, // Dummy auth, we'll use query params
    }

    super.initialize(coreConfig, (cfg) => cfg)

    const cfg = (this as any).config as CoreConfig & OpenWeatherConnectorConfig
    const existing = cfg.hooks ?? {} as Partial<Record<'beforeRequest'|'afterResponse'|'onError'|'onRetry', Hook[]>>

    // Add hook to inject API key into query params
    const apiKeyHook = {
      execute: async (ctx: any) => {
        if (!ctx.request.query) {
          ctx.request.query = {}
        }
        ctx.request.query.appid = this.apiKey
        if (this.defaultUnits && !ctx.request.query.units) {
          ctx.request.query.units = this.defaultUnits
        }
        if (this.defaultLang && !ctx.request.query.lang) {
          ctx.request.query.lang = this.defaultLang
        }
      }
    }

    cfg.hooks = {
      ...existing,
      beforeRequest: [...(existing.beforeRequest ?? []), apiKeyHook as any],
    }

    if (userConfig.logging?.enabled) {
      const logging = createLoggingHooks({ 
        level: userConfig.logging.level, 
        includeQueryParams: userConfig.logging.includeQueryParams, 
        includeHeaders: userConfig.logging.includeHeaders, 
        includeBody: userConfig.logging.includeBody, 
        logger: userConfig.logging.logger as any 
      })
      const currentHooks = cfg.hooks ?? {}
      cfg.hooks = {
        beforeRequest: [...(currentHooks.beforeRequest ?? []), ...(logging.beforeRequest ?? [])],
        afterResponse: [...(currentHooks.afterResponse ?? []), ...(logging.afterResponse ?? [])],
        onError: [...(currentHooks.onError ?? []), ...(logging.onError ?? [])],
        onRetry: [...(currentHooks.onRetry ?? []), ...(logging.onRetry ?? [])],
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

  private get sendLite() { 
    return async (args: any) => (this as any).request(args) 
  }

  get currentWeather() { 
    return createCurrentWeatherResource(this.sendLite as any) 
  }

  get forecast() { 
    return createForecastResource(this.sendLite as any) 
  }

  get airPollution() { 
    return createAirPollutionResource(this.sendLite as any) 
  }

  get geocoding() { 
    return createGeocodingResource(this.sendLite as any) 
  }
}

export function createConnector() { return new Connector() }
