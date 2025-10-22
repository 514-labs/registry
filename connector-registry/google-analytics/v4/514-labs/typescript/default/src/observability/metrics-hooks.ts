import type { Hook, HookContext } from '@connector-factory/core'

export type MetricsEvent =
  | { type: 'request'; operation?: string }
  | { type: 'response'; operation?: string; status?: number; durationMs?: number }
  | { type: 'error'; operation?: string; code?: string }
  | { type: 'retry'; operation?: string; attempt?: number }

export interface MetricsSink { record: (event: MetricsEvent) => void }
export class InMemoryMetricsSink implements MetricsSink {
  public events: MetricsEvent[] = []
  record(e: MetricsEvent) { this.events.push(e) }
}

export function createMetricsHooks(sink: MetricsSink) {
  const beforeRequest: Hook = {
    name: 'metrics:beforeRequest',
    execute: (ctx: HookContext) => {
      if (ctx.type !== 'beforeRequest') return
      sink.record({ type: 'request', operation: ctx.operation ?? ctx.request?.operation })
    },
  }

  const afterResponse: Hook = {
    name: 'metrics:afterResponse',
    execute: (ctx: HookContext) => {
      if (ctx.type !== 'afterResponse') return
      sink.record({
        type: 'response',
        operation: ctx.operation ?? ctx.request?.operation,
        status: ctx.response?.status,
        durationMs: ctx.response?.meta?.durationMs,
      })
    },
  }

  const onError: Hook = {
    name: 'metrics:onError',
    execute: (ctx: HookContext) => {
      if (ctx.type !== 'onError') return
      sink.record({ type: 'error', operation: ctx.operation, code: (ctx.error as any)?.code })
    },
  }

  const onRetry: Hook = {
    name: 'metrics:onRetry',
    execute: (ctx: HookContext) => {
      if (ctx.type !== 'onRetry') return
      sink.record({ type: 'retry', operation: ctx.metadata?.operation ?? ctx.operation, attempt: ctx.metadata?.attempt })
    },
  }

  return { beforeRequest: [beforeRequest], afterResponse: [afterResponse], onError: [onError], onRetry: [onRetry] }
}
