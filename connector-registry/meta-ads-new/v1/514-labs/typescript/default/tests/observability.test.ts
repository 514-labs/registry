/* eslint-env jest */
import nock from 'nock'
import { createConnector } from '../src'

interface LogEvent {
  level: string
  event: Record<string, unknown>
}

it('logging includes url, headers, body when enabled', async () => {
  const BASE = 'https://api.example.com'
  nock(BASE).get('/campaigns').query({ x: '1' }).reply(200, [{ id: 1 }], { 'x-test-header': 'ok' })
  
  const events: LogEvent[] = []
  const conn = createConnector()
  conn.initialize({
    baseUrl: BASE,
    auth: { type: 'bearer', bearer: { token: 't' } },
    logging: {
      enabled: true,
      level: 'info',
      includeQueryParams: true,
      includeHeaders: true,
      includeBody: true,
      logger: (level, event) => events.push({ level, event }),
    },
  })

  // Access internal request method for testing
  const request = (conn as unknown as { request: (args: unknown) => Promise<unknown> }).request
  await request({ method: 'GET', path: '/campaigns?x=1' })

  const reqEvt = events.find(e => e.event?.event === 'http_request')?.event
  const respEvt = events.find(e => e.event?.event === 'http_response')?.event

  expect(reqEvt).toBeDefined()
  expect(respEvt).toBeDefined()
  expect(String(respEvt?.url)).toContain('/campaigns?x=1')
  expect(typeof reqEvt?.headers).toBe('object')
  expect((respEvt?.headers as Record<string, string>)?.['x-test-header']).toBe('ok')
  expect(respEvt?.body).toEqual([{ id: 1 }])
})
