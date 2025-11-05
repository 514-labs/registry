# Getting Started

## Installation

```bash
pnpm install
```

## Basic Usage

```typescript
import { createConnector } from './src'

const conn = createConnector()
conn.init({
  // Optional: override base URL (defaults to https://api.adsb.lol)
  baseUrl: 'https://api.adsb.lol',
  // Optional: enable logging
  logging: { enabled: true, level: 'info' },
})

// List all currently tracked aircraft
for await (const page of conn.aircraft.list({ pageSize: 100 })) {
  page.forEach(aircraft => {
    if (aircraft.lat && aircraft.lon && aircraft.alt_baro) {
      console.log(`${aircraft.flight || aircraft.icao}: Position ${aircraft.lat},${aircraft.lon} at ${aircraft.alt_baro}ft`)
    }
  })
}
```

## Get Specific Aircraft

```typescript
// Get aircraft by ICAO hex code
const aircraft = await conn.aircraft.get('A1B2C3')
if (aircraft) {
  console.log('Aircraft found:', aircraft)
} else {
  console.log('Aircraft not currently tracked')
}
```

## Filtering

```typescript
// Get only military aircraft
for await (const page of conn.aircraft.list({ military: true })) {
  console.log(`Found ${page.length} military aircraft`)
}

// Get interesting/special aircraft
for await (const page of conn.aircraft.list({ interesting: true })) {
  console.log(`Found ${page.length} interesting aircraft`)
}
```

## Pagination

```typescript
// Paginate through results client-side
for await (const page of conn.aircraft.list({ 
  pageSize: 50,  // Process 50 aircraft at a time
  maxItems: 200  // Stop after 200 aircraft
})) {
  console.log(`Processing ${page.length} aircraft`)
}
```

## With Logging

```typescript
const conn = createConnector()
conn.init({
  logging: {
    enabled: true,
    level: 'info',
    includeQueryParams: true,
    includeHeaders: false,
    includeBody: false,
  },
})

// Logging will output request/response information
for await (const page of conn.aircraft.list({ pageSize: 10 })) {
  // Process aircraft...
}
```

## Error Handling

```typescript
try {
  const aircraft = await conn.aircraft.get('INVALID')
  console.log(aircraft)
} catch (error) {
  console.error('Error fetching aircraft:', error)
}
```

## No Authentication Required

The ADS-B.lol API is completely open and requires no authentication. Simply initialize the connector and start making requests!
