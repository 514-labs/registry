import { createConnector } from '../src'

async function main() {
  const connector = createConnector()

  // Initialize the connector with your API key
  connector.initialize({
    apiKey: process.env.APEX_API_KEY!,
    logging: { enabled: true, level: 'info' },
    metrics: { enabled: true },
  })

  console.log('Apex Trading Connector - Wholesale Cannabis Platform\n')

  // Example 1: List products with incremental sync
  console.log('1. Listing products (incremental sync)...')
  try {
    let count = 0
    for await (const page of connector.products.list({ 
      pageSize: 10, 
      maxItems: 10,
      updated_at_from: '2024-01-01T00:00:00Z' // Get products updated since this date
    })) {
      console.log(`   Found ${page.length} products:`)
      page.forEach(product => {
        console.log(`   - ${product.name} (${product.category || 'No category'})`)
      })
      count += page.length
    }
    console.log(`   Total products listed: ${count}\n`)
  } catch (error) {
    console.log('   Error listing products:', (error as Error).message, '\n')
  }

  // Example 2: List batches
  console.log('2. Listing batches...')
  try {
    let batchCount = 0
    for await (const page of connector.batches.list({ pageSize: 10, maxItems: 10 })) {
      console.log(`   Found ${page.length} batches`)
      page.forEach(batch => {
        console.log(`   - Batch ${batch.batch_number}: ${batch.quantity} units`)
      })
      batchCount += page.length
    }
    console.log(`   Total batches: ${batchCount}\n`)
  } catch (error) {
    console.log('   Error listing batches:', (error as Error).message, '\n')
  }

  // Example 3: List receiving orders
  console.log('3. Listing receiving orders...')
  try {
    let orderCount = 0
    for await (const page of connector.orders.receiving({ 
      pageSize: 10, 
      maxItems: 10,
      status: 'confirmed'
    })) {
      console.log(`   Found ${page.length} orders`)
      page.forEach(order => {
        console.log(`   - Order ${order.order_number}: ${order.status}`)
      })
      orderCount += page.length
    }
    console.log(`   Total orders: ${orderCount}\n`)
  } catch (error) {
    console.log('   Error listing orders:', (error as Error).message, '\n')
  }

  // Example 4: List companies
  console.log('4. Listing companies...')
  try {
    let companyCount = 0
    for await (const page of connector.companies.list({ pageSize: 10, maxItems: 10 })) {
      console.log(`   Found ${page.length} companies`)
      page.forEach(company => {
        console.log(`   - ${company.name} (${company.type})`)
      })
      companyCount += page.length
    }
    console.log(`   Total companies: ${companyCount}\n`)
  } catch (error) {
    console.log('   Error listing companies:', (error as Error).message, '\n')
  }

  // Example 5: List buyers
  console.log('5. Listing buyers...')
  try {
    let buyerCount = 0
    for await (const page of connector.buyers.list({ pageSize: 10, maxItems: 10 })) {
      console.log(`   Found ${page.length} buyers`)
      buyerCount += page.length
    }
    console.log(`   Total buyers: ${buyerCount}\n`)
  } catch (error) {
    console.log('   Error listing buyers:', (error as Error).message, '\n')
  }

  console.log('Done!')
}

main().catch(console.error)

