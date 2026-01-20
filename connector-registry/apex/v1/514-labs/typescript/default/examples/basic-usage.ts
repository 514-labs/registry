import { createConnector } from '../src'

// Initialize the connector
const conn = createConnector()
conn.init({
  accessToken: process.env.APEX_ACCESS_TOKEN || 'YOUR_TOKEN',
  baseUrl: process.env.APEX_BASE_URL, // Optional
  logging: {
    enabled: true,
    level: 'info'
  }
})

async function main() {
  console.log('Apex Connector initialized')

  // ===== BATCHES (v2 API) =====
  console.log('\n===== BATCHES =====')

  // List batches with filters
  console.log('\nFetching batches...')
  for await (const page of conn.batches.list({
    updated_at_from: '2024-01-01T00:00:00Z',
    pageSize: 10,
    maxItems: 20
  })) {
    console.log(`Page with ${page.length} batches`)
    page.forEach(batch => console.log(`  - Batch #${batch.id}`))
  }

  // Get a single batch (uncomment and replace ID)
  // const batch = await conn.batches.get(123)
  // console.log('Single batch:', batch)

  // Create a new batch (uncomment to test)
  // const newBatch = await conn.batches.create({ /* batch data */ })
  // console.log('Created batch:', newBatch)

  // Update a batch (uncomment to test)
  // const updatedBatch = await conn.batches.update(123, { /* updated data */ })
  // console.log('Updated batch:', updatedBatch)

  // ===== BRANDS =====
  console.log('\n===== BRANDS =====')

  // List brands
  console.log('\nFetching brands...')
  for await (const page of conn.brands.list({ pageSize: 5, maxItems: 10 })) {
    console.log(`Page with ${page.length} brands`)
    page.forEach(brand => console.log(`  - ${brand.name} (ID: ${brand.id})`))
  }

  // Get a single brand (uncomment and replace ID)
  // const brand = await conn.brands.get(1)
  // console.log('Single brand:', brand)

  // ===== BUYERS =====
  console.log('\n===== BUYERS =====')

  // List buyers with filters
  console.log('\nFetching buyers...')
  for await (const page of conn.buyers.list({
    updated_at_from: '2024-01-01T00:00:00Z',
    pageSize: 10,
    maxItems: 20
  })) {
    console.log(`Page with ${page.length} buyers`)
    page.forEach(buyer => console.log(`  - ${buyer.name} (UUID: ${buyer.uuid})`))
  }

  // Get a single buyer (uncomment and replace ID)
  // const buyer = await conn.buyers.get(456)
  // console.log('Single buyer:', buyer)

  // ===== BUYER CONTACT LOGS =====
  console.log('\n===== BUYER CONTACT LOGS =====')

  // List buyer contact logs with filters
  console.log('\nFetching buyer contact logs...')
  for await (const page of conn.buyerContactLogs.list({
    buyer_id: 1, // Optional: filter by specific buyer
    updated_at_from: '2024-01-01T00:00:00Z',
    pageSize: 10,
    maxItems: 20
  })) {
    console.log(`Page with ${page.length} contact logs`)
    page.forEach(log => console.log(`  - Log #${log.id}`))
  }

  // Get a single buyer contact log (uncomment and replace ID)
  // const contactLog = await conn.buyerContactLogs.get(789)
  // console.log('Single contact log:', contactLog)

  // ===== BUYER STAGES =====
  console.log('\n===== BUYER STAGES =====')

  // List buyer stages
  console.log('\nFetching buyer stages...')
  for await (const page of conn.buyerStages.list({ pageSize: 10 })) {
    console.log(`Page with ${page.length} buyer stages`)
    page.forEach(stage => console.log(`  - ${stage.name} (Color: ${stage.color})`))
  }

  // Get a single buyer stage (uncomment and replace ID)
  // const stage = await conn.buyerStages.get(1)
  // console.log('Single buyer stage:', stage)

  // ===== PRODUCTS =====
  console.log('\n===== PRODUCTS =====')

  // List products with filters
  console.log('\nFetching products...')
  for await (const page of conn.products.list({
    updated_at_from: '2024-01-01T00:00:00Z',
    has_available_batches: true,
    include_sold_out_batches: false,
    pageSize: 10,
    maxItems: 20
  })) {
    console.log(`Page with ${page.length} products`)
    page.forEach(product => console.log(`  - Product #${product.id}`))
  }

  // Get a single product (uncomment and replace ID)
  // const product = await conn.products.get(123)
  // console.log('Single product:', product)

  // Create a new product (uncomment to test)
  // const newProduct = await conn.products.create({ /* product data */ })
  // console.log('Created product:', newProduct)

  // Update a product (uncomment to test)
  // const updatedProduct = await conn.products.update(123, { /* updated data */ })
  // console.log('Updated product:', updatedProduct)

  // ===== SHIPPING ORDERS =====
  console.log('\n===== SHIPPING ORDERS =====')

  // List shipping orders with filters (updated_at_from is REQUIRED)
  console.log('\nFetching shipping orders...')
  for await (const page of conn.shippingOrders.list({
    updated_at_from: '2024-01-01T00:00:00Z',
    updated_at_to: '2025-12-31T23:59:59Z',
    cancelled: false,
    with_items: true,
    with_payments: true,
    pageSize: 10,
    maxItems: 20
  })) {
    console.log(`Page with ${page.length} shipping orders`)
    page.forEach(order => console.log(`  - Order ${order.invoice_number} (ID: ${order.id}, Status: ${order.payment_status})`))
  }

  // Get a single shipping order with additional details (uncomment and replace ID)
  // const shippingOrder = await conn.shippingOrders.get(123, {
  //   with_history: true,
  //   with_deal_flow: true
  // })
  // console.log('Single shipping order:', shippingOrder)
}

main().catch(console.error)

