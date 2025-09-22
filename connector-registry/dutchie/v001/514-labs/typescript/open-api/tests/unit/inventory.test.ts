// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global jest, describe, it, expect, afterEach */
import nock from 'nock'
import { createDutchieConnector } from '../../src'

const BASE = 'https://api.pos.dutchie.com'


describe('inventory resource', () => {
  afterEach(() => nock.cleanAll())

  it('list: returns an array of items', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const payload = [{ inventoryId: 10, productId: 1, quantityAvailable: 5 }]
    const scope = nock(BASE).get('/inventory').query(true).matchHeader('authorization', `Basic ${basic}`).reply(200, payload)
    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } } })
    const res = await conn.inventory.list({ includeLabResults: false })
    expect(Array.isArray(res.data)).toBe(true)
    scope.done()
  })
})


