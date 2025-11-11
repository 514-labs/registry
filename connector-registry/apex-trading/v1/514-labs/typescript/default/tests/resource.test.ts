/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

it('accounts.list yields chunks and respects maxItems', async () => {
  const BASE = 'https://omni.apex.exchange'
  nock(BASE).get('/api/v3/accounts').query({ limit: 2, offset: 0 }).reply(200, [{ id: '1' }, { id: '2' }])
  nock(BASE).get('/api/v3/accounts').query({ limit: 2, offset: 2 }).reply(200, [{ id: '3' }, { id: '4' }])
  nock(BASE).get('/api/v3/accounts').query({ limit: 0, offset: 4 }).reply(200, [])

  const conn = createConnector()
  conn.initialize({ apiKey: 'test-key' })
  const pages: Array<ReadonlyArray<unknown>> = []
  for await (const page of conn.accounts.list({ pageSize: 2, maxItems: 4 })) pages.push(page)
  expect(pages.map(p => p.length)).toEqual([2, 2])
})

