/**
 * Basic usage example for woooo-test connector
 * This is a test connector - do not use in production
 */
import { createConnector } from '../src'

async function main() {
  console.log('Woooo Test Connector Example')
  console.log('=============================\n')

  // Create and initialize the connector
  const connector = createConnector()
  connector.init({
    apiKey: process.env.TEST_API_KEY || 'test-key',
  })

  console.log('✓ Connector initialized')

  // Test the connection
  const result = await connector.testConnection()
  console.log(`\n✓ Status: ${result.status}`)
  console.log(`✓ Message: ${result.message}`)

  console.log('\n⚠️  Remember: This is a test connector - do not use in production')
}

main().catch(console.error)
