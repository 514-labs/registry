/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

describe('ADS-B.lol Observability', () => {
  const BASE = 'https://api.adsb.lol'

  afterEach(() => {
    nock.cleanAll()
  })

  it('logging includes url, headers, body when enabled', async () => {
    nock(BASE)
      .get('/api/data/aircraft')
      .query({ mil: '1' })
      .reply(200, { aircraft: [{ icao: 'ABC123' }] }, { 'x-test-header': 'ok' })

    const events: Array<{ level: string; event: Record<string, unknown> }> = []
    const conn = createConnector()
    conn.init({
      baseUrl: BASE,
      logging: {
        enabled: true,
        level: 'info',
        includeQueryParams: true,
        includeHeaders: true,
        includeBody: true,
        logger: (level, event) => events.push({ level, event }),
      },
    })

    await (conn as any).request({
      method: 'GET',
      path: '/api/data/aircraft?mil=1',
    })

    const reqEvt = events.find(e => (e.event as any)?.event === 'http_request')?.event as any
    const respEvt = events.find(e => (e.event as any)?.event === 'http_response')?.event as any

    expect(String(respEvt.url)).toContain('/api/data/aircraft')
    expect(typeof reqEvt.headers).toBe('object')
    expect((respEvt.headers ?? {})['x-test-header']).toBe('ok')
    expect(respEvt.body).toEqual({ aircraft: [{ icao: 'ABC123' }] })
  })

  it('metrics are collected when enabled', async () => {
    nock(BASE)
      .get('/api/data/aircraft')
      .reply(200, { aircraft: [] })

    const conn = createConnector()
    conn.init({
      baseUrl: BASE,
      metrics: { enabled: true },
    })

    await (conn as any).request({
      method: 'GET',
      path: '/api/data/aircraft',
      operation: 'list_aircraft',
    })

    const sink = (conn as any)._metricsSink
    expect(sink).toBeDefined()
    expect(sink.events.length).toBeGreaterThan(0)
    expect(sink.events.some((e: any) => e.type === 'request')).toBe(true)
    expect(sink.events.some((e: any) => e.type === 'response')).toBe(true)
  })
})
