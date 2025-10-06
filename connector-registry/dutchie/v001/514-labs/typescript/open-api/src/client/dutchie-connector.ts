// Why this adapter exists:
// - Extends from core ApiConnectorBase
// - Central place to wire validation/logging hooks and rate-limit/retry config
// - Uses core HttpClient (retries, budgets, limiter) instead of bespoke transport
// - Circuit breaker intentionally omitted; rely on retries + budgets + server hints
// - Keeps resources simple (bind paths + types) and strongly typed
import { ApiConnectorBase } from '@connector-factory/core'
import type { ConnectorConfig as CoreConfig } from '@connector-factory/core'
import { createBrandResource } from '../resources/brand'
import { createProductsResource } from '../resources/products'
import { createInventoryResource } from '../resources/inventory'
import { createDiscountsResource } from '../resources/discounts'
import { createLoggingHooks } from '../observability/logging-hooks'
import { createTypiaValidationHooks } from '../validation/typia-hooks'

export type DutchieConfig = CoreConfig & {
  validation?: { enabled?: boolean; strict?: boolean }
  logging?: {
    enabled?: boolean;
    level?: 'debug' | 'info' | 'warn' | 'error';
    includeQueryParams?: boolean;
    includeHeaders?: boolean;
    includeBody?: boolean;
    logger?: (level: string, event: Record<string, unknown>) => void
  }
}

export class DutchieApiConnector extends ApiConnectorBase {
  initialize(userConfig: DutchieConfig) {
    // Derive defaults: baseUrl + auth basic via core
    const withDefaults = (u: DutchieConfig): DutchieConfig => ({
      baseUrl: u.baseUrl ?? 'https://api.pos.dutchie.com',
      timeoutMs: u.timeoutMs ?? 30000,
      userAgent: u.userAgent ?? 'connector-dutchie',
      ...u,
    })

    super.initialize(withDefaults(userConfig) as any, (cfg: any) => cfg)

    // Optional Typia-based validation
    if (userConfig.validation?.enabled) {
      const hooks = createTypiaValidationHooks({ strict: userConfig.validation?.strict })
      const cfg = (this as any).config
      const curr = this.config?.hooks ?? {}
      cfg.hooks = {
        beforeRequest: [...(curr.beforeRequest ?? [])],
        afterResponse: [...(curr.afterResponse ?? []), ...(hooks.afterResponse ?? [])],
        onError: [...(curr.onError ?? [])],
        onRetry: [...(curr.onRetry ?? [])],
      }
    }

    // Wire logging
    if (userConfig.logging?.enabled) {
      const hooks = createLoggingHooks({
        level: userConfig.logging.level,
        includeQueryParams: userConfig.logging.includeQueryParams,
        includeHeaders: userConfig.logging.includeHeaders,
        includeBody: userConfig.logging.includeBody,
        logger: userConfig.logging.logger as any,
      })
      const cfg = (this as any).config
      const curr = cfg?.hooks ?? {}
      cfg.hooks = {
        beforeRequest: [...(curr.beforeRequest ?? []), ...(hooks.beforeRequest ?? [])],
        afterResponse: [...(curr.afterResponse ?? []), ...(hooks.afterResponse ?? [])],
        onError: [...(curr.onError ?? []), ...(hooks.onError ?? [])],
        onRetry: [...(curr.onRetry ?? []), ...(hooks.onRetry ?? [])],
      }
    }
  }

  // Resources
  private get sendLite() { return async (args: any) => (this as any).request(args) }
  get brand() { return createBrandResource(this.sendLite as any) }
  get products() { return createProductsResource(this.sendLite as any) }
  get inventory() { return createInventoryResource(this.sendLite as any) }
  get discounts() { return createDiscountsResource(this.sendLite as any) }
}

export function createDutchieConnector(): DutchieApiConnector { return new DutchieApiConnector() }
