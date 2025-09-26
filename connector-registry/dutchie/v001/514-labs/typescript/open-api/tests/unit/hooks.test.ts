// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global describe, it, expect, beforeAll */
import nock from 'nock'
import { createDutchieConnector } from '../../src'
import type { Hook, HookContext } from '@connector-factory/core'

const BASE = 'https://api.pos.dutchie.com'

describe('hooks', () => {
  afterEach(() => nock.cleanAll())

  it('calls hooks in order', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const events: string[] = []
    const hooks: Partial<Record<'beforeRequest'|'afterResponse'|'onError'|'onRetry', Hook[]>> = {
      beforeRequest: [{ name: 'before', execute: () => { events.push('before') } }],
      afterResponse: [{ name: 'after', execute: () => { events.push('after') } }],
      onError: [{ name: 'error', execute: () => { events.push('error') } }],
      onRetry: [{ name: 'retry', execute: () => { events.push('retry') } }],
    }

    const scope = nock(BASE)
      .get('/brand').query(true)
      .matchHeader('authorization', `Basic ${basic}`)
      .reply(200, [])

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } }, hooks: hooks as any })

    const iter = conn.brand.getAll({ pageSize: 50 })
    await iter.next()
    expect(events).toEqual(['before', 'after'])
    scope.done()
  })

  it('afterResponse can modify the response payload', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')

    const scope = nock(BASE)
      .get('/brand').query(true)
      .matchHeader('authorization', `Basic ${basic}`)
      .reply(200, [{ id: '1', name: 'Acme' }])

    const hooks: Partial<Record<'beforeRequest'|'afterResponse'|'onError'|'onRetry', Hook[]>> = {
      afterResponse: [{ name: 'map', execute: (ctx: HookContext) => {
        if (ctx.type !== 'afterResponse') return
        const data = Array.isArray(ctx.response.data) ? ctx.response.data : []
        const mapped = data.map((b: any) => ({ ...b, upperName: String(b.name ?? '').toUpperCase() }))
        ctx.modifyResponse({ data: mapped as any })
      }}],
    }

    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } }, hooks })

    const iter = conn.brand.getAll({ pageSize: 50 })
    const { value: page } = await iter.next()
    expect(Array.isArray(page)).toBe(true)
    expect((page as any)[0].upperName).toBe('ACME')
    scope.done()
  })
})


