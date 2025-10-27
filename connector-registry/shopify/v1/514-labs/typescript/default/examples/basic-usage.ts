import { createConnector } from '../src'

const conn = createConnector()
conn.initialize({
  baseUrl: 'https://your-shop.myshopify.com/admin/api/2025-07',
  auth: { type: 'bearer', bearer: { token: 'YOUR_SHOPIFY_ACCESS_TOKEN' } },
  logging: { enabled: true, level: 'info' },
  metrics: { enabled: true }
})

console.log('Shopify Connector initialized')

// Example: Fetch customers
// for await (const page of conn.customers.getAll({ limit: 25 })) {
//   console.log('Customers:', page)
// }

// Example: Fetch orders
// for await (const page of conn.orders.getAll({ limit: 25, status: 'any' })) {
//   console.log('Orders:', page)
// }

// Example: Fetch inventory levels
// for await (const page of conn.inventory.getAll({ limit: 25, mode: 'levels' })) {
//   console.log('Inventory:', page)
// }
