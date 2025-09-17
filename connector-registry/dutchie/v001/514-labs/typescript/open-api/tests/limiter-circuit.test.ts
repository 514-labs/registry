// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global describe, it, expect, afterEach */
import nock from 'nock'
import { Client } from '../src/client'

const BASE = 'https://api.pos.dutchie.com'

describe('rate limiter and circuit breaker', () => {
  afterEach(() => nock.cleanAll())

  it('adaptive limiter update can be disabled via config', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const scope = nock(BASE)
      .get('/brand')
      .matchHeader('authorization', `Basic ${basic}`)
      .reply(200, [], { 'x-ratelimit-remaining': '1' })

    const client = new Client({ apiKey, rateLimit: { adaptiveFromHeaders: false } })
    const res = await client.brand.list()
    expect(res.status).toBe(200)
    scope.done()
  })

  it('circuit breaker opens after consecutive failures', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const scope = nock(BASE)
      .get('/brand').times(2)
      .matchHeader('authorization', `Basic ${basic}`)
      .reply(500, { message: 'boom' })

    const client = new Client({ apiKey, circuitBreaker: { failureThreshold: 2, coolDownMs: 10 }, retry: { maxAttempts: 1 } })
    // First and second calls hit the server and fail
    await expect(client.brand.list()).rejects.toThrow(/Retryable status/)
    await expect(client.brand.list()).rejects.toThrow(/Retryable status/)
    scope.done()
    // Third call should short-circuit without making a network request
    await expect(client.brand.list()).rejects.toThrow(/Circuit breaker open/)
  })
})


