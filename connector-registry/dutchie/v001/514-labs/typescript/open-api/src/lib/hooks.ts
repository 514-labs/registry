export type RequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  query?: Record<string, any>
  headers?: Record<string, string>
  body?: unknown
  timeoutMs?: number
  operation?: string
}

export type ResponseMeta = {
  timestamp: number
  durationMs: number
  retryCount: number
  requestId?: string
}

export type ResponseEnvelope<T> = {
  data: T
  status?: number
  headers?: Record<string, string>
  meta?: ResponseMeta
}

export type HookContext = {
  type: 'beforeRequest' | 'afterResponse' | 'onError' | 'onRetry'
  request?: RequestOptions
  response?: ResponseEnvelope<any>
  error?: unknown
  metadata?: Record<string, any>
  attempt?: number
}

export type Hook = (ctx: HookContext) => void | Promise<void>

export type Hooks = {
  beforeRequest?: Hook[]
  afterResponse?: Hook[]
  onError?: Hook[]
  onRetry?: Hook[]
}

export async function runHooks(hooks: Hook[] | undefined, ctx: HookContext): Promise<void> {
  for (const hook of hooks ?? []) {
    // eslint-disable-next-line no-await-in-loop
    await hook(ctx)
  }
}
