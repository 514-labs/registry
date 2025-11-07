/* eslint-env jest */
import nock from 'nock'
import { createConnector } from '../src'

it('logging includes url, headers, body when enabled', async () => {
  const BASE = 'https://api.openweathermap.org'
  const API_KEY = 'test-api-key'
  
  nock(BASE)
    .get('/data/2.5/weather')
    .query({ q: 'London', appid: API_KEY })
    .reply(200, { 
      name: 'London', 
      main: { temp: 15.5 },
      weather: [{ description: 'clear sky' }]
    }, { 
      'x-test-header': 'ok' 
    })

  const events: Array<{ level: string; event: Record<string, unknown> }> = []
  const conn = createConnector()
  conn.init({ 
    apiKey: API_KEY,
    logging: { 
      enabled: true, 
      level: 'info', 
      includeQueryParams: true, 
      includeHeaders: true, 
      includeBody: true, 
      logger: (level, event) => events.push({ level, event }) 
    } 
  })

  await conn.currentWeather.get({ q: 'London' })
  
  const reqEvt = events.find(e => (e.event as any)?.event === 'http_request')?.event as any
  const respEvt = events.find(e => (e.event as any)?.event === 'http_response')?.event as any
  
  expect(reqEvt).toBeDefined()
  expect(respEvt).toBeDefined()
  expect(String(respEvt.url)).toContain('/data/2.5/weather')
  expect(typeof reqEvt.headers).toBe('object')
  expect((respEvt.headers ?? {})['x-test-header']).toBe('ok')
  expect(respEvt.body.name).toBe('London')
})
