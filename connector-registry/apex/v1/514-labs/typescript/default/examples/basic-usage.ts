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

  // Example: List batches
  console.log('\nFetching batches...')
  for await (const page of conn.batches.list({ pageSize: 10, maxItems: 20 })) {
    console.log(`Page with ${page.length} batches`)
    page.forEach(batch => console.log(`  - Batch #${batch.id}`))
  }

  // Example: Get a single batch
  // const batch = await conn.batches.get(123)
  // console.log('Batch:', batch)

  // Example: List brands
  console.log('\nFetching brands...')
  for await (const page of conn.brands.list({ pageSize: 5 })) {
    console.log(`Page with ${page.length} brands`)
    page.forEach(brand => console.log(`  - ${brand.name}`))
  }

  // Example: List buyers
  console.log('\nFetching buyers...')
  for await (const page of conn.buyers.list({ 
    updated_at_from: '2025-01-01T00:00:00Z',
    pageSize: 10,
    maxItems: 20 
  })) {
    console.log(`Page with ${page.length} buyers`)
    page.forEach(buyer => console.log(`  - ${buyer.name}`))
  }
}

main().catch(console.error)

