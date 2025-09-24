import type { Hook, HookContext } from '@connector-factory/core'

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
    const isPathOnly = raw.startsWith('/')
    const u = new URL(isPathOnly ? `https://dummy${raw}` : raw)
    if (!includeQuery) {
      return { url: isPathOnly ? u.pathname : u.toString() }
    }
    const query: Record<string, unknown> = {}
    u.searchParams.forEach((v, k) => { query[k] = v })
    return { url: isPathOnly ? `${u.pathname}${u.search}` : u.toString(), query }
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

type CoreHooks = Partial<{ beforeRequest: Hook[]; afterResponse: Hook[]; onError: Hook[]; onRetry: Hook[] }>

export function createLoggingHooks(opts: LoggingOptions = {}): CoreHooks {
  const logger = opts.logger ?? ((level: LogLevel, event: Record<string, unknown>) => {
    console.log(level, event)
  })

  const beforeRequest: Hook = {
    name: 'logging:beforeRequest',
    execute: (ctx: HookContext) => {
      if (ctx.type !== 'beforeRequest' || !shouldLog(opts, 'info')) return
      const method = ctx.request.method
      const rawUrl = ctx.request.url || ctx.request.path
      const { url, query } = safeUrl(rawUrl, !!opts.includeQueryParams)
      const event: Record<string, unknown> = {
        event: 'http_request',
        operation: ctx.operation ?? ctx.request.operation,
        method,
        url,
      }
      if (opts.includeQueryParams && query) event.query = query
      if (opts.includeHeaders && ctx.request.headers) event.headers = ctx.request.headers
      if (opts.includeBody && ctx.request.body !== undefined) event.body = ctx.request.body
      logger('info', event)
    }
  }

  const afterResponse: Hook = {
    name: 'logging:afterResponse',
    execute: (ctx: HookContext) => {
      if (ctx.type !== 'afterResponse' || !shouldLog(opts, 'info')) return
      const method = ctx.request.method
      const rawUrl = ctx.request.url || ctx.request.path
      const { url } = safeUrl(rawUrl, !!opts.includeQueryParams)
      const itemCount = countItems(ctx.response.data)
      const event: Record<string, unknown> = {
        event: 'http_response',
        operation: ctx.operation ?? ctx.request.operation,
        method,
        url,
        status: ctx.response.status,
        durationMs: ctx.response.meta?.durationMs,
        retryCount: ctx.response.meta?.retryCount,
      }
      if (itemCount !== undefined) event.itemCount = itemCount
      if (opts.includeHeaders && (ctx.response as any)?.headers) event.headers = (ctx.response as any).headers as Record<string, unknown>
      if (opts.includeBody) event.body = ctx.response.data
      logger('info', event)
    }
  }

  const onError: Hook = {
    name: 'logging:onError',
    execute: (ctx: HookContext) => {
      if (ctx.type !== 'onError' || !shouldLog(opts, 'error')) return
      logger('error', {
        event: 'http_error',
        operation: ctx.operation,
        message: (ctx.error as any)?.message,
        code: (ctx.error as any)?.code,
        statusCode: (ctx.error as any)?.statusCode,
      })
    }
  }

  const onRetry: Hook = {
    name: 'logging:onRetry',
    execute: (ctx: HookContext) => {
      if (ctx.type !== 'onRetry' || !shouldLog(opts, 'debug')) return
      logger('debug', {
        event: 'http_retry',
        operation: ctx.metadata.operation ?? ctx.operation,
        attempt: ctx.metadata.attempt,
      })
    }
  }

  return { beforeRequest: [beforeRequest], afterResponse: [afterResponse], onError: [onError], onRetry: [onRetry] }
}


