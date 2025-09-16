// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global jest, describe, it, expect, afterEach */
import nock from 'nock'
import { Client } from '../src/client'
import type { Hooks } from '../src/lib/hooks'

const BASE = 'https://api.pos.dutchie.com'

describe('hooks', () => {
  afterEach(() => nock.cleanAll())

  it('calls hooks in order', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const events: string[] = []
    const hooks: Hooks = {
      beforeRequest: [() => { events.push('before') }],
      afterResponse: [() => { events.push('after') }],
      onError: [() => { events.push('error') }],
      onRetry: [() => { events.push('retry') }],
    }

    const scope = nock(BASE)
      .get('/brand')
      .matchHeader('authorization', `Basic ${basic}`)
      .reply(200, [])

    const client = new Client({ apiKey, hooks })
    await client.brand.list()
    expect(events).toEqual(['before', 'after'])
    scope.done()
  })
})


