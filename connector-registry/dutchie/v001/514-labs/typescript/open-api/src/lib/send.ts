import type { Hooks, RequestOptions, ResponseEnvelope } from './hooks'
import { runHooks } from './hooks'
import type { CreateSendOptions, DoRequest, RetryConfig } from './types'
import { ConnectorError, mapError } from './errors'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function calcDelay(attempt: number, cfg: Required<Pick<RetryConfig, 'initialDelayMs' | 'maxDelayMs' | 'backoffMultiplier'>>): number {
  const exp = cfg.initialDelayMs * Math.pow(cfg.backoffMultiplier, attempt - 1)
  const bounded = Math.min(exp, cfg.maxDelayMs)
  const jitter = bounded * (0.5 + Math.random() * 0.5)
  return Math.floor(jitter)
}

export function createSend({ doRequest, hooks, retry, rateLimiter, options }: CreateSendOptions) {
  const retryCfg: Required<RetryConfig> = {
    maxAttempts: retry?.maxAttempts ?? 3,
    initialDelayMs: retry?.initialDelayMs ?? 1000,
    maxDelayMs: retry?.maxDelayMs ?? 30000,
    backoffMultiplier: retry?.backoffMultiplier ?? 2,
    retryableStatusCodes: retry?.retryableStatusCodes ?? [408, 425, 429, 500, 502, 503, 504],
    respectRetryAfter: retry?.respectRetryAfter ?? true,
  } as Required<RetryConfig>

  let consecutiveFailures = 0
  let openedAt: number | undefined
  async function send<T = any>(req: RequestOptions): Promise<ResponseEnvelope<T>> {
    const startedAt = Date.now()
    let lastError: unknown
    let retryAfterMs: number | undefined
    if (openedAt && options?.circuit) {
      const elapsed = Date.now() - openedAt
      if (elapsed < options.circuit.coolDownMs) {
        throw new Error('Circuit breaker open')
      } else {
        openedAt = undefined
        consecutiveFailures = 0
      }
    }
    let hadRetryableStatus = false
    for (let attempt = 1; attempt <= retryCfg.maxAttempts; attempt++) {
      if (options?.retryBudgetMs && Date.now() - startedAt > options.retryBudgetMs) {
        break
      }
      try {
        if (rateLimiter) await rateLimiter.waitForSlot()
        await runHooks(hooks?.beforeRequest, {
          type: 'beforeRequest',
          request: req,
          attempt,
          modifyRequest: (updates) => {
            Object.assign(req, updates)
          },
        })
        const res = await doRequest<T>(req)
        if (rateLimiter && options?.adaptiveRateLimit !== false) rateLimiter.updateFromResponse(res.headers)
        await runHooks(hooks?.afterResponse, {
          type: 'afterResponse',
          request: req,
          response: res,
          attempt,
          modifyResponse: (updates) => {
            Object.assign(res, updates)
          },
        })
        const status = res.status ?? 200
        if (!retryCfg.retryableStatusCodes.includes(status)) {
          const requestId = res.headers?.['x-request-id'] || res.headers?.['request-id']
          const rl = rateLimiter?.getStatus()
          res.meta = {
            ...(res.meta ?? {}),
            timestamp: Date.now(),
            durationMs: Date.now() - startedAt,
            retryCount: attempt - 1,
            requestId: requestId,
            rateLimit: rl ? { ...rl } : undefined,
          }
          consecutiveFailures = 0
          return res
        }
        lastError = new ConnectorError({ message: `Retryable status: ${status}`, code: status === 429 ? 'RATE_LIMIT' : status >= 500 ? 'SERVER_ERROR' : 'INVALID_REQUEST', statusCode: status, retryable: true })
        hadRetryableStatus = true
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
        const status = (err as any)?.statusCode as number | undefined
        const reqId = (err as any)?.requestId || (typeof (err as any)?.headers?.['x-request-id'] === 'string' ? (err as any).headers['x-request-id'] : undefined)
        lastError = mapError(err, status, reqId)
        await runHooks(hooks?.onError, { type: 'onError', request: req, error: err, attempt })
        consecutiveFailures += 1
        if (options?.circuit && consecutiveFailures >= options.circuit.failureThreshold) {
          openedAt = Date.now()
        }
      } finally {
        if (rateLimiter) rateLimiter.release()
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
    if (hadRetryableStatus) {
      consecutiveFailures += 1
      if (options?.circuit && consecutiveFailures >= options.circuit.failureThreshold) {
        openedAt = Date.now()
      }
    }
    throw lastError ?? new Error('Request failed')
  }

  return send
}
