// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global describe, it, expect */
import { createLoggingHooks } from '../src/observability/logging-hooks'

describe('observability logging hooks', () => {
  it('creates hooks and logs filtered by level', () => {
    const events: Array<{ level: string; event: Record<string, unknown> }> = []
    const hooks = createLoggingHooks({ level: 'warn', logger: (level, event) => events.push({ level, event }) })

    expect(hooks.beforeRequest).toHaveLength(1)
    expect(hooks.afterResponse).toHaveLength(1)
    expect(hooks.onError).toHaveLength(1)
    expect(hooks.onRetry).toHaveLength(1)

    hooks.beforeRequest?.[0]({ type: 'beforeRequest', request: { method: 'GET', path: '/brand' } })
    expect(events.length).toBe(0) // info filtered out

    hooks.onError?.[0]({ type: 'onError', error: { message: 'x', code: 'SERVER_ERROR' } })
    expect(events.length).toBe(1)
    expect(events[0].level).toBe('error')
    expect(events[0].event.event).toBe('http_error')
  })

  it('includes optional fields when enabled', () => {
    const events: Array<{ level: string; event: Record<string, unknown> }> = []
    const hooks = createLoggingHooks({ logger: (level, event) => events.push({ level, event }), includeQueryParams: true, includeHeaders: true, includeBody: true })

    hooks.beforeRequest?.[0]({ type: 'beforeRequest', request: { method: 'POST', path: '/brand?x=1', headers: { a: 'b' }, body: { c: 2 } } })
    expect(events[0].event.query).toEqual({ x: '1' })
    expect(events[0].event.headers).toEqual({ a: 'b' })
    expect(events[0].event.body).toEqual({ c: 2 })
  })

  it('logs response meta and item count', () => {
    const events: Array<{ level: string; event: Record<string, unknown> }> = []
    const hooks = createLoggingHooks({ logger: (level, event) => events.push({ level, event }) })

    hooks.afterResponse?.[0]({ type: 'afterResponse', request: { method: 'GET', path: '/brand' }, response: { status: 200, data: { results: [{}, {}] }, meta: { durationMs: 100, retryCount: 0, requestId: 'req-1', timestamp: Date.now() } } })
    expect(events[0].event.event).toBe('http_response')
    expect(events[0].event.itemCount).toBe(2)
    expect(events[0].event.requestId).toBe('req-1')
  })
})


