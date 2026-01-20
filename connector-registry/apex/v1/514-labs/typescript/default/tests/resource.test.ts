/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

describe('Apex Connector - Batches', () => {
  const BASE = 'https://app.apextrading.com'
  
  it('lists batches with pagination', async () => {
    nock(BASE)
      .get('/api/v2/batches')
      .query({ page: 1, per_page: 2 })
      .reply(200, {
        batches: [{ id: 1 }, { id: 2 }],
        links: { next: 'https://app.apextrading.com/api/v2/batches?page=2' },
        meta: { current_page: 1, last_page: 2, per_page: 2, total: 3 }
      })

    nock(BASE)
      .get('/api/v2/batches')
      .query({ page: 2, per_page: 2 })
      .reply(200, {
        batches: [{ id: 3 }],
        links: {},
        meta: { current_page: 2, last_page: 2, per_page: 2, total: 3 }
      })

    const conn = createConnector()
    conn.init({ accessToken: 'test-token' })

    const pages: Array<ReadonlyArray<unknown>> = []
    for await (const page of conn.batches.list({ pageSize: 2 })) {
      pages.push(page)
    }

    expect(pages.length).toBe(2)
    expect(pages[0].length).toBe(2)
    expect(pages[1].length).toBe(1)
    expect((pages[0][0] as any).id).toBe(1)
    expect((pages[1][0] as any).id).toBe(3)
  })

  it('respects maxItems when listing batches', async () => {
    nock(BASE)
      .get('/api/v2/batches')
      .query({ page: 1, per_page: 2 })
      .reply(200, {
        batches: [{ id: 1 }, { id: 2 }],
        links: { next: 'https://app.apextrading.com/api/v2/batches?page=2' },
        meta: { current_page: 1, last_page: 3, per_page: 2, total: 6 }
      })

    nock(BASE)
      .get('/api/v2/batches')
      .query({ page: 2, per_page: 1 })
      .reply(200, {
        batches: [{ id: 3 }],
        links: {},
        meta: { current_page: 2, last_page: 3, per_page: 1, total: 6 }
      })

    const conn = createConnector()
    conn.init({ accessToken: 'test-token' })

    const pages: Array<ReadonlyArray<unknown>> = []
    for await (const page of conn.batches.list({ pageSize: 2, maxItems: 3 })) {
      pages.push(page)
    }

    expect(pages.length).toBe(2)
    expect(pages[0].length).toBe(2)
    expect(pages[1].length).toBe(1)
  })

  it('gets a single batch', async () => {
    nock(BASE)
      .get('/api/v2/batches/123')
      .reply(200, { batch: { id: 123, name: 'Test Batch' } })

    const conn = createConnector()
    conn.init({ accessToken: 'test-token' })

    const batch = await conn.batches.get(123)
    expect(batch.id).toBe(123)
    expect(batch.name).toBe('Test Batch')
  })
})

describe('Apex Connector - Buyers', () => {
  const BASE = 'https://app.apextrading.com'

  it('lists buyers with updated_at_from filter', async () => {
    nock(BASE)
      .get('/api/v1/buyers')
      .query({ page: 1, per_page: 15, updated_at_from: '2025-04-20T22:04:50Z' })
      .reply(200, {
        buyers: [{ id: 1, name: 'Buyer 1' }, { id: 2, name: 'Buyer 2' }],
        links: {},
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 2 }
      })

    const conn = createConnector()
    conn.init({ accessToken: 'test-token' })

    const pages: Array<ReadonlyArray<unknown>> = []
    for await (const page of conn.buyers.list({ updated_at_from: '2025-04-20T22:04:50Z' })) {
      pages.push(page)
    }

    expect(pages.length).toBe(1)
    expect(pages[0].length).toBe(2)
  })
})

describe('Apex Connector - Brands', () => {
  const BASE = 'https://app.apextrading.com'

  it('lists brands', async () => {
    nock(BASE)
      .get('/api/v1/brands')
      .query({ page: 1, per_page: 15 })
      .reply(200, {
        brands: [{ id: 1, name: 'Brand A' }],
        links: {},
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 }
      })

    const conn = createConnector()
    conn.init({ accessToken: 'test-token' })

    const pages: Array<ReadonlyArray<unknown>> = []
    for await (const page of conn.brands.list()) {
      pages.push(page)
    }

    expect(pages.length).toBe(1)
    expect(pages[0].length).toBe(1)
  })
})

