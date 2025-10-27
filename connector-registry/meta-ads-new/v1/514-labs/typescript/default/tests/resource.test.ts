/* eslint-env jest */
import nock from 'nock'
import { createConnector } from '../src'
import type { Connector } from '../src/client/connector'

it('getAll yields chunks and respects maxItems', async () => {
  const BASE = 'https://api.example.com'
  const data = Array.from({ length: 5 }, (_, i) => ({ id: i + 1 }))
  
  nock(BASE).get('/campaigns').reply(200, data)
  
  const conn = createConnector()
  conn.initialize({
    baseUrl: BASE,
    auth: { type: 'bearer', bearer: { token: 't' } },
  })

  const pages: Array<ReadonlyArray<unknown>> = []
  for await (const page of conn.campaigns.getAll({
    paging: { pageSize: 2, maxItems: 4 },
  })) {
    pages.push(page)
  }

  expect(pages).toHaveLength(2)
  expect(pages.map(p => p.length)).toEqual([2, 2])
  expect(pages.flat().map(item => (item as { id: number }).id)).toEqual([1, 2, 3, 4])
})

it('getAll fetches all items when no paging specified', async () => {
  const BASE = 'https://api.example.com'
  const data = Array.from({ length: 3 }, (_, i) => ({ id: i + 1 }))
  
  nock(BASE).get('/campaigns').reply(200, data)
  
  const conn = createConnector()
  conn.initialize({
    baseUrl: BASE,
    auth: { type: 'bearer', bearer: { token: 't' } },
  })

  const pages: Array<ReadonlyArray<unknown>> = []
  for await (const page of conn.campaigns.getAll()) {
    pages.push(page)
  }

  expect(pages).toHaveLength(1)
  expect(pages[0]).toHaveLength(3)
})
