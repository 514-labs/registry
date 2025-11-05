/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

it('getAll yields chunks and respects maxItems', async () => {
  const BASE = 'https://api.example.com'
  const data = Array.from({ length: 5 }, (_, i) => ({ id: i + 1 }))
  nock(BASE).get('/current-weather').reply(200, data)
  const conn = createConnector()
  conn.initialize({ baseUrl: BASE, auth: { type: 'bearer', bearer: { token: 't' } } })
  const pages: Array<ReadonlyArray<unknown>> = []
  for await (const page of (conn as any).current-weather.getAll({ pageSize: 2, maxItems: 4 })) pages.push(page)
  expect(pages.map(p => p.length)).toEqual([2, 2])
})
