import { createConnector } from '../src'

// Example 1: Basic OAuth2 authentication
const conn = createConnector()
conn.initialize({
  baseUrl: 'https://googleads.googleapis.com/v16',
  auth: {
    type: 'bearer',
    bearer: { token: 'YOUR_ACCESS_TOKEN' }
  },
  logging: {
    enabled: true,
    level: 'info',
    includeQueryParams: true,
  },
  metrics: {
    enabled: true
  },
  validation: {
    enabled: true,
    strict: false
  }
})

console.log('Google Ads Connector initialized')

// Example 2: Fetch all campaigns
async function fetchCampaigns() {
  console.log('\n=== Fetching Campaigns ===')
  for await (const page of conn.campaigns.getAll({
    params: {
      customerId: '1234567890',
      status: 'ENABLED'
    },
    paging: {
      pageSize: 100,
      maxItems: 500
    }
  })) {
    console.log(`Received ${page.length} campaigns`)
    page.forEach(campaign => {
      console.log(`  - ${campaign.name} (${campaign.id})`)
    })
  }
}

// Example 3: Fetch ad groups for a specific campaign
async function fetchAdGroups(campaignId: string) {
  console.log('\n=== Fetching Ad Groups ===')
  for await (const page of conn.adGroups.getAll({
    params: {
      customerId: '1234567890',
      campaignId: campaignId,
      status: 'ENABLED'
    },
    paging: {
      pageSize: 50
    }
  })) {
    console.log(`Received ${page.length} ad groups`)
    page.forEach(adGroup => {
      console.log(`  - ${adGroup.name} (${adGroup.id})`)
    })
  }
}

// Example 4: Fetch keywords for an ad group
async function fetchKeywords(adGroupId: string) {
  console.log('\n=== Fetching Keywords ===')
  for await (const page of conn.keywords.getAll({
    params: {
      customerId: '1234567890',
      adGroupId: adGroupId
    }
  })) {
    console.log(`Received ${page.length} keywords`)
    page.forEach(keyword => {
      console.log(`  - ${keyword.text} (${keyword.matchType})`)
    })
  }
}

// Example 5: Fetch all ads
async function fetchAds() {
  console.log('\n=== Fetching Ads ===')
  for await (const page of conn.ads.getAll({
    params: {
      customerId: '1234567890',
      status: 'ENABLED'
    }
  })) {
    console.log(`Received ${page.length} ads`)
    page.forEach(ad => {
      console.log(`  - Ad ${ad.id} (${ad.type})`)
    })
  }
}

// Example 6: Fetch customer accounts
async function fetchCustomers() {
  console.log('\n=== Fetching Customers ===')
  for await (const page of conn.customers.getAll()) {
    console.log(`Received ${page.length} customers`)
    page.forEach(customer => {
      console.log(`  - ${customer.descriptiveName} (${customer.id})`)
    })
  }
}

// Run examples (commented out to prevent actual API calls)
// fetchCampaigns().catch(console.error)
// fetchAdGroups('CAMPAIGN_ID').catch(console.error)
// fetchKeywords('AD_GROUP_ID').catch(console.error)
// fetchAds().catch(console.error)
// fetchCustomers().catch(console.error)
