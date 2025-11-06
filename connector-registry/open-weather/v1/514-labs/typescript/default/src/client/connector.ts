import { ApiConnectorBase } from '@connector-factory/core'
import type { ConnectorConfig as CoreConfig, Hook } from '@connector-factory/core'
import { createLoggingHooks } from '../observability/logging-hooks'
import { createMetricsHooks, InMemoryMetricsSink } from '../observability/metrics-hooks'
import { createResource as createWeatherResource } from '../resources/current-weather'
import { createResource as createForecastResource } from '../resources/forecast'
import { createResource as createGeocodingResource } from '../resources/geocoding'
import { createResource as createAirPollutionResource } from '../resources/air-pollution'

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

export type ConnectorConfig = CoreConfig & {
  logging?: { enabled?: boolean; level?: 'debug'|'info'|'warn'|'error'; includeQueryParams?: boolean; includeHeaders?: boolean; includeBody?: boolean; logger?: (level: string, event: Record<string, unknown>) => void },
  metrics?: { enabled?: boolean }
}

export class Connector extends ApiConnectorBase {
  private apiKey!: string
  private defaultUnits!: string
  private defaultLang!: string

  init(userConfig: OpenWeatherConnectorConfig) {
    this.apiKey = userConfig.apiKey
    this.defaultUnits = userConfig.units ?? 'standard'
    this.defaultLang = userConfig.lang ?? 'en'

    const coreConfig: CoreConfig = {
      baseUrl: 'https://api.openweathermap.org',
      userAgent: 'open-weather-connector',
      auth: {
        type: 'bearer',
        bearer: { token: '' } // We use query param for auth, not header
      },
    }

    super.initialize(coreConfig as any, (cfg: any) => cfg)

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

  private get sendLite() { 
    return async (args: any) => {
      // Inject API key into query params
      const query = { ...args.query, appid: this.apiKey }
      return (this as any).request({ ...args, query })
    }
  }

  /** Current weather data */
  get weather() { 
    return createWeatherResource(this.sendLite as any, this.defaultUnits, this.defaultLang) 
  }

  /** Weather forecast data */
  get forecast() { 
    return createForecastResource(this.sendLite as any, this.defaultUnits, this.defaultLang) 
  }

  /** Geocoding API for location resolution */
  get geocoding() { 
    return createGeocodingResource(this.sendLite as any) 
  }

  /** Air pollution data */
  get airPollution() { 
    return createAirPollutionResource(this.sendLite as any) 
  }
}

export function createConnector() { return new Connector() }
