/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

const BASE = 'https://api.openweathermap.org'

it('logging includes url, headers, body when enabled', async () => {
  nock(BASE)
    .get('/data/2.5/weather')
    .query(true) // Accept any query params
    .reply(200, { 
      name: 'London',
      main: { temp: 15 },
      weather: [{ main: 'Clear' }]
    }, { 'x-test-header': 'ok' })

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

  await conn.weather.get({ q: 'London,UK' })

  const reqEvt = events.find(e => (e.event as any)?.event === 'http_request')?.event as any
  const respEvt = events.find(e => (e.event as any)?.event === 'http_response')?.event as any

  expect(reqEvt).toBeDefined()
  expect(respEvt).toBeDefined()
  expect(String(respEvt.url)).toContain('/data/2.5/weather')
  expect(typeof reqEvt.headers).toBe('object')
  expect((respEvt.headers ?? {})['x-test-header']).toBe('ok')
  expect(respEvt.body).toBeDefined()
  expect(respEvt.body.name).toBe('London')
})

