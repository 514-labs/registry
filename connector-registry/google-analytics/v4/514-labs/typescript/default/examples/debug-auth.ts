import { createConnector } from '../src'
import { getServiceAccountAccessToken } from '../src/lib/jwt-auth'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function debugAuth() {
  console.log('=== Google Analytics Auth Debug ===\n')

  const conn = createConnector()

  // Generate access token
  console.log('Generating access token...')
  const accessToken = await getServiceAccountAccessToken({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    privateKey: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    scope: 'https://www.googleapis.com/auth/analytics.readonly'
  })
  console.log('✅ Token generated\n')

  // Initialize with debug logging
  conn.initialize({
    baseUrl: 'https://analyticsdata.googleapis.com/v1beta',
    auth: {
      type: 'bearer',
      bearer: {
        token: accessToken
      }
    },
    logging: { enabled: true, level: 'debug', includeBody: true, includeHeaders: true }
  })

  console.log('Credentials loaded:')
  console.log('  Email configured:', !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)
  console.log('  Property ID configured:', !!process.env.GOOGLE_PROPERTY_ID)
  console.log('  Private Key length:', process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').length)
  console.log('  Private Key format check:', process.env.GOOGLE_PRIVATE_KEY?.includes('BEGIN PRIVATE KEY'))
  console.log('')

  try {
    const propertyId = process.env.GOOGLE_PROPERTY_ID!

    console.log('Making API request...\n')
    const report = await conn.reports.runReport(propertyId, {
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }],
      limit: 1
    })

    console.log('\n✅ SUCCESS! Report data:', JSON.stringify(report, null, 2))
  } catch (error: any) {
    console.log('\n❌ ERROR CAUGHT:')
    console.log('  Message:', error.message)
    console.log('  Code:', error.code)
    console.log('  Status:', error.statusCode)
    console.log('  Details:', JSON.stringify(error.details, null, 2))
    console.log('  Full error:', JSON.stringify(error, null, 2))
  }
}

debugAuth()
