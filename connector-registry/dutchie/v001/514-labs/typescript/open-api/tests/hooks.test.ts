// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global jest, describe, it, expect, afterEach */
import nock from 'nock'
import { createDutchieConnector } from '../src'
import type { Hooks } from '../src/lib/hooks'

const BASE = 'https://api.pos.dutchie.com'

describe('hooks', () => {
  afterEach(() => nock.cleanAll())

  it('calls hooks in order', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const events: string[] = []
    const hooks: Hooks = {
      beforeRequest: [{ name: 'before', execute: () => { events.push('before') } } as any],
      afterResponse: [{ name: 'after', execute: () => { events.push('after') } } as any],
      onError: [{ name: 'error', execute: () => { events.push('error') } } as any],
      onRetry: [{ name: 'retry', execute: () => { events.push('retry') } } as any],
    }

    const scope = nock(BASE)
      .get('/brand')
      .matchHeader('authorization', `Basic ${basic}`)
      .reply(200, [])

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } }, hooks: hooks as any })
    await conn.brand.list()
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
      afterResponse: [{ name: 'map', execute: ({ type, response, modifyResponse }: any) => {
        if (type !== 'afterResponse' || !response || !modifyResponse) return
        const data = Array.isArray(response.data) ? response.data : []
        const mapped = data.map((b: any) => ({ ...b, upperName: String(b.name ?? '').toUpperCase() }))
        modifyResponse({ data: mapped as any })
      }} as any],
    }

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } }, hooks: hooks as any })
    const res = await conn.brand.list()
    expect(Array.isArray(res.data)).toBe(true)
    expect((res.data as any)[0].upperName).toBe('ACME')
    scope.done()
  })
})


