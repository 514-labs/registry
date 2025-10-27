import { createConnector } from '../src'

const conn = createConnector()
conn.initialize({
  baseUrl: 'https://api.example.com',
  auth: { type: 'bearer', bearer: { token: process.env.API_TOKEN || 'YOUR_TOKEN' } },
  logging: { enabled: true, level: 'info' },
})

console.log('Connector initialized')

// Example: Fetch all campaigns with pagination
async function main() {
  let totalItems = 0
  
  for await (const page of conn.campaigns.getAll({
    params: {
      // Add resource-specific filter params here
    },
    paging: {
      pageSize: 100,
      maxItems: 500,
    },
  })) {
    console.log(`Received page with ${page.length} items`)
    totalItems += page.length
    
    // Process each item in the page
    for (const item of page) {
      console.log(item)
    }
  }
  
  console.log(`Total items processed: $`)
}

main().catch(console.error)
