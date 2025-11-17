/**
 * Klaviyo Connector - Basic Usage Example
 * 
 * This example demonstrates how to use the Klaviyo connector to:
 * - Initialize the connector with your API key
 * - List profiles (customers/contacts)
 * - Get a specific profile
 * - List campaigns
 * - List lists (audience segments)
 */
import { createConnector } from '../src'

async function main() {
  // Initialize the connector
  const conn = createConnector()
  conn.init({
    apiKey: process.env.KLAVIYO_API_KEY || 'YOUR_API_KEY',
    logging: {
      enabled: true,
      level: 'info',
    },
  })

  console.log('Klaviyo connector initialized\n')

  // Example 1: List profiles (with pagination)
  console.log('=== Example 1: List Profiles ===')
  let profileCount = 0
  for await (const page of conn.profiles.list({ pageSize: 10, maxItems: 20 })) {
    for (const profile of page) {
      profileCount++
      console.log(`- ${profile.attributes.email || profile.id}`)
    }
  }
  console.log(`Total profiles fetched: ${profileCount}\n`)

  // Example 2: Get a specific profile (replace with real ID)
  // console.log('=== Example 2: Get Profile ===')
  // const profile = await conn.profiles.get('PROFILE_ID_HERE')
  // console.log(profile.attributes)

  // Example 3: List campaigns
  console.log('=== Example 3: List Campaigns ===')
  let campaignCount = 0
  for await (const page of conn.campaigns.list({ pageSize: 10, maxItems: 10 })) {
    for (const campaign of page) {
      campaignCount++
      console.log(`- ${campaign.attributes.name} (${campaign.attributes.status})`)
    }
  }
  console.log(`Total campaigns fetched: ${campaignCount}\n`)

  // Example 4: List lists (audience segments)
  console.log('=== Example 4: List Lists ===')
  let listCount = 0
  for await (const page of conn.lists.list({ pageSize: 10, maxItems: 10 })) {
    for (const list of page) {
      listCount++
      console.log(`- ${list.attributes.name}`)
    }
  }
  console.log(`Total lists fetched: ${listCount}\n`)

  // Example 5: Filter profiles by email
  console.log('=== Example 5: Filter Profiles by Email ===')
  // Uncomment and replace with a real email to test
  // for await (const page of conn.profiles.list({
  //   'filter[email]': 'user@example.com',
  // })) {
  //   for (const profile of page) {
  //     console.log(`Found: ${profile.attributes.email}`)
  //   }
  // }
}

// Run the example
if (require.main === module) {
  main().catch(console.error)
}

