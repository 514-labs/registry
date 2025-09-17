import type { Hook, HookContext } from '../lib/hooks'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type LoggingOptions = {
  level?: LogLevel
  logger?: (level: LogLevel, event: Record<string, unknown>) => void
  includeQueryParams?: boolean
  includeHeaders?: boolean
  includeBody?: boolean
}

const levelOrder: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 }

function shouldLog(config: LoggingOptions, level: LogLevel): boolean {
  const min = config.level ?? 'info'
  return levelOrder[level] >= levelOrder[min]
}

function safeUrl(raw?: string, includeQuery = false): { url?: string; query?: Record<string, unknown> } {
  if (!raw) return {}
  try {
    const u = new URL(raw)
    if (!includeQuery) {
      return { url: `${u.origin}${u.pathname}` }
    }
    const query: Record<string, unknown> = {}
    u.searchParams.forEach((v, k) => { query[k] = v })
    return { url: u.toString(), query }
  } catch {
    return { url: raw }
  }
}

function countItems(data: unknown): number | undefined {
  if (Array.isArray(data)) return data.length
  if (data && typeof data === 'object') {
    const obj = data as any
    if (Array.isArray(obj.results)) return obj.results.length
    if (Array.isArray(obj.items)) return obj.items.length
  }
  return undefined
}

export function createLoggingHooks(opts: LoggingOptions = {}) {
  const logger = opts.logger ?? ((level: LogLevel, event: Record<string, unknown>) => { /* no-op */ })

  const beforeRequest: Hook = (ctx: HookContext) => {
    if (ctx.type !== 'beforeRequest' || !shouldLog(opts, 'info')) return
    const method = ctx.request?.method
    const path = ctx.request?.path
    const { url, query } = safeUrl(path ? `https://dummy${path}` : undefined, !!opts.includeQueryParams)
    const event: Record<string, unknown> = {
      event: 'http_request',
      operation: ctx.operation ?? ctx.request?.operation,
      method,
      url: url?.replace('https://dummy', ''),
    }
    if (opts.includeQueryParams && query) event.query = query
    if (opts.includeHeaders && ctx.request?.headers) event.headers = ctx.request.headers
    if (opts.includeBody && ctx.request?.body !== undefined) event.body = ctx.request.body
    logger('info', event)
  }

  const afterResponse: Hook = (ctx: HookContext) => {
    if (ctx.type !== 'afterResponse' || !shouldLog(opts, 'info')) return
    const method = ctx.request?.method
    const path = ctx.request?.path
    const { url } = safeUrl(path ? `https://dummy${path}` : undefined, !!opts.includeQueryParams)
    const itemCount = countItems(ctx.response?.data)
    const event: Record<string, unknown> = {
      event: 'http_response',
      operation: ctx.operation ?? ctx.request?.operation,
      method,
      url: url?.replace('https://dummy', ''),
      status: ctx.response?.status,
      durationMs: ctx.response?.meta?.durationMs,
      retryCount: ctx.response?.meta?.retryCount,
      requestId: ctx.response?.meta?.requestId,
    }
    if (itemCount !== undefined) event.itemCount = itemCount
    logger('info', event)
  }

  const onError: Hook = (ctx: HookContext) => {
    if (ctx.type !== 'onError' || !shouldLog(opts, 'error')) return
    logger('error', {
      event: 'http_error',
      operation: ctx.operation ?? ctx.request?.operation,
      message: (ctx.error as any)?.message,
      code: (ctx.error as any)?.code,
      statusCode: (ctx.error as any)?.statusCode,
    })
  }

  const onRetry: Hook = (ctx: HookContext) => {
    if (ctx.type !== 'onRetry' || !shouldLog(opts, 'debug')) return
    logger('debug', {
      event: 'http_retry',
      operation: ctx.metadata?.operation ?? ctx.operation ?? ctx.request?.operation,
      attempt: ctx.metadata?.attempt ?? ctx.attempt,
    })
  }

  return { beforeRequest: [beforeRequest], afterResponse: [afterResponse], onError: [onError], onRetry: [onRetry] }
}


