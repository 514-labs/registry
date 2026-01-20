/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

it('logging includes url, headers, body when enabled', async () => {
  const BASE = 'https://app.apextrading.com'
  nock(BASE).get('/api/v2/batches').query({ page: 1, per_page: 15 }).reply(200, { batches: [{ id: 1 }] }, { 'x-test-header': 'ok' })
  
  const events: Array<{ level: string; event: Record<string, unknown> }> = []
  const conn = createConnector()
  conn.init({ 
    accessToken: 'test-token',
    logging: { 
      enabled: true, 
      level: 'info', 
      includeQueryParams: true, 
      includeHeaders: true, 
      includeBody: true, 
      logger: (level, event) => events.push({ level, event }) 
    } 
  })
  
  await (conn as any).request({ method: 'GET', path: '/v2/batches?page=1&per_page=15' })
  
  const reqEvt = events.find(e => (e.event as any)?.event === 'http_request')?.event as any
  const respEvt = events.find(e => (e.event as any)?.event === 'http_response')?.event as any
  
  expect(String(respEvt.url)).toContain('/v2/batches')
  expect(typeof reqEvt.headers).toBe('object')
  expect((respEvt.headers ?? {})['x-test-header']).toBe('ok')
  expect(respEvt.body).toEqual({ batches: [{ id: 1 }] })
})

