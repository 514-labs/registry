import https from 'https'
import { ApiKeyAuth } from './auth/apiKey'
import type { ConnectorConfig } from './config'
import { createSend } from './lib/send'
import type { DoRequest } from './lib/types'
import type { Hooks, RequestOptions, ResponseEnvelope } from './lib/hooks'
import { TokenBucketRateLimiter } from './lib/rate-limit'
import { createOpenApiValidationHook } from './validation/openapi'
import { createBrandResource } from './resources/brand'
import { createProductsResource } from './resources/products'
import { createInventoryResource } from './resources/inventory'

export class Client {
  private baseUrl: string
  private hooks?: Hooks
  private doRequest: DoRequest
  private send
  private connected = false

  constructor(public config: ConnectorConfig & { baseUrl?: string; hooks?: Hooks }) {
    this.baseUrl = config.baseUrl ?? 'https://api.pos.dutchie.com'
    this.hooks = config.hooks
    const auth = new ApiKeyAuth(config.apiKey)
    this.doRequest = async <T = any>(req: RequestOptions): Promise<ResponseEnvelope<T>> => {
      const url = new URL(req.path, this.baseUrl)
      const headers: Record<string, string> = auth.apply({ 'content-type': 'application/json', 'user-agent': this.config.userAgent ?? 'connector-dutchie', ...(req.headers ?? {}) })
      const query = req.query ?? {}
      for (const [k, v] of Object.entries(query)) {
        if (v === undefined || v === null) continue
        url.searchParams.set(k, String(v))
      }
      const body = req.body ? JSON.stringify(req.body) : undefined
      const res = await new Promise<ResponseEnvelope<T>>((resolve, reject) => {
        const r = https.request(url, { method: req.method, headers, timeout: req.timeoutMs ?? this.config.timeoutMs ?? 30000 }, (resp) => {
          const chunks: Buffer[] = []
          resp.on('data', (c) => chunks.push(c))
          resp.on('end', () => {
            const raw = Buffer.concat(chunks).toString('utf8')
            let data: any = undefined
            try { data = raw ? JSON.parse(raw) : undefined } catch { data = raw as any }
            const headersMap = Object.fromEntries(Object.entries(resp.headers).map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : String(v ?? '')])) as Record<string, string>
            resolve({ data: data as T, status: resp.statusCode ?? 200, headers: headersMap })
          })
        })
        r.on('error', reject)
        if (body) r.write(body)
        r.end()
      })
      return res
    }
    // Wire validation hook if enabled
    if (this.config?.validation?.enabled && this.config.validation.openApi) {
      const vHook = createOpenApiValidationHook(this.config.validation.openApi)
      this.hooks = {
        ...(this.hooks ?? {}),
        afterResponse: [...(this.hooks?.afterResponse ?? []), async (ctx) => {
          try {
            await vHook(ctx)
          } catch (e: any) {
            if (this.config?.validation?.strict) throw e
            // eslint-disable-next-line no-console
            console.warn(e?.message || String(e))
          }
        }],
      }
    }

    const rlCfg = this.config.rateLimit ?? {}
    const rateLimiter = new TokenBucketRateLimiter({
      requestsPerSecond: rlCfg.requestsPerSecond ?? 0,
      burstCapacity: rlCfg.burstCapacity ?? 0,
      concurrentRequests: rlCfg.concurrentRequests ?? 10,
    })
    this.send = createSend({
      doRequest: this.doRequest,
      hooks: this.hooks,
      retry: {
        respectRetryAfter: true,
        maxAttempts: this.config.retry?.maxAttempts,
        initialDelayMs: this.config.retry?.initialDelayMs,
        maxDelayMs: this.config.retry?.maxDelayMs,
        backoffMultiplier: this.config.retry?.backoffMultiplier,
      },
      rateLimiter,
      options: {
        retryBudgetMs: this.config.retry?.budgetMs,
        adaptiveRateLimit: this.config.rateLimit?.adaptiveFromHeaders !== false,
        circuit: this.config.circuitBreaker,
      },
    })
  }

  // Lifecycle
  initialize(cfg: ConnectorConfig & { baseUrl?: string; hooks?: Hooks }) {
    this.config = cfg
  }
  async connect(): Promise<void> { this.connected = true }
  async disconnect(): Promise<void> { this.connected = false }
  isConnected(): boolean { return this.connected }

  get brand() { return createBrandResource(this.send) }
  get products() { return createProductsResource(this.send) }
  get inventory() { return createInventoryResource(this.send) }
  ping(): boolean { return true }
}
