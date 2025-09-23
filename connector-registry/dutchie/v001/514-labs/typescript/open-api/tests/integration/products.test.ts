// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global describe, it, expect, beforeAll */
import { createDutchieConnector } from '../../src'

const apiKey = process.env.DUTCHIE_API_KEY
const baseUrl = process.env.DUTCHIE_BASE_URL || 'https://api.pos.dutchie.com'

const maybe = apiKey ? describe : describe.skip

maybe('integration: products', () => {
  let conn: ReturnType<typeof createDutchieConnector>

  beforeAll(() => {
    conn = createDutchieConnector()
    conn.initialize({
      baseUrl,
      auth: { type: 'basic', basic: { username: apiKey! } },
      logging: {
        enabled: true,
        level: 'info',
      },
    })
  })

  it('lists products and streams at least one item', async () => {
    const listRes = await conn.products.list({})
    expect(listRes.status).toBe(200)
    expect(Array.isArray(listRes.data)).toBe(true)
    expect(listRes.data.length).toBeGreaterThan(0)

    let count = 0
    for await (const product of conn.products.streamAll({ pageSize: 50 })) {
      expect(product).toBeDefined()
      count += 1
      if (count >= 10) break
    }
    expect(count).toBeGreaterThan(0)
  })
})



