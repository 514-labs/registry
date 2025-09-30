// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global describe, it, expect, beforeAll */
import nock from 'nock'
import { createDutchieConnector } from '../../src'

const BASE = 'https://api.pos.dutchie.com'


describe('inventory resource', () => {
  afterEach(() => nock.cleanAll())

  it('getAll: yields pages with items', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const payload = [{ inventoryId: 10, productId: 1, quantityAvailable: 5 }]
    const scope = nock(BASE).get('/inventory').query(true).matchHeader('authorization', `Basic ${basic}`).reply(200, payload)

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } } })

    const iter = conn.inventory.getAll({ params: { includeLabResults: false }, paging: { pageSize: 50 } })
    const { value: page } = await iter.next()
    expect(Array.isArray(page)).toBe(true)
    scope.done()
  })

  it('maps includeLabResults and includeRoomQuantities into query', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const scope = nock(BASE)
      .get('/inventory')
      .query((q) => q.includeLabResults === 'true' && q.includeRoomQuantities === 'true')
      .matchHeader('authorization', `Basic ${basic}`)
      .reply(200, [{ inventoryId: 77 }])

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } } })

    const iter = conn.inventory.getAll({ params: { includeLabResults: true, includeRoomQuantities: true } })
    const { value: page } = await iter.next()
    expect(Array.isArray(page)).toBe(true)
    expect(page?.[0].inventoryId).toBe(77)
    scope.done()
  })
})


