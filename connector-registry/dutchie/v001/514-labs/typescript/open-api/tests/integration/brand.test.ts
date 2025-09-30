// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global describe, it, expect, beforeAll */
import { createDutchieConnector } from '../../src'

const apiKey = process.env.DUTCHIE_API_KEY
const baseUrl = process.env.DUTCHIE_BASE_URL || 'https://api.pos.dutchie.com'

const maybe = apiKey ? describe : describe.skip

maybe('integration: brand', () => {
  it('streams brands and yields items', async () => {
    const events: Array<{ level: string; event: any }> = []

    const conn = createDutchieConnector()
    conn.initialize({
      baseUrl,
      auth: { type: 'basic', basic: { username: apiKey! } },
      logging: {
        enabled: true,
        level: 'info',
        logger: (level, event) => events.push({ level, event }),
      },
    })

    let count = 0
    for await (const page of conn.brand.getAll({ paging: { pageSize: 50 } })) {
      for (const brand of page) {
        expect(brand).toBeDefined()
        count += 1
        if (count >= 10) break
      }
      if (count >= 10) break
    }

    expect(count).toBeGreaterThan(0)
    const names = events.map(e => e.event?.event)
    expect(names).toEqual(expect.arrayContaining(['http_request', 'http_response']))
  })
})


