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

  it('afterResponse can modify the response payload', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')

    const scope = nock(BASE)
      .get('/brand')
      .matchHeader('authorization', `Basic ${basic}`)
      .reply(200, [{ id: '1', name: 'Acme' }])

    const hooks: Hooks = {
      afterResponse: [({ type, response, modifyResponse }) => {
        if (type !== 'afterResponse' || !response || !modifyResponse) return
        const data = Array.isArray(response.data) ? response.data : []
        const mapped = data.map((b: any) => ({ ...b, upperName: String(b.name ?? '').toUpperCase() }))
        modifyResponse({ data: mapped as any })
      }],
    }

    const client = new Client({ apiKey, hooks })
    const res = await client.brand.list()
    expect(Array.isArray(res.data)).toBe(true)
    expect((res.data as any)[0].upperName).toBe('ACME')
    scope.done()
  })
})


