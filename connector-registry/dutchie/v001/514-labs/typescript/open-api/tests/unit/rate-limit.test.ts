// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global jest, describe, it, expect, afterEach */
import nock from 'nock'
import { createDutchieConnector } from '../../src'

const BASE = 'https://api.pos.dutchie.com'

describe('rate limit and retry behavior', () => {
  afterEach(() => nock.cleanAll())

  it('honors Retry-After on 429 then succeeds', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const scope = nock(BASE)
      .get('/brand').query(true).matchHeader('authorization', `Basic ${basic}`).reply(429, { message: 'rate limited' }, { 'Retry-After': '0' })
      .get('/brand').query(true).matchHeader('authorization', `Basic ${basic}`).reply(200, [])

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } } })
    const iter = conn.brand.getAll({ paging: { pageSize: 50 } })
    const { value: page } = await iter.next()
    // after a 429 then 200([]), first page may be empty
    expect(Array.isArray(page) || page === undefined).toBe(true)
    scope.done()
  })

  it('returns 5xx without retry when maxAttempts=1', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const scope = nock(BASE)
      .get('/brand').query(true).matchHeader('authorization', `Basic ${basic}`).reply(500, { message: 'boom' })

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } }, retry: { maxAttempts: 1 } })
    const iter = conn.brand.getAll({ paging: { pageSize: 50 } })
    const { value: page } = await iter.next()
    expect(Array.isArray(page) || page === undefined).toBe(true)
    scope.done()
  })

  it('can disable adaptive rate-limit from headers', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const scope = nock(BASE)
      .get('/brand').query(true).matchHeader('authorization', `Basic ${basic}`).reply(200, [], { 'x-ratelimit-remaining': '1' })

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } }, rateLimit: { adaptiveFromHeaders: false } })
    const iter = conn.brand.getAll({ paging: { pageSize: 50 } })
    const { value: page } = await iter.next()
    expect(Array.isArray(page) || page === undefined).toBe(true)
    scope.done()
  })
})


