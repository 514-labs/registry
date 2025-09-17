// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global jest, describe, it, expect, afterEach */
import nock from 'nock'
import { createDutchieConnector } from '../src'

const BASE = 'https://api.pos.dutchie.com'

describe('rate limit and retry behavior', () => {
  afterEach(() => nock.cleanAll())

  it('honors Retry-After on 429 then succeeds', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const scope = nock(BASE)
      .get('/brand').matchHeader('authorization', `Basic ${basic}`).reply(429, { message: 'rate limited' }, { 'Retry-After': '0' })
      .get('/brand').matchHeader('authorization', `Basic ${basic}`).reply(200, [])

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } } })
    const res = await conn.brand.list()
    expect(res.status).toBe(200)
    scope.done()
  })

  it('returns 5xx without retry when maxAttempts=1', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const scope = nock(BASE)
      .get('/brand').matchHeader('authorization', `Basic ${basic}`).reply(500, { message: 'boom' })

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } }, retry: { maxAttempts: 1 } })
    const res = await conn.brand.list()
    expect(res.status).toBe(500)
    scope.done()
  })

  it('can disable adaptive rate-limit from headers', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const scope = nock(BASE)
      .get('/brand').matchHeader('authorization', `Basic ${basic}`).reply(200, [], { 'x-ratelimit-remaining': '1' })

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } }, rateLimit: { adaptiveFromHeaders: false } })
    const res = await conn.brand.list()
    expect(res.status).toBe(200)
    scope.done()
  })
})


