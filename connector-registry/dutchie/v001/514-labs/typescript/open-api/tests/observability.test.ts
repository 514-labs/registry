// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global describe, it, expect */
import { createLoggingHooks } from '../src/observability/logging-hooks'
import { createMetricsHooks, InMemoryMetricsSink } from '../src/observability/metrics-hooks'

describe('observability hooks', () => {
  it('logging: creates hooks and logs filtered by level; includes optional fields', () => {
    const events: Array<{ level: string; event: Record<string, unknown> }> = []
    const hooks = createLoggingHooks({ level: 'warn', logger: (level, event) => events.push({ level, event }), includeQueryParams: true, includeHeaders: true, includeBody: true })

    // Level filter (info suppressed)
    hooks.beforeRequest?.[0]({ type: 'beforeRequest', request: { method: 'GET', path: '/brand' } })
    expect(events.length).toBe(0)

    // Optional fields included
    const hooks2 = createLoggingHooks({ logger: (level, event) => events.push({ level, event }), includeQueryParams: true, includeHeaders: true, includeBody: true })
    hooks2.beforeRequest?.[0]({ type: 'beforeRequest', request: { method: 'POST', path: '/brand?x=1', headers: { a: 'b' }, body: { c: 2 } } })
    expect(events.at(-1)?.event.query).toEqual({ x: '1' })
    expect(events.at(-1)?.event.headers).toEqual({ a: 'b' })
    expect(events.at(-1)?.event.body).toEqual({ c: 2 })

    // Response meta and item count
    const hooksInfo = createLoggingHooks({ logger: (level, event) => events.push({ level, event }) })
    hooksInfo.afterResponse?.[0]({ type: 'afterResponse', request: { method: 'GET', path: '/brand' }, response: { status: 200, data: { results: [{}, {}] }, meta: { durationMs: 100, retryCount: 0, requestId: 'req-1', timestamp: Date.now() } } })
    expect(events.at(-1)?.event.event).toBe('http_response')
    expect(events.at(-1)?.event.itemCount).toBe(2)
    expect(events.at(-1)?.event.requestId).toBe('req-1')
  })

  it('metrics: records request/response/error/retry events', () => {
    const sink = new InMemoryMetricsSink()
    const hooks = createMetricsHooks(sink)

    hooks.beforeRequest?.[0]({ type: 'beforeRequest', request: { method: 'GET', path: '/brand' } })
    hooks.afterResponse?.[0]({ type: 'afterResponse', request: { method: 'GET', path: '/brand' }, response: { data: [], status: 200, headers: {} } })
    hooks.onError?.[0]({ type: 'onError', error: { code: 'SERVER_ERROR' } })
    hooks.onRetry?.[0]({ type: 'onRetry', attempt: 2 })

    expect(sink.events.map(e => e.type)).toEqual(['request', 'response', 'error', 'retry'])
  })
})
