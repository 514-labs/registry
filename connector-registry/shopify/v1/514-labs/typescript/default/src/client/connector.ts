import { ApiConnectorBase } from '@connector-factory/core'
import type { ConnectorConfig as CoreConfig, Hook } from '@connector-factory/core'
import { createLoggingHooks } from '../observability/logging-hooks'
import { createMetricsHooks, InMemoryMetricsSink } from '../observability/metrics-hooks'
import { createResource as createProductsResource } from '../resources/products'
import { createResource as createOrdersResource } from '../resources/orders'
import { createResource as createCustomersResource } from '../resources/customers'

export type ShopifyConnectorConfig = {
  shopName: string
  accessToken: string
  apiVersion?: string
  logging?: {
    enabled?: boolean
    level?: 'debug' | 'info' | 'warn' | 'error'
    includeQueryParams?: boolean
    includeHeaders?: boolean
    includeBody?: boolean
    logger?: (level: string, event: Record<string, unknown>) => void
  }
  metrics?: {
    enabled?: boolean
  }
}

export class Connector extends ApiConnectorBase {
  init(userConfig: ShopifyConnectorConfig) {
    const apiVersion = userConfig.apiVersion || '2024-10'
    const baseUrl = `https://${userConfig.shopName}.myshopify.com/admin/api/${apiVersion}`

    const coreConfig: CoreConfig = {
      baseUrl,
      userAgent: 'shopify-connector',
      defaultHeaders: {
        'X-Shopify-Access-Token': userConfig.accessToken,
        'Content-Type': 'application/json',
      },
      auth: { type: 'bearer', bearer: { token: '' } }, // Dummy auth since we use headers
    }

    super.initialize(coreConfig, (cfg) => cfg)
    
    return this

    const cfg = (this as any).config as CoreConfig & ShopifyConnectorConfig
    const existing = cfg.hooks ?? {} as Partial<Record<'beforeRequest' | 'afterResponse' | 'onError' | 'onRetry', Hook[]>>

    if (userConfig.logging?.enabled) {
      const logging = createLoggingHooks({
        level: userConfig.logging?.level,
        includeQueryParams: userConfig.logging?.includeQueryParams,
        includeHeaders: userConfig.logging?.includeHeaders,
        includeBody: userConfig.logging?.includeBody,
        logger: userConfig.logging?.logger as any,
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
  }

  private get sendLite() {
    return async (args: any) => {
      const response = await (this as any).request(args)
      // Attach headers to response for pagination
      return {
        ...response,
        headers: (response as any).headers || {},
      }
    }
  }

  get products() {
    return createProductsResource(this.sendLite as any)
  }

  get orders() {
    return createOrdersResource(this.sendLite as any)
  }

  get customers() {
    return createCustomersResource(this.sendLite as any)
  }
}

export function createConnector() {
  return new Connector()
}
