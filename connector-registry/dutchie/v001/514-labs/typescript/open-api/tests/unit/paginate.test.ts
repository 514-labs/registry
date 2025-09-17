// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global jest, describe, it, expect, afterEach */
import nock from 'nock'
import { createDutchieConnector } from '../../src'

const BASE = 'https://api.pos.dutchie.com'

describe('pagination (offset fallback)', () => {
  afterEach(() => nock.cleanAll())

  it('streams across two pages using limit/offset', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    // page 1
    nock(BASE)
      .get('/brand')
      .query((q) => q.limit === '1' && (q.offset === undefined || q.offset === '0'))
      .matchHeader('authorization', `Basic ${basic}`)
      .reply(200, [{ brandId: 1 }])
    // page 2
    nock(BASE)
      .get('/brand')
      .query((q) => q.limit === '1' && q.offset === '1')
      .matchHeader('authorization', `Basic ${basic}`)
      .reply(200, [{ brandId: 2 }])

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } } })
    const seen: number[] = []
    for await (const b of conn.brand.streamAll({ pageSize: 1 })) {
      seen.push((b as any).brandId)
      if (seen.length >= 2) break
    }
    expect(seen).toEqual([1, 2])
  })
})


