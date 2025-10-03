import type { Hooks, RequestOptions, ResponseEnvelope } from './hooks'
import type { RateLimiter } from './rate-limit'

export type DoRequest = <T = any>(req: RequestOptions) => Promise<ResponseEnvelope<T>>

export type RetryConfig = {
  maxAttempts?: number
  initialDelayMs?: number
  maxDelayMs?: number
  backoffMultiplier?: number
  retryableStatusCodes?: number[]
  respectRetryAfter?: boolean
}

export type SendRuntimeOptions = {
  retryBudgetMs?: number
  adaptiveRateLimit?: boolean
}

export type CreateSendOptions = {
  doRequest: DoRequest
  hooks?: Hooks
  retry?: RetryConfig
  rateLimiter?: RateLimiter
  options?: SendRuntimeOptions
}


