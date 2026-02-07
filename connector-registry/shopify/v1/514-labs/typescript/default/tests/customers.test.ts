/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

describe('Customers Resource', () => {
  const SHOP_NAME = 'test-shop'
  const BASE_URL = `https://${SHOP_NAME}.myshopify.com/admin/api/2024-10`

  afterEach(() => {
    nock.cleanAll()
  })

  it('lists customers', async () => {
    const customers = [
      { id: 1, email: 'customer1@example.com', first_name: 'John', last_name: 'Doe' },
      { id: 2, email: 'customer2@example.com', first_name: 'Jane', last_name: 'Smith' },
    ]

    nock(BASE_URL)
      .get('/customers.json')
      .query({ limit: 50 })
      .reply(200, { customers })

    const conn = createConnector()
    conn.init({
      shopName: SHOP_NAME,
      accessToken: 'test-token',
      apiVersion: '2024-10',
    })

    const pages = []
    for await (const page of conn.customers.list()) {
      pages.push(page)
    }

    expect(pages.length).toBe(1)
    expect(pages[0].length).toBe(2)
    expect(pages[0][0].email).toBe('customer1@example.com')
  })

  it('gets a single customer', async () => {
    nock(BASE_URL)
      .get('/customers/789.json')
      .reply(200, {
        customer: { id: 789, email: 'test@example.com', first_name: 'Test', last_name: 'User' }
      })

    const conn = createConnector()
    conn.init({
      shopName: SHOP_NAME,
      accessToken: 'test-token',
      apiVersion: '2024-10',
    })

    const customer = await conn.customers.get(789)
    expect(customer.id).toBe(789)
    expect(customer.email).toBe('test@example.com')
  })

  it('searches customers', async () => {
    nock(BASE_URL)
      .get('/customers/search.json')
      .query({ query: 'email:john@example.com' })
      .reply(200, {
        customers: [{ id: 1, email: 'john@example.com', first_name: 'John' }]
      })

    const conn = createConnector()
    conn.init({
      shopName: SHOP_NAME,
      accessToken: 'test-token',
      apiVersion: '2024-10',
    })

    const customers = await conn.customers.search({ query: 'email:john@example.com' })
    expect(customers.length).toBe(1)
    expect(customers[0].email).toBe('john@example.com')
  })
})
