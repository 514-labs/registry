import { describe, it, expect, afterEach } from 'vitest'
import nock from 'nock'
import { Client } from '../src/client'

const BASE = 'https://api.pos.dutchie.com'

describe('client', () => {
  afterEach(() => nock.cleanAll())

  it('uses Basic auth with API key (password empty)', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const scope = nock(BASE)
      .get('/brand')
      .matchHeader('authorization', `Basic ${basic}`)
      .reply(200, [])

    const client = new Client({ apiKey })
    const res = await client.brand.list()
    expect(Array.isArray(res.data)).toBe(true)
    scope.done()
  })
})
