// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global describe, it, expect, beforeAll */
import nock from 'nock'
import { createDutchieConnector } from '../../src'

const BASE = 'https://api.pos.dutchie.com'

describe('pagination (offset fallback)', () => {
  afterEach(() => nock.cleanAll())

  it('chunks a single response locally with pageSize', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    // Single request returns full array; client chunks locally
    nock(BASE)
      .get('/brand')
      .matchHeader('authorization', `Basic ${basic}`)
      .reply(200, [{ brandId: 1 }, { brandId: 2 }])

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } } })
    const pages: number[][] = []
    for await (const page of conn.brand.getAll({ paging: { pageSize: 1, maxItems: 2 } })) {
      const ids = page.map((b) => b.brandId).filter((id): id is number => typeof id === 'number')
      pages.push(ids)
    }
    expect(pages.flat()).toEqual([1, 2])
  })

  it('maxItems truncates results below pageSize', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    nock(BASE).get('/brand').matchHeader('authorization', `Basic ${basic}`).reply(200, [{ brandId: 1 }, { brandId: 2 }, { brandId: 3 }])

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } } })

    const out: number[] = []
    for await (const page of conn.brand.getAll({ paging: { pageSize: 5, maxItems: 2 } })) {
      out.push(...page.map((b) => b.brandId).filter((id): id is number => typeof id === 'number'))
    }
    expect(out).toEqual([1, 2])
  })

  it('pageSize omitted yields a single page of all items', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    nock(BASE).get('/brand').matchHeader('authorization', `Basic ${basic}`).reply(200, [{ brandId: 1 }, { brandId: 2 }, { brandId: 3 }])

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } } })

    const pages: number[][] = []
    for await (const page of conn.brand.getAll()) {
      pages.push(page.map((b) => b.brandId).filter((id): id is number => typeof id === 'number'))
    }
    expect(pages).toEqual([[1, 2, 3]])
  })

  it('pageSize <= 0 also yields a single page of all items', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    nock(BASE).get('/brand').matchHeader('authorization', `Basic ${basic}`).reply(200, [{ brandId: 1 }, { brandId: 2 }])

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } } })

    const pages: number[][] = []
    for await (const page of conn.brand.getAll({ paging: { pageSize: 0 } })) {
      pages.push(page.map((b) => b.brandId).filter((id): id is number => typeof id === 'number'))
    }
    expect(pages).toEqual([[1, 2]])
  })
})


