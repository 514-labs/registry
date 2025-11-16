/* eslint-env jest */
import nock from 'nock'
import { createConnector } from '../src'

it('logging includes url, headers, body when enabled', async () => {
  const BASE = 'https://api.openweathermap.org'
  const API_KEY = 'test-key'
  nock(BASE).get('/data/2.5/weather').query({ q: 'London', appid: API_KEY }).reply(200, { 
    coord: { lon: -0.13, lat: 51.51 },
    weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
    base: 'stations',
    main: { temp: 15, feels_like: 14, temp_min: 14, temp_max: 16, pressure: 1013, humidity: 72 },
    visibility: 10000,
    wind: { speed: 3.6, deg: 220 },
    clouds: { all: 0 },
    dt: 1234567890,
    sys: { type: 2, id: 2019646, country: 'GB', sunrise: 1234560000, sunset: 1234600000 },
    timezone: 0,
    id: 2643743,
    name: 'London',
    cod: 200
  }, { 'x-test-header': 'ok' })
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
  await conn.weather.get({ q: 'London' })
  const reqEvt = events.find(e => (e.event as any)?.event === 'http_request')?.event as any
  const respEvt = events.find(e => (e.event as any)?.event === 'http_response')?.event as any
  expect(String(respEvt.url)).toContain('/data/2.5/weather')
  expect(typeof reqEvt.headers).toBe('object')
  expect((respEvt.headers ?? {})['x-test-header']).toBe('ok')
  expect(respEvt.body.name).toBe('London')
})
