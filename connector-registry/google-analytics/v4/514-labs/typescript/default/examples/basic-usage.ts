import { createConnector } from '../src'
import { getServiceAccountAccessToken } from '../src/lib/jwt-auth'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

async function main() {
  console.log('Initializing Google Analytics GA4 Connector...')

  const conn = createConnector()

  // Choose your authentication method based on environment variables

  // Method 1: Service Account (Recommended)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    console.log('Using Service Account authentication')

    // Generate access token from service account credentials
    console.log('Generating access token...')
    const accessToken = await getServiceAccountAccessToken({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scope: 'https://www.googleapis.com/auth/analytics.readonly'
    })
    console.log('Access token generated successfully')

    conn.initialize({
      baseUrl: 'https://analyticsdata.googleapis.com/v1beta',
      auth: {
        type: 'bearer',
        bearer: {
          token: accessToken
        }
      },
      logging: { enabled: true, level: 'info' },
      metrics: { enabled: true }
    })
  }
  // Method 2: OAuth 2.0 with Refresh Token
  else if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
    console.log('Using OAuth 2.0 authentication')
    conn.initialize({
      baseUrl: 'https://analyticsdata.googleapis.com/v1beta',
      auth: {
        type: 'oauth2',
        oauth2: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
          tokenUrl: 'https://oauth2.googleapis.com/token'
        }
      },
      logging: { enabled: true, level: 'info' },
      metrics: { enabled: true }
    })
  }
  // Method 3: Bearer Token (if you have a pre-generated token)
  else if (process.env.GOOGLE_ACCESS_TOKEN) {
    console.log('Using Bearer Token authentication')
    conn.initialize({
      baseUrl: 'https://analyticsdata.googleapis.com/v1beta',
      auth: {
        type: 'bearer',
        bearer: {
          token: process.env.GOOGLE_ACCESS_TOKEN
        }
      },
      logging: { enabled: true, level: 'info' },
      metrics: { enabled: true }
    })
  } else {
    console.error('No authentication credentials found in environment variables.')
    console.error('Please set up your .env file with one of the following:')
    console.error('  - GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY')
    console.error('  - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN')
    console.error('  - GOOGLE_ACCESS_TOKEN (pre-generated bearer token)')
    process.exit(1)
  }

  console.log('Connector initialized successfully!')

  const propertyId = process.env.GOOGLE_PROPERTY_ID
  if (!propertyId) {
    console.error('GOOGLE_PROPERTY_ID is required. Please set it in your .env file.')
    process.exit(1)
  }

  console.log(`Property ID: ${propertyId}`)

  // Example: Run a GA4 report
  console.log('\nFetching GA4 report data...')

  try {
    // Request report data for the last 7 days
    const report = await conn.reports.runReport(propertyId, {
      dateRanges: [
        {
          startDate: '7daysAgo',
          endDate: 'today'
        }
      ],
      dimensions: [
        { name: 'date' },
        { name: 'country' }
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' }
      ],
      limit: 10
    })

    console.log('\n✅ Report fetched successfully!')
    console.log('\nReport Metadata:')
    console.log(`  Currency: ${report.metadata?.currencyCode || 'N/A'}`)
    console.log(`  Timezone: ${report.metadata?.timeZone || 'N/A'}`)
    console.log(`  Total rows: ${report.rowCount || 0}`)

    if (report.dimensionHeaders && report.metricHeaders) {
      console.log('\nDimensions:')
      report.dimensionHeaders.forEach(h => console.log(`  - ${h.name}`))

      console.log('\nMetrics:')
      report.metricHeaders.forEach(h => console.log(`  - ${h.name} (${h.type})`))
    }

    if (report.rows && report.rows.length > 0) {
      console.log('\nSample Data (first 5 rows):')
      report.rows.slice(0, 5).forEach((row, idx) => {
        console.log(`\nRow ${idx + 1}:`)
        row.dimensionValues?.forEach((dim, i) => {
          const header = report.dimensionHeaders?.[i]?.name || `dim${i}`
          console.log(`  ${header}: ${dim.value || dim.oneValue}`)
        })
        row.metricValues?.forEach((metric, i) => {
          const header = report.metricHeaders?.[i]?.name || `metric${i}`
          console.log(`  ${header}: ${metric.value || metric.oneValue}`)
        })
      })
    } else {
      console.log('\nNo data returned for this date range.')
    }

  } catch (error) {
    console.error('\n❌ Error fetching reports:', error)

    if (error instanceof Error) {
      console.error('\nError details:')
      console.error(`  Message: ${error.message}`)
      if ('statusCode' in error) {
        console.error(`  Status Code: ${(error as any).statusCode}`)
      }
      if ('code' in error) {
        console.error(`  Code: ${(error as any).code}`)
      }
    }

    console.error('\nTroubleshooting tips:')
    console.error('  1. Verify your property ID is correct')
    console.error('  2. Ensure your service account has access to the GA4 property')
    console.error('  3. Check that the Google Analytics Data API is enabled')
    console.error('  4. Verify your credentials are correctly formatted in .env')

    process.exit(1)
  }

  console.log('\n✅ Example completed successfully!')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
