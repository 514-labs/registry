import { describe, it, expect, afterEach } from 'vitest'
import nock from 'nock'
import Ajv from 'ajv'
import { Client } from '../src/client'
import spec from '../schemas/dutchie-openapi.json'

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

describe('inventory resource', () => {
  afterEach(() => nock.cleanAll())

  it('list: matches OpenAPI schema', async () => {
    const schema = derefDeep(findResponseSchema('/inventory')) || { type: 'array' }
    const ajv = new Ajv({ strict: false })
    const validate = ajv.compile(schema)
    const apiKey = 'test-key'
    const basic = Buffer.from(`${apiKey}:`).toString('base64')
    const payload = [{ inventoryId: 10, productId: 1, quantityAvailable: 5 }]
    const scope = nock(BASE).get('/inventory').query(true).matchHeader('authorization', `Basic ${basic}`).reply(200, payload)
    const client = new Client({ apiKey })
    const res = await client.inventory.list({ includeLabResults: false })
    expect(validate(res.data)).toBe(true)
    scope.done()
  })
})


