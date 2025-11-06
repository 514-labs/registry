import { ApiConnectorBase } from '@connector-factory/core'
import type { ConnectorConfig as CoreConfig, Hook } from '@connector-factory/core'
import { createLoggingHooks } from '../observability/logging-hooks'
import { createMetricsHooks, InMemoryMetricsSink } from '../observability/metrics-hooks'
import { createResource as createWeatherResource } from '../resources/weather'
import { createResource as createForecastResource } from '../resources/forecast'
import { createResource as createAirPollutionResource } from '../resources/air-pollution'
import { createResource as createGeocodingResource } from '../resources/geocoding'

export type OpenWeatherConnectorConfig = {
  apiKey: string
  units?: 'standard' | 'metric' | 'imperial'
  language?: string
  logging?: { enabled?: boolean; level?: 'debug'|'info'|'warn'|'error'; includeQueryParams?: boolean; includeHeaders?: boolean; includeBody?: boolean; logger?: (level: string, event: Record<string, unknown>) => void }
  metrics?: { enabled?: boolean }
}

export class Connector extends ApiConnectorBase {
  private apiKey: string = ''
  private defaultUnits: string = 'standard'
  private defaultLanguage: string = 'en'

  init(userConfig: OpenWeatherConnectorConfig) {
    this.apiKey = userConfig.apiKey
    this.defaultUnits = userConfig.units || 'standard'
    this.defaultLanguage = userConfig.language || 'en'

    const coreConfig: CoreConfig = {
      baseUrl: 'https://api.openweathermap.org',
      userAgent: 'oweather3-connector',
      auth: { type: 'bearer', bearer: { token: '' } }, // Dummy auth, we use query params
    }

    super.initialize(coreConfig as any, (cfg: any) => cfg)

    const cfg = (this as any).config as any
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

  private get sendLite() { 
    return async (args: any) => {
      // Add API key and default params to all requests
      const query = {
        ...args.query,
        appid: this.apiKey,
        units: args.query?.units || this.defaultUnits,
        lang: args.query?.lang || this.defaultLanguage,
      }
      // Handle different base paths for different endpoints
      let path = args.path
      if (path.startsWith('/data/2.5')) {
        // Weather and forecast APIs
        path = args.path
      } else if (path.startsWith('/geo/')) {
        // Geocoding API uses different path
        path = args.path
      } else {
        // Default to data/2.5
        path = '/data/2.5' + args.path
      }
      return (this as any).request({ ...args, path, query })
    }
  }

  get weather() { return createWeatherResource(this.sendLite as any) }
  get forecast() { return createForecastResource(this.sendLite as any) }
  get airPollution() { return createAirPollutionResource(this.sendLite as any) }
  get geocoding() { return createGeocodingResource(this.sendLite as any) }
}

export function createConnector() { return new Connector() }
