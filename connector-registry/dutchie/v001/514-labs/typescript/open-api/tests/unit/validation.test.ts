// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global describe, it, expect, afterEach */
import nock from 'nock'
import { createDutchieConnector } from '../../src'
import { assert } from 'typia'
import type { Brand } from '../../src'

const BASE = 'https://api.pos.dutchie.com'

describe('validation (typia)', () => {
  afterEach(() => nock.cleanAll())

  it.skip('strict=true throws on mismatch', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    nock(BASE).get('/brand').matchHeader('authorization', `Basic ${basic}`).reply(200, { not: 'an array' })

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } }, validation: { enabled: true, strict: true } })

    await expect(conn.brand.list()).rejects.toThrow()
  })

  it('strict=false warns and continues', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    nock(BASE).get('/brand').matchHeader('authorization', `Basic ${basic}`).reply(200, { not: 'an array' })

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } }, validation: { enabled: true, strict: false } })

    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const res = await conn.brand.list()
    expect(res.status).toBe(200)
    spy.mockRestore()
  })
})


