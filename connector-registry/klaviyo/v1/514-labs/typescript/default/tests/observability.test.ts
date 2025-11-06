/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

it('logging includes url, headers, body when enabled', async () => {
  const BASE = 'https://a.klaviyo.com'
  nock(BASE)
    .get('/api/profiles/')
    .query({ 'page[size]': '100' })
    .reply(200, { data: [{ type: 'profile', id: '1' }], links: { next: null } }, { 'x-test-header': 'ok' })
  
  const events: Array<{ level: string; event: Record<string, unknown> }> = []
  const conn = createConnector()
  conn.init({ 
    apiKey: 'test-key',
    logging: { 
      enabled: true, 
      level: 'info', 
      includeQueryParams: true, 
      includeHeaders: true, 
      includeBody: true, 
      logger: (level, event) => events.push({ level, event }) 
    } 
  })
  
  // Make a request through the profiles resource
  const pages = []
  for await (const page of conn.profiles.list()) {
    pages.push(page)
  }
  
  const reqEvt = events.find(e => (e.event as any)?.event === 'http_request')?.event as any
  const respEvt = events.find(e => (e.event as any)?.event === 'http_response')?.event as any
  expect(String(respEvt.url)).toContain('/api/profiles')
  expect(typeof reqEvt.headers).toBe('object')
  expect((respEvt.headers ?? {})['x-test-header']).toBe('ok')
  expect(respEvt.body).toBeDefined()
})


