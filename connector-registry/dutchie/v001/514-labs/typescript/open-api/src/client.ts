import https from 'https'
import { ApiKeyAuth } from './auth/apiKey'
import type { ConnectorConfig } from './config'
import { createSend, type DoRequest } from './lib/send'
import type { Hooks, RequestOptions, ResponseEnvelope } from './lib/hooks'
import { createBrandResource } from './resources/brand'
import { createProductsResource } from './resources/products'
import { createInventoryResource } from './resources/inventory'

export class Client {
  private baseUrl: string
  private hooks?: Hooks
  private doRequest: DoRequest
  private send

  constructor(public config: ConnectorConfig & { baseUrl?: string; hooks?: Hooks }) {
    this.baseUrl = config.baseUrl ?? 'https://api.pos.dutchie.com'
    this.hooks = config.hooks
    const auth = new ApiKeyAuth(config.apiKey)
    this.doRequest = async <T = any>(req: RequestOptions): Promise<ResponseEnvelope<T>> => {
      const url = new URL(req.path, this.baseUrl)
      const headers: Record<string, string> = auth.apply({ 'content-type': 'application/json' })
      const query = req.query ?? {}
      for (const [k, v] of Object.entries(query)) {
        if (v === undefined || v === null) continue
        url.searchParams.set(k, String(v))
      }
      const body = req.body ? JSON.stringify(req.body) : undefined
      const res = await new Promise<ResponseEnvelope<T>>((resolve, reject) => {
        const r = https.request(url, { method: req.method, headers, timeout: req.timeoutMs ?? 30000 }, (resp) => {
          const chunks: Buffer[] = []
          resp.on('data', (c) => chunks.push(c))
          resp.on('end', () => {
            const raw = Buffer.concat(chunks).toString('utf8')
            let data: any = undefined
            try { data = raw ? JSON.parse(raw) : undefined } catch { data = raw as any }
            resolve({ data: data as T, status: resp.statusCode ?? 200, headers: Object.fromEntries(Object.entries(resp.headers).map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : String(v ?? '')])) })
          })
        })
        r.on('error', reject)
        if (body) r.write(body)
        r.end()
      })
      return res
    }
    this.send = createSend({ doRequest: this.doRequest, hooks: this.hooks, retry: { respectRetryAfter: true } })
  }

  get brand() { return createBrandResource(this.send) }
  get products() { return createProductsResource(this.send) }
  get inventory() { return createInventoryResource(this.send) }
  ping(): boolean { return true }
}
