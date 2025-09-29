// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global describe, it, expect, beforeAll */
import { createDutchieConnector } from '../../src'

const apiKey = process.env.DUTCHIE_API_KEY
const baseUrl = process.env.DUTCHIE_BASE_URL || 'https://api.pos.dutchie.com'

const maybe = apiKey ? describe : describe.skip

maybe('integration: discounts flattened', () => {
  let conn: ReturnType<typeof createDutchieConnector>

  beforeAll(() => {
    conn = createDutchieConnector()
    conn.initialize({
      baseUrl,
      auth: { type: 'basic', basic: { username: apiKey! } },
      logging: { enabled: true, level: 'info', /* includeBody: true */ },
    })
  })

  it('streams discounts and yields flattened items', async () => {
    let sawFlat = false
    let count = 0
    for await (const page of conn.discounts.getAll({ paging: { pageSize: 50 } })) {
      for (const discount of page) {
        expect(discount).toBeDefined()
        // Check a representative flattened field exists
        if ('reward_discountRewardId' in discount) sawFlat = true
        count += 1
        if (count >= 10) break
      }
      if (count >= 10) break
    }
    expect(count).toBeGreaterThan(0)
    expect(sawFlat).toBe(true)
  })
})


