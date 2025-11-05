import { createConnector } from '../src'

async function main() {
  const conn = createConnector()
  conn.init({
    // No authentication required!
    baseUrl: 'https://api.adsb.lol',
    logging: { enabled: true, level: 'info' },
  })

  console.log('ADS-B.lol Connector initialized\n')

  // Example 1: List all aircraft (paginated)
  console.log('Example 1: Listing first 10 aircraft...')
  let count = 0
  for await (const page of conn.aircraft.list({ pageSize: 10, maxItems: 10 })) {
    page.forEach(aircraft => {
      count++
      const position = aircraft.lat && aircraft.lon 
        ? `${aircraft.lat.toFixed(4)},${aircraft.lon.toFixed(4)}` 
        : 'N/A'
      const altitude = aircraft.alt_baro ? `${aircraft.alt_baro}ft` : 'N/A'
      console.log(`  ${count}. ${aircraft.flight || aircraft.icao}: ${position} @ ${altitude}`)
    })
  }
  console.log()

  // Example 2: Get a specific aircraft (if you know the ICAO code)
  console.log('Example 2: Getting specific aircraft...')
  try {
    // Note: Replace with a valid ICAO code from the list above
    const aircraft = await conn.aircraft.get('A1B2C3')
    if (aircraft) {
      console.log('  Found aircraft:', aircraft)
    } else {
      console.log('  Aircraft not currently tracked')
    }
  } catch (error) {
    console.log('  Error or aircraft not found')
  }
  console.log()

  // Example 3: Filter for military aircraft
  console.log('Example 3: Listing military aircraft...')
  let militaryCount = 0
  for await (const page of conn.aircraft.list({ military: true, pageSize: 5, maxItems: 5 })) {
    page.forEach(aircraft => {
      militaryCount++
      console.log(`  Military ${militaryCount}: ${aircraft.flight || aircraft.icao}`)
    })
  }
  if (militaryCount === 0) {
    console.log('  No military aircraft currently tracked')
  }

  console.log('\nDone!')
}

main().catch(console.error)
