/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

it('logging includes url, headers, body when enabled', async () => {
  const BASE = 'https://api.example.com'
  nock(BASE).get('/reports').query({ x: '1' }).reply(200, [{ id: 1 }], { 'x-test-header': 'ok' })
  const events: Array<{ level: string; event: Record<string, unknown> }> = []
  const conn = createConnector()
  conn.initialize({ baseUrl: BASE, auth: { type: 'bearer', bearer: { token: 't' } }, logging: { enabled: true, level: 'info', includeQueryParams: true, includeHeaders: true, includeBody: true, logger: (level, event) => events.push({ level, event }) } })
  await (conn as any).request({ method: 'GET', path: '/reports?x=1' })
  const reqEvt = events.find(e => (e.event as any)?.event === 'http_request')?.event as any
  const respEvt = events.find(e => (e.event as any)?.event === 'http_response')?.event as any
  expect(String(respEvt.url)).toContain('/reports?x=1')
  expect(typeof reqEvt.headers).toBe('object')
  expect((respEvt.headers ?? {})['x-test-header']).toBe('ok')
  expect(respEvt.body).toEqual([{ id: 1 }])
})
