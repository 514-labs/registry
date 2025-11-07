/**
 * OpenWeather API Connector
 * 
 * Provides access to OpenWeather's weather data APIs including:
 * - Current weather data
 * - Weather forecasts (5 day / 3 hour)
 * - Air pollution data
 * - Geocoding
 * 
 * Authentication: API key (appid parameter)
 * Documentation: https://openweathermap.org/api
 */

import { ApiConnectorBase } from '@connector-factory/core'
import type { ConnectorConfig as CoreConfig, Hook } from '@connector-factory/core'
import { createLoggingHooks } from '../observability/logging-hooks'
import { createMetricsHooks, InMemoryMetricsSink } from '../observability/metrics-hooks'
import { createResource as createCurrentWeatherResource } from '../resources/current-weather'
import { createResource as createForecastResource } from '../resources/forecast'
import { createResource as createAirPollutionResource } from '../resources/air-pollution'
import { createResource as createGeocodingResource } from '../resources/geocoding'

/**
 * Configuration for OpenWeather API connector
 */
export type OpenWeatherConnectorConfig = {
  /** Your OpenWeather API key (get from https://openweathermap.org/appid) */
  apiKey: string
  /** Units of measurement: 'standard' (Kelvin), 'metric' (Celsius), 'imperial' (Fahrenheit) */
  units?: 'standard' | 'metric' | 'imperial'
  /** Language for weather descriptions */
  lang?: string
  /** Optional base URL override (defaults to api.openweathermap.org) */
  baseUrl?: string
  /** Optional logging configuration */
  logging?: { 
    enabled?: boolean
    level?: 'debug'|'info'|'warn'|'error'
    includeQueryParams?: boolean
    includeHeaders?: boolean
    includeBody?: boolean
    logger?: (level: string, event: Record<string, unknown>) => void 
  }
  /** Optional metrics configuration */
  metrics?: { enabled?: boolean }
}

export class Connector extends ApiConnectorBase {
  private apiKey!: string
  private units?: string
  private lang?: string

  init(userConfig: OpenWeatherConnectorConfig) {
    this.apiKey = userConfig.apiKey
    this.units = userConfig.units
    this.lang = userConfig.lang

    const coreConfig: CoreConfig = {
      baseUrl: userConfig.baseUrl ?? 'https://api.openweathermap.org',
      userAgent: 'openweather-connector',
      auth: { type: 'bearer', bearer: { token: '' } }, // Dummy, we use query params
    }

    super.initialize(coreConfig, (cfg) => cfg)

    const cfg = (this as any).config as CoreConfig & { logging?: any; metrics?: any }
    const existing = cfg.hooks ?? {} as Partial<Record<'beforeRequest'|'afterResponse'|'onError'|'onRetry', Hook[]>>

    // Add API key to all requests via hook
    const apiKeyHook: Hook = {
      name: 'openweather-api-key',
      execute: (context: any) => {
        if (context.type === 'beforeRequest') {
          const url = new URL(context.request.url)
          url.searchParams.set('appid', this.apiKey)
          if (this.units) url.searchParams.set('units', this.units)
          if (this.lang) url.searchParams.set('lang', this.lang)
          context.modifyRequest({ url: url.toString() })
        }
      }
    }

    cfg.hooks = {
      beforeRequest: [apiKeyHook, ...(existing.beforeRequest ?? [])],
      afterResponse: [...(existing.afterResponse ?? [])],
      onError: [...(existing.onError ?? [])],
      onRetry: [...(existing.onRetry ?? [])],
    }

    if (userConfig.logging?.enabled) {
      const logging = createLoggingHooks({ 
        level: userConfig.logging.level, 
        includeQueryParams: userConfig.logging.includeQueryParams, 
        includeHeaders: userConfig.logging.includeHeaders, 
        includeBody: userConfig.logging.includeBody, 
        logger: userConfig.logging.logger as any 
      })
      cfg.hooks = {
        beforeRequest: [...(cfg.hooks.beforeRequest ?? []), ...(logging.beforeRequest ?? [])],
        afterResponse: [...(cfg.hooks.afterResponse ?? []), ...(logging.afterResponse ?? [])],
        onError: [...(cfg.hooks.onError ?? []), ...(logging.onError ?? [])],
        onRetry: [...(cfg.hooks.onRetry ?? []), ...(logging.onRetry ?? [])],
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

  /** Access current weather data */
  get currentWeather() { return createCurrentWeatherResource(this.sendLite as any) }
  
  /** Access weather forecast data (5 day / 3 hour) */
  get forecast() { return createForecastResource(this.sendLite as any) }
  
  /** Access air pollution data */
  get airPollution() { return createAirPollutionResource(this.sendLite as any) }
  
  /** Access geocoding for location lookup */
  get geocoding() { return createGeocodingResource(this.sendLite as any) }
}

export function createConnector() { return new Connector() }
