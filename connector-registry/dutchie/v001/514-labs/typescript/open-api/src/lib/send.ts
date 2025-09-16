import type { Hooks, RequestOptions, ResponseEnvelope } from './hooks'
import { runHooks } from './hooks'

export type DoRequest = <T = any>(req: RequestOptions) => Promise<ResponseEnvelope<T>>

export type RetryConfig = {
  maxAttempts?: number
  initialDelayMs?: number
  maxDelayMs?: number
  backoffMultiplier?: number
  retryableStatusCodes?: number[]
  respectRetryAfter?: boolean
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function calcDelay(attempt: number, cfg: Required<Pick<RetryConfig, 'initialDelayMs' | 'maxDelayMs' | 'backoffMultiplier'>>): number {
  const exp = cfg.initialDelayMs * Math.pow(cfg.backoffMultiplier, attempt - 1)
  const bounded = Math.min(exp, cfg.maxDelayMs)
  const jitter = bounded * (0.5 + Math.random() * 0.5)
  return Math.floor(jitter)
}

export function createSend({ doRequest, hooks, retry }: { doRequest: DoRequest; hooks?: Hooks; retry?: RetryConfig }) {
  const retryCfg: Required<RetryConfig> = {
    maxAttempts: retry?.maxAttempts ?? 3,
    initialDelayMs: retry?.initialDelayMs ?? 1000,
    maxDelayMs: retry?.maxDelayMs ?? 30000,
    backoffMultiplier: retry?.backoffMultiplier ?? 2,
    retryableStatusCodes: retry?.retryableStatusCodes ?? [408, 425, 429, 500, 502, 503, 504],
    respectRetryAfter: retry?.respectRetryAfter ?? true,
  } as Required<RetryConfig>

  async function send<T = any>(req: RequestOptions): Promise<ResponseEnvelope<T>> {
    const startedAt = Date.now()
    let lastError: unknown
    let retryAfterMs: number | undefined
    for (let attempt = 1; attempt <= retryCfg.maxAttempts; attempt++) {
      try {
        await runHooks(hooks?.beforeRequest, { type: 'beforeRequest', request: req, attempt })
        const res = await doRequest<T>(req)
        await runHooks(hooks?.afterResponse, { type: 'afterResponse', request: req, response: res, attempt })
        const status = res.status ?? 200
        if (!retryCfg.retryableStatusCodes.includes(status)) {
          res.meta = { ...(res.meta ?? {}), timestamp: Date.now(), durationMs: Date.now() - startedAt, retryCount: attempt - 1 }
          return res
        }
        lastError = new Error(`Retryable status: ${status}`)
        // Parse Retry-After if present
        if (retryCfg.respectRetryAfter) {
          const ra = res.headers?.['retry-after'] || res.headers?.['Retry-After']
          if (ra) {
            const seconds = Number(ra)
            if (!Number.isNaN(seconds)) {
              retryAfterMs = Math.max(0, Math.floor(seconds * 1000))
            } else {
              const date = Date.parse(ra)
              if (!Number.isNaN(date)) {
                retryAfterMs = Math.max(0, date - Date.now())
              }
            }
          }
        }
      } catch (err) {
        lastError = err
        await runHooks(hooks?.onError, { type: 'onError', request: req, error: err, attempt })
      }
      if (attempt < retryCfg.maxAttempts) {
        await runHooks(hooks?.onRetry, { type: 'onRetry', request: req, error: lastError, attempt })
        const delay = retryCfg.respectRetryAfter && typeof retryAfterMs === 'number'
          ? retryAfterMs
          : calcDelay(attempt, { initialDelayMs: retryCfg.initialDelayMs, maxDelayMs: retryCfg.maxDelayMs, backoffMultiplier: retryCfg.backoffMultiplier })
        await sleep(delay)
        continue
      }
      break
    }
    throw lastError ?? new Error('Request failed')
  }

  return send
}
