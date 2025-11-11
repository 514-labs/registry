import { createConnector } from '../src'

async function main() {
  const connector = createConnector()

  // Initialize the connector with your API credentials
  connector.initialize({
    apiKey: process.env.APEX_API_KEY!,
    apiSecret: process.env.APEX_API_SECRET,
    apiPassphrase: process.env.APEX_API_PASSPHRASE,
    environment: 'production', // or 'testnet'
    logging: { enabled: true, level: 'info' },
    metrics: { enabled: true },
  })

  console.log('Apex Trading Connector - Basic Usage Examples\n')

  // Example 1: List products
  console.log('1. Listing products...')
  let count = 0
  for await (const page of connector.products.list({ pageSize: 10, maxItems: 10 })) {
    console.log(`   Found ${page.length} products:`)
    page.forEach(product => {
      console.log(`   - ${product.symbol}: ${product.baseAsset}/${product.quoteAsset}`)
    })
    count += page.length
  }
  console.log(`   Total products listed: ${count}\n`)

  // Example 2: Get ticker for a specific symbol
  console.log('2. Getting ticker for BTC-USDT...')
  try {
    const ticker = await connector.products.getTicker('BTC-USDT')
    console.log(`   Last Price: ${ticker.lastPrice}`)
    console.log(`   24h Change: ${ticker.priceChangePercent}%`)
    console.log(`   24h Volume: ${ticker.volume}\n`)
  } catch (error) {
    console.log('   Error getting ticker (may need valid symbol):', (error as Error).message, '\n')
  }

  // Example 3: Get account balance
  console.log('3. Getting account balance...')
  try {
    const balance = await connector.accounts.getBalance()
    console.log(`   Balance: ${balance.balance}`)
    console.log(`   Available: ${balance.availableBalance}`)
    console.log(`   Locked: ${balance.lockedBalance}\n`)
  } catch (error) {
    console.log('   Error getting balance (requires authentication):', (error as Error).message, '\n')
  }

  // Example 4: List orders
  console.log('4. Listing orders...')
  try {
    let orderCount = 0
    for await (const page of connector.orders.list({ pageSize: 10, maxItems: 10 })) {
      console.log(`   Found ${page.length} orders`)
      page.forEach(order => {
        console.log(`   - ${order.symbol} ${order.side} ${order.type}: ${order.status}`)
      })
      orderCount += page.length
    }
    console.log(`   Total orders: ${orderCount}\n`)
  } catch (error) {
    console.log('   Error listing orders (requires authentication):', (error as Error).message, '\n')
  }

  // Example 5: List trades
  console.log('5. Listing recent trades...')
  try {
    let tradeCount = 0
    for await (const page of connector.trades.list({ pageSize: 10, maxItems: 10 })) {
      console.log(`   Found ${page.length} trades`)
      tradeCount += page.length
    }
    console.log(`   Total trades: ${tradeCount}\n`)
  } catch (error) {
    console.log('   Error listing trades (requires authentication):', (error as Error).message, '\n')
  }

  console.log('Done!')
}

main().catch(console.error)

