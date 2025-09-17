// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global jest, describe, it, expect, afterEach */
import nock from 'nock'
import { makeAjv } from '../utils/ajv'
import { createDutchieConnector } from '../../src'
import spec from '../../schemas/files/dutchie-openapi.json'

const BASE = 'https://api.pos.dutchie.com'

function findResponseSchema(path: string) {
  const appJson = (spec as any).paths?.[path]?.get?.responses?.['200']?.content?.['application/json']?.schema
  return appJson
}

function derefDeep(schema: any): any {
  if (!schema || typeof schema !== 'object') return schema
  if (schema.$ref && typeof schema.$ref === 'string' && schema.$ref.startsWith('#/components/schemas/')) {
    const name = schema.$ref.replace('#/components/schemas/', '')
    return derefDeep((spec as any).components?.schemas?.[name] ?? schema)
  }
  if (Array.isArray(schema)) return schema.map(derefDeep)
  const out: any = {}
  for (const [k, v] of Object.entries(schema)) out[k] = derefDeep(v)
  return out
}

describe('brand resource', () => {
  afterEach(() => nock.cleanAll())

  it('list: matches OpenAPI schema', async () => {
    const schema = derefDeep(findResponseSchema('/brand')) || { type: 'array' }
    const ajv = makeAjv()
    const validate = ajv.compile(schema)
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const payload = [{ brandId: 1, brandName: 'Example' }]
    const scope = nock(BASE).get('/brand').matchHeader('authorization', `Basic ${basic}`).reply(200, payload)
    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } } })
    const res = await conn.brand.list()
    expect(validate(res.data)).toBe(true)
    scope.done()
  })

  it('streamAll: yields multiple pages', async () => {
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    nock(BASE).get('/brand').query((q)=>q.limit==='1' && (!('offset' in q) || q.offset==='0')).matchHeader('authorization', `Basic ${basic}`).reply(200, [{ brandId: 1 }])
    nock(BASE).get('/brand').query((q)=>q.limit==='1' && q.offset==='1').matchHeader('authorization', `Basic ${basic}`).reply(200, [{ brandId: 2 }])
    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } } })
    const seen: number[] = []
    for await (const b of conn.brand.streamAll({ pageSize: 1 })) {
      seen.push((b as any).brandId)
      if (seen.length >= 2) break
    }
    expect(seen).toEqual([1,2])
  })
})


