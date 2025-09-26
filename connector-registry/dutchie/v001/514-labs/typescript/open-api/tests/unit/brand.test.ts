// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global describe, it, expect, beforeAll */
import nock from 'nock'
import { createDutchieConnector } from '../../src'

const BASE = 'https://api.pos.dutchie.com'


describe('brand resource', () => {
  afterEach(() => nock.cleanAll())

  it('getAll: yields pages with items', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const payload = [{ brandId: 1, brandName: 'Example' }]
    const scope = nock(BASE).get('/brand').query(true).matchHeader('authorization', `Basic ${basic}`).reply(200, payload)

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } } })

    const iter = conn.brand.getAll({ pageSize: 50 })
    const { value: page } = await iter.next()
    expect(Array.isArray(page)).toBe(true)
    scope.done()
  })

  it('getAll: yields multiple pages', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    nock(BASE).get('/brand').matchHeader('authorization', `Basic ${basic}`).reply(200, [{ brandId: 1 }, { brandId: 2 }])

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } } })

    const pages: number[][] = []
    for await (const page of conn.brand.getAll({ pageSize: 1, maxItems: 2 })) {
      const ids = page
        .map((b) => b.brandId)
        .filter((id): id is number => typeof id === 'number')
      pages.push(ids)
    }
    expect(pages.flat()).toEqual([1,2])
  })
})


