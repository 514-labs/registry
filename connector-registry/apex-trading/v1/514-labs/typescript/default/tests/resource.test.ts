/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

it('products.list yields chunks and respects maxItems', async () => {
  const BASE = 'https://api-docs.apextrading.com'
  nock(BASE).get('/products').query({ limit: 2, offset: 0 }).reply(200, [{ id: '1', name: 'Product 1' }, { id: '2', name: 'Product 2' }])
  nock(BASE).get('/products').query({ limit: 2, offset: 2 }).reply(200, [{ id: '3', name: 'Product 3' }, { id: '4', name: 'Product 4' }])
  nock(BASE).get('/products').query({ limit: 0, offset: 4 }).reply(200, [])

  const conn = createConnector()
  conn.initialize({ apiKey: 'test-key' })
  const pages: Array<ReadonlyArray<unknown>> = []
  for await (const page of conn.products.list({ pageSize: 2, maxItems: 4 })) pages.push(page)
  expect(pages.map(p => p.length)).toEqual([2, 2])
})

