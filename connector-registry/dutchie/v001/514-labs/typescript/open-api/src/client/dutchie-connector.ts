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
import { createOpenApiValidationHook } from '../validation/openapi'
import { createLoggingHooks } from '../observability/logging-hooks'
import openapi from '../../schemas/dutchie-openapi.json'

export type DutchieConfig = CoreConfig & {
  validation?: { enabled?: boolean; strict?: boolean }
  logging?: { enabled?: boolean; level?: 'debug' | 'info' | 'warn' | 'error' }
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

    // Wire validation
    if (userConfig.validation?.enabled) {
      const vHook = createOpenApiValidationHook(openapi)
      const after = async (ctx: any) => {
        try { await vHook(ctx) } catch (e: any) { if (userConfig.validation?.strict) throw e }
      }
      ;(this as any).config = { ...((this as any).config ?? {}), hooks: { ...(((this as any).config?.hooks) ?? {}), afterResponse: [ ...((((this as any).config?.hooks)?.afterResponse) ?? []), after ] } }
    }

    // Wire logging
    if (userConfig.logging?.enabled) {
      const hooks = createLoggingHooks({ level: userConfig.logging.level })
      const curr = (this as any).config?.hooks ?? {}
      ;(this as any).config = {
        ...((this as any).config ?? {}),
        hooks: {
          beforeRequest: [...(curr.beforeRequest ?? []), ...(hooks.beforeRequest ?? [])],
          afterResponse: [...(curr.afterResponse ?? []), ...(hooks.afterResponse ?? [])],
          onError: [...(curr.onError ?? []), ...(hooks.onError ?? [])],
          onRetry: [...(curr.onRetry ?? []), ...(hooks.onRetry ?? [])],
        }
      }
    }
  }

  // Resources
  private get sendLite() { return async (args: any) => (this as any).request(args) }
  get brand() { return createBrandResource(this.sendLite as any) }
  get products() { return createProductsResource(this.sendLite as any) }
  get inventory() { return createInventoryResource(this.sendLite as any) }
}

export function createDutchieConnector(): DutchieApiConnector { return new DutchieApiConnector() }
