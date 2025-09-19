import type { Hook, HookContext } from '../lib/hooks'

export type MetricsEvent =
  | { type: 'request'; operation?: string }
  | { type: 'response'; operation?: string; status?: number; durationMs?: number }
  | { type: 'error'; operation?: string; code?: string }
  | { type: 'retry'; operation?: string; attempt?: number }

export interface MetricsSink {
  record: (event: MetricsEvent) => void
}

export class InMemoryMetricsSink implements MetricsSink {
  public events: MetricsEvent[] = []
  record(event: MetricsEvent) { this.events.push(event) }
}

export function createMetricsHooks(sink: MetricsSink) {
  const beforeRequest: Hook = (ctx: HookContext) => {
    if (ctx.type !== 'beforeRequest') return
    sink.record({ type: 'request', operation: ctx.operation ?? ctx.request?.operation })
  }

  const afterResponse: Hook = (ctx: HookContext) => {
    if (ctx.type !== 'afterResponse') return
    sink.record({
      type: 'response',
      operation: ctx.operation ?? ctx.request?.operation,
      status: ctx.response?.status,
      durationMs: ctx.response?.meta?.durationMs,
    })
  }

  const onError: Hook = (ctx: HookContext) => {
    if (ctx.type !== 'onError') return
    sink.record({ type: 'error', operation: ctx.operation ?? ctx.request?.operation, code: (ctx.error as any)?.code })
  }

  const onRetry: Hook = (ctx: HookContext) => {
    if (ctx.type !== 'onRetry') return
    sink.record({ type: 'retry', operation: ctx.operation ?? ctx.request?.operation, attempt: ctx.attempt })
  }

  return { beforeRequest: [beforeRequest], afterResponse: [afterResponse], onError: [onError], onRetry: [onRetry] }
}


