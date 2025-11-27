import { createConnector } from '../src'

async function main() {
  const connector = createConnector()
  
  connector.init({
    shopName: process.env.SHOPIFY_SHOP_NAME || 'your-shop-name',
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN || 'your-access-token',
    apiVersion: process.env.SHOPIFY_API_VERSION || '2024-10',
    logging: {
      enabled: true,
      level: 'info',
    },
  })

  console.log('Shopify Connector initialized')

  // Example: List products
  console.log('\n--- Listing Products ---')
  let productCount = 0
  for await (const page of connector.products.list({ pageSize: 10, maxItems: 20 })) {
    console.log(`Fetched ${page.length} products`)
    for (const product of page) {
      console.log(`  - ${product.title} (${product.id})`)
      productCount++
    }
  }
  console.log(`Total products fetched: ${productCount}`)

  // Example: Get a single product (uncomment and add a valid ID)
  // const product = await connector.products.get(123456789)
  // console.log('\n--- Single Product ---')
  // console.log(product)

  // Example: List orders
  console.log('\n--- Listing Orders ---')
  let orderCount = 0
  for await (const page of connector.orders.list({ pageSize: 5, maxItems: 10 })) {
    console.log(`Fetched ${page.length} orders`)
    for (const order of page) {
      console.log(`  - Order ${order.name}: ${order.email}`)
      orderCount++
    }
  }
  console.log(`Total orders fetched: ${orderCount}`)

  // Example: List customers
  console.log('\n--- Listing Customers ---')
  let customerCount = 0
  for await (const page of connector.customers.list({ pageSize: 5, maxItems: 10 })) {
    console.log(`Fetched ${page.length} customers`)
    for (const customer of page) {
      console.log(`  - ${customer.first_name} ${customer.last_name}: ${customer.email}`)
      customerCount++
    }
  }
  console.log(`Total customers fetched: ${customerCount}`)

  console.log('\nDone!')
}

main().catch(console.error)
