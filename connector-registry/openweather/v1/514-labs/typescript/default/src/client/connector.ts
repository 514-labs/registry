/**
 * OpenWeather API Connector
 * 
 * Provides access to OpenWeather API services:
 * - Current Weather Data
 * - 5-day Weather Forecast
 * - Air Pollution Data
 * - Geocoding
 */

import { ApiConnectorBase } from '@connector-factory/core'
import type { ConnectorConfig as CoreConfig, Hook } from '@connector-factory/core'
import { createLoggingHooks } from '../observability/logging-hooks'
import { createMetricsHooks, InMemoryMetricsSink } from '../observability/metrics-hooks'
import { createWeatherResource } from '../resources/weather'
import { createForecastResource } from '../resources/forecast'
import { createAirPollutionResource } from '../resources/air-pollution'
import { createGeocodingResource } from '../resources/geocoding'

export type OpenWeatherConnectorConfig = {
  apiKey: string
  baseUrl?: string
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
  init(userConfig: OpenWeatherConnectorConfig) {
    const baseUrl = userConfig.baseUrl ?? 'https://api.openweathermap.org'
    
    const coreConfig: CoreConfig = {
      baseUrl,
      userAgent: 'openweather-connector',
      defaultHeaders: {},
      auth: {
        type: 'bearer',
        bearer: { token: '' } // Not used, API key is in query params
      },
    }

    super.initialize(coreConfig as any, (cfg: any) => cfg)

    const cfg = (this as any).config as CoreConfig & OpenWeatherConnectorConfig
    cfg.apiKey = userConfig.apiKey
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

  private get sendLite() { 
    return async (args: any) => {
      const cfg = (this as any).config as CoreConfig & OpenWeatherConnectorConfig
      // Add API key to all requests as query parameter
      const query = { ...args.query, appid: cfg.apiKey }
      return (this as any).request({ ...args, query })
    }
  }

  get weather() { return createWeatherResource(this.sendLite as any) }
  get forecast() { return createForecastResource(this.sendLite as any) }
  get airPollution() { return createAirPollutionResource(this.sendLite as any) }
  get geocoding() { return createGeocodingResource(this.sendLite as any) }
}

export function createConnector() { return new Connector() }
