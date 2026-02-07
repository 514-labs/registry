/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

describe('Orders Resource', () => {
  const SHOP_NAME = 'test-shop'
  const BASE_URL = `https://${SHOP_NAME}.myshopify.com/admin/api/2024-10`

  afterEach(() => {
    nock.cleanAll()
  })

  it('lists orders', async () => {
    const orders = [
      { id: 1, name: '#1001', email: 'customer1@example.com' },
      { id: 2, name: '#1002', email: 'customer2@example.com' },
    ]

    nock(BASE_URL)
      .get('/orders.json')
      .query({ limit: 50 })
      .reply(200, { orders })

    const conn = createConnector()
    conn.init({
      shopName: SHOP_NAME,
      accessToken: 'test-token',
      apiVersion: '2024-10',
    })

    const pages = []
    for await (const page of conn.orders.list()) {
      pages.push(page)
    }

    expect(pages.length).toBe(1)
    expect(pages[0].length).toBe(2)
    expect(pages[0][0].name).toBe('#1001')
  })

  it('gets a single order', async () => {
    nock(BASE_URL)
      .get('/orders/456.json')
      .reply(200, {
        order: { id: 456, name: '#1003', email: 'test@example.com' }
      })

    const conn = createConnector()
    conn.init({
      shopName: SHOP_NAME,
      accessToken: 'test-token',
      apiVersion: '2024-10',
    })

    const order = await conn.orders.get(456)
    expect(order.id).toBe(456)
    expect(order.name).toBe('#1003')
  })
})
