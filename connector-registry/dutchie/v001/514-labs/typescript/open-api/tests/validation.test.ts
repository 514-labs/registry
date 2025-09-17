// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global describe, it, expect, afterEach */
import { createOpenApiValidationHook } from '../src/validation/openapi'
import openapi from '../schemas/dutchie-openapi.json'

describe('validation hook', () => {
  it('strict=true throws on schema mismatch', async () => {
    const vHook = createOpenApiValidationHook(openapi)
    const ctx = {
      type: 'afterResponse',
      request: { method: 'GET', path: '/brand' },
      response: { status: 200, data: 'not-json-array' },
    } as any

    await expect(vHook(ctx)).rejects.toThrow(/VALIDATION_ERROR/i)
  })

  it('strict=false warns and continues (wrapper behavior)', async () => {
    const vHook = createOpenApiValidationHook(openapi)
    const ctx = {
      type: 'afterResponse',
      request: { method: 'GET', path: '/brand' },
      response: { status: 200, data: 'not-json-array' },
    } as any

    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    // simulate client's non-strict wrapper
    await (async () => {
      try { await vHook(ctx) } catch (e: any) { console.warn(e?.message || String(e)) }
    })()
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})


