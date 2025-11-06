/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

describe('Products Resource', () => {
  const SHOP_NAME = 'test-shop'
  const BASE_URL = `https://${SHOP_NAME}.myshopify.com/admin/api/2024-10`

  afterEach(() => {
    nock.cleanAll()
  })

  it('lists products with pagination', async () => {
    const products1 = [
      { id: 1, title: 'Product 1', handle: 'product-1' },
      { id: 2, title: 'Product 2', handle: 'product-2' },
    ]
    const products2 = [
      { id: 3, title: 'Product 3', handle: 'product-3' },
    ]

    nock(BASE_URL)
      .get('/products.json')
      .query({ limit: 2 })
      .reply(200, { products: products1 }, {
        'Link': `<${BASE_URL}/products.json?page_info=page2>; rel="next"`
      })

    nock(BASE_URL)
      .get('/products.json')
      .query({ limit: 2, page_info: 'page2' })
      .reply(200, { products: products2 })

    const conn = createConnector()
    conn.init({
      shopName: SHOP_NAME,
      accessToken: 'test-token',
      apiVersion: '2024-10',
    })

    const pages = []
    for await (const page of conn.products.list({ pageSize: 2 })) {
      pages.push(page)
    }

    expect(pages.length).toBe(2)
    expect(pages[0].length).toBe(2)
    expect(pages[1].length).toBe(1)
    expect(pages[0][0].title).toBe('Product 1')
    expect(pages[1][0].title).toBe('Product 3')
  })

  it('gets a single product', async () => {
    nock(BASE_URL)
      .get('/products/123.json')
      .reply(200, {
        product: { id: 123, title: 'Test Product', handle: 'test-product' }
      })

    const conn = createConnector()
    conn.init({
      shopName: SHOP_NAME,
      accessToken: 'test-token',
      apiVersion: '2024-10',
    })

    const product = await conn.products.get(123)
    expect(product.id).toBe(123)
    expect(product.title).toBe('Test Product')
  })

  it('respects maxItems', async () => {
    const products = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      title: `Product ${i + 1}`,
      handle: `product-${i + 1}`,
    }))

    nock(BASE_URL)
      .get('/products.json')
      .query({ limit: 50 })
      .reply(200, { products })

    const conn = createConnector()
    conn.init({
      shopName: SHOP_NAME,
      accessToken: 'test-token',
      apiVersion: '2024-10',
    })

    const pages = []
    for await (const page of conn.products.list({ maxItems: 3 })) {
      pages.push(page)
    }

    expect(pages.length).toBe(1)
    expect(pages[0].length).toBe(3)
  })
})
