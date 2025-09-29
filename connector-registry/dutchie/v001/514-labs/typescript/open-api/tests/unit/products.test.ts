// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global describe, it, expect, beforeAll */
import nock from 'nock'
import { createDutchieConnector } from '../../src'

const BASE = 'https://api.pos.dutchie.com'


describe('products resource', () => {
  afterEach(() => nock.cleanAll())

  it('getAll: yields pages with items', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const payload = [{ productId: 1, productName: 'Gummies' }]
    const scope = nock(BASE).get('/products').query(true).matchHeader('authorization', `Basic ${basic}`).reply(200, payload)

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } } })

    const iter = conn.products.getAll({ params: { isActive: true }, paging: { pageSize: 50 } })
    const { value: page } = await iter.next()
    expect(Array.isArray(page)).toBe(true)
    scope.done()
  })

  it('maps isActive and fromLastModifiedDateUTC into query', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const scope = nock(BASE)
      .get('/products')
      .query((q) => q.isActive === 'true' && q.fromLastModifiedDateUTC === '2024-01-01T00:00:00Z')
      .matchHeader('authorization', `Basic ${basic}`)
      .reply(200, [{ productId: 99 }])

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } } })

    const iter = conn.products.getAll({ params: { isActive: true, fromLastModifiedDateUTC: '2024-01-01T00:00:00Z' } })
    const { value: page } = await iter.next()
    expect(Array.isArray(page)).toBe(true)
    expect((page as any)[0].productId).toBe(99)
    scope.done()
  })
})


