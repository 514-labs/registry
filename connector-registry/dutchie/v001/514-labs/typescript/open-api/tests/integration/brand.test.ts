// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global describe, it, expect, beforeAll */
import { createDutchieConnector } from '../../src'

const apiKey = process.env.DUTCHIE_API_KEY
const baseUrl = process.env.DUTCHIE_BASE_URL || 'https://api.pos.dutchie.com'

const maybe = apiKey ? describe : describe.skip

maybe('integration: brand stream', () => {
  let conn: ReturnType<typeof createDutchieConnector>

  beforeAll(() => {
    conn = createDutchieConnector()
    conn.initialize({
      baseUrl,
      auth: { type: 'basic', basic: { username: apiKey! } },
      timeoutMs: 30000,
      userAgent: 'connector-dutchie-integration-test',
      // Optional: enable logging at warn to help debug failures
      logging: { enabled: true, level: 'warn' },
    })
  })

  it('streams brands and yields items', async () => {
    let count = 0
    for await (const brand of conn.brand.streamAll({ pageSize: 50 })) {
      expect(brand).toBeDefined()
      count += 1
      if (count >= 1) break
    }
    expect(count).toBeGreaterThan(0)
  })
})


