// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global jest, describe, it, expect, afterEach */
import nock from 'nock'
import { makeAjv } from '../utils/ajv'
import { createDutchieConnector } from '../../src'
import spec from '../../schemas/dutchie-openapi.json'

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

describe('products resource', () => {
  afterEach(() => nock.cleanAll())

  it('list: matches OpenAPI schema', async () => {
    const schema = derefDeep(findResponseSchema('/products')) || { type: 'array' }
    const ajv = makeAjv()
    const validate = ajv.compile(schema)
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const payload = [{ productId: 1, productName: 'Gummies' }]
    const scope = nock(BASE).get('/products').query(true).matchHeader('authorization', `Basic ${basic}`).reply(200, payload)
    const conn = createDutchieConnector()
    conn.initialize({ baseUrl: BASE, auth: { type: 'basic', basic: { username: apiKey } } })
    const res = await conn.products.list({ isActive: true })
    expect(validate(res.data)).toBe(true)
    scope.done()
  })
})


