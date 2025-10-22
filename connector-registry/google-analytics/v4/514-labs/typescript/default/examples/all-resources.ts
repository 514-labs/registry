import { createConnector } from '../src'
import { getServiceAccountAccessToken } from '../src/lib/jwt-auth'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  console.log('=== Google Analytics GA4 Connector - All Resources Demo ===\n')

  // Initialize connector
  const conn = createConnector()
  const accessToken = await getServiceAccountAccessToken({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    privateKey: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    scope: 'https://www.googleapis.com/auth/analytics.readonly'
  })

  conn.initialize({
    baseUrl: 'https://analyticsdata.googleapis.com/v1beta',
    auth: {
      type: 'bearer',
      bearer: { token: accessToken }
    },
    logging: { enabled: true, level: 'info' }
  })

  const propertyId = process.env.GOOGLE_PROPERTY_ID!
  console.log(`Property ID: ${propertyId}\n`)

  // ===== 1. Standard Report =====
  console.log('📊 1. Running Standard Report...')
  try {
    const report = await conn.reports.runReport(propertyId, {
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
      limit: 5
    })
    console.log(`   ✓ Report rows: ${report.rowCount || 0}`)
    console.log(`   ✓ Dimensions: ${report.dimensionHeaders?.map(h => h.name).join(', ')}`)
    console.log(`   ✓ Metrics: ${report.metricHeaders?.map(h => h.name).join(', ')}\n`)
  } catch (error: any) {
    console.log(`   ✗ Error: ${error.message}\n`)
  }

  // ===== 2. Batch Reports =====
  console.log('📊 2. Running Batch Reports...')
  try {
    const batchResponse = await conn.reports.batchRunReports(propertyId, {
      requests: [
        {
          dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
          metrics: [{ name: 'activeUsers' }],
          limit: 1
        },
        {
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          metrics: [{ name: 'sessions' }],
          limit: 1
        }
      ]
    })
    console.log(`   ✓ Number of reports returned: ${batchResponse.reports?.length || 0}\n`)
  } catch (error: any) {
    console.log(`   ✗ Error: ${error.message}\n`)
  }

  // ===== 3. Pivot Report =====
  console.log('📊 3. Running Pivot Report...')
  try {
    const pivotReport = await conn.reports.runPivotReport(propertyId, {
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'country' }, { name: 'deviceCategory' }],
      metrics: [{ name: 'activeUsers' }],
      pivots: [
        {
          fieldNames: ['deviceCategory'],
          limit: 3
        }
      ]
    })
    console.log(`   ✓ Pivot headers: ${pivotReport.pivotHeaders?.length || 0}`)
    console.log(`   ✓ Rows: ${pivotReport.rows?.length || 0}\n`)
  } catch (error: any) {
    console.log(`   ✗ Error: ${error.message}\n`)
  }

  // ===== 4. Realtime Report =====
  console.log('⚡ 4. Running Realtime Report...')
  try {
    const realtimeReport = await conn.realtime.runRealtimeReport(propertyId, {
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }],
      limit: 5
    })
    console.log(`   ✓ Active users now: ${realtimeReport.rowCount || 0} rows`)
    console.log(`   ✓ Dimensions: ${realtimeReport.dimensionHeaders?.map(h => h.name).join(', ')}\n`)
  } catch (error: any) {
    console.log(`   ✗ Error: ${error.message}\n`)
  }

  // ===== 5. Get Metadata =====
  console.log('📖 5. Getting Metadata...')
  try {
    const metadata = await conn.metadata.getMetadata(propertyId)
    console.log(`   ✓ Available dimensions: ${metadata.dimensions?.length || 0}`)
    console.log(`   ✓ Available metrics: ${metadata.metrics?.length || 0}`)

    // Show first 3 dimensions
    if (metadata.dimensions && metadata.dimensions.length > 0) {
      console.log('   ✓ Sample dimensions:')
      metadata.dimensions.slice(0, 3).forEach(dim => {
        console.log(`      - ${dim.apiName}: ${dim.uiName}`)
      })
    }
    console.log()
  } catch (error: any) {
    console.log(`   ✗ Error: ${error.message}\n`)
  }

  // ===== 6. Check Compatibility =====
  console.log('🔍 6. Checking Compatibility...')
  try {
    const compatibility = await conn.metadata.checkCompatibility(propertyId, {
      dimensions: [{ name: 'date' }, { name: 'country' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
      compatibilityFilter: 'COMPATIBLE'
    })
    console.log(`   ✓ Compatible dimensions: ${compatibility.dimensionCompatibilities?.length || 0}`)
    console.log(`   ✓ Compatible metrics: ${compatibility.metricCompatibilities?.length || 0}\n`)
  } catch (error: any) {
    console.log(`   ✗ Error: ${error.message}\n`)
  }

  // ===== 7. Audience Exports (optional, requires audiences setup) =====
  console.log('👥 7. Listing Audience Exports...')
  try {
    const exports = await conn.audienceExports.list(propertyId, 10)
    console.log(`   ✓ Total audience exports: ${exports.audienceExports?.length || 0}`)

    if (exports.audienceExports && exports.audienceExports.length > 0) {
      exports.audienceExports.forEach(exp => {
        console.log(`      - ${exp.name}: ${exp.state} (${exp.rowCount || 0} rows)`)
      })
    }
    console.log()
  } catch (error: any) {
    console.log(`   ✗ Error: ${error.message}`)
    console.log(`   (This is expected if you don't have any audiences configured)\n`)
  }

  console.log('✅ Demo completed!')
  console.log('\n=== Summary ===')
  console.log('Available Resources:')
  console.log('  • conn.reports.runReport() - Standard reports')
  console.log('  • conn.reports.runPivotReport() - Pivot/cross-tab reports')
  console.log('  • conn.reports.batchRunReports() - Multiple reports in one call')
  console.log('  • conn.reports.batchRunPivotReports() - Multiple pivot reports')
  console.log('  • conn.realtime.runRealtimeReport() - Last 30 minutes data')
  console.log('  • conn.metadata.getMetadata() - Available dimensions/metrics')
  console.log('  • conn.metadata.checkCompatibility() - Check field compatibility')
  console.log('  • conn.audienceExports.create() - Create audience export')
  console.log('  • conn.audienceExports.list() - List audience exports')
  console.log('  • conn.audienceExports.get() - Get audience export')
  console.log('  • conn.audienceExports.query() - Query audience data')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
