// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global describe, it, expect, beforeAll */
import { createLoggingHooks } from '../../src/observability/logging-hooks'
import { createMetricsHooks, InMemoryMetricsSink } from '../../src/observability/metrics-hooks'
import nock from 'nock'
import { createDutchieConnector } from '../../src'

describe('observability hooks', () => {
  it('logging: default emits request/response without optional fields', async () => {
    const BASE = 'https://api.pos.dutchie.com'
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    nock(BASE).get('/brand').matchHeader('authorization', `Basic ${basic}`).reply(200, [{}, {}])

    const events: Array<{ level: string; event: Record<string, unknown> }> = []
    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } }, logging: { enabled: true, level: 'info', logger: (level, event) => events.push({ level, event }) } })

    for await (const _ of conn.brand.getAll({ paging: { pageSize: 10, maxItems: 2 } })) { void _; break }
    const names = events.map(e => e.event?.event)
    expect(names).toEqual(expect.arrayContaining(['http_request', 'http_response']))
    const reqEvt = events.find(e => e.event?.event === 'http_request')?.event as any
    expect('query' in reqEvt).toBe(false)
    expect('headers' in reqEvt).toBe(false)
    expect('body' in reqEvt).toBe(false)
    const respEvt = events.find(e => e.event?.event === 'http_response')?.event as any
    expect(respEvt.itemCount).toBe(2)
  })

  it('logging: includes optional fields when enabled', async () => {
    const BASE = 'https://api.pos.dutchie.com'
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')

    // Mock brand GET with query and a response header + body
    nock(BASE)
      .get('/brand')
      .query({ x: '1' })
      .matchHeader('authorization', `Basic ${basic}`)
      .reply(200, [{ brandId: 1 }], { 'x-test-header': 'ok' })

    const events: Array<{ level: string; event: Record<string, unknown> }> = []
    const conn = createDutchieConnector()
    conn.initialize({
      baseUrl: BASE,
      auth: { type: 'basic', basic: { username: apiKey } },
      logging: {
        enabled: true,
        level: 'info',
        includeQueryParams: true,
        includeHeaders: true,
        includeBody: true,
        logger: (level, event) => events.push({ level, event }),
      },
    })

    // Single endpoint (brand) with query
    await (conn as any).request({ method: 'GET', path: '/brand?x=1' })

    const reqEvt = events.find(e => e.event?.event === 'http_request')?.event as any
    const reqHeaders = (reqEvt.headers ?? {}) as Record<string, unknown>
    const authHeader = (reqHeaders['authorization'] ?? reqHeaders['Authorization']) as string | undefined
    expect(typeof reqHeaders).toBe('object')
    expect(Boolean(authHeader && authHeader.startsWith('Basic '))).toBe(true)

    const respEvt = events.find(e => e.event?.event === 'http_response')?.event as any
    // URL includes query when includeQueryParams=true
    expect(String(respEvt.url)).toContain('/brand?x=1')
    // Response headers contain our mocked header
    expect((respEvt.headers ?? {})['x-test-header']).toBe('ok')
    // Response body is included when includeBody=true
    expect(respEvt.body).toEqual([{ brandId: 1 }])
  })

  it('metrics: records request/response/error/retry events', () => {
    const sink = new InMemoryMetricsSink()
    const hooks = createMetricsHooks(sink)

    hooks.beforeRequest?.[0].execute({
      type: 'beforeRequest',
      request: { method: 'GET', url: 'https://api.pos.dutchie.com/brand', headers: {} },
      modifyRequest: () => {},
      abort: () => {},
    } as any)

    hooks.afterResponse?.[0].execute({
      type: 'afterResponse',
      request: { method: 'GET', url: 'https://api.pos.dutchie.com/brand', headers: {} },
      response: { data: [], status: 200, headers: {} },
      modifyResponse: () => {},
    } as any)

    hooks.onError?.[0].execute({ type: 'onError', error: { code: 'SERVER_ERROR' } } as any)
    hooks.onRetry?.[0].execute({ type: 'onRetry', metadata: { attempt: 2, operation: 'GET' } } as any)

    expect(sink.events.map(e => e.type)).toEqual(['request', 'response', 'error', 'retry'])
  })
})
