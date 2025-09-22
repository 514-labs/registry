// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global jest, describe, it, expect, afterEach */
import nock from 'nock'
import { createDutchieConnector } from '../../src'
// runtime shape check only; compile-time types are covered by generated types

const BASE = 'https://api.pos.dutchie.com'


describe('products resource', () => {
  afterEach(() => nock.cleanAll())

  it('list: returns an array of items', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const payload = [{ productId: 1, productName: 'Gummies' }]
    const scope = nock(BASE).get('/products').query(true).matchHeader('authorization', `Basic ${basic}`).reply(200, payload)
    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } } })
    const res = await conn.products.list({ isActive: true })
    expect(Array.isArray(res.data)).toBe(true)
    scope.done()
  })
})


