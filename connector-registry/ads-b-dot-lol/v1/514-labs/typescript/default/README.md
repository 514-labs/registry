# ADS-B.lol Connector (TypeScript)

TypeScript connector for real-time aircraft tracking data from [ADSB.lol](https://api.adsb.lol/docs).

## Features

- 🛩️ Real-time aircraft position tracking
- 📡 ADS-B transponder data
- 🌍 Global coverage
- 🆓 Free, open-access API
- 📊 Comprehensive telemetry data

## Installation

```bash
pnpm install
```

## Quick Start

```typescript
import { createConnector } from './src'

const conn = createConnector()
conn.init() // No authentication required

// Get all currently tracked aircraft
for await (const page of conn.aircraft.list({ pageSize: 100 })) {
  page.forEach(aircraft => {
    console.log(`${aircraft.flight}: ${aircraft.lat},${aircraft.lon} at ${aircraft.alt_baro}ft`)
  })
}

// Get specific aircraft by ICAO hex code
const aircraft = await conn.aircraft.get('A1B2C3')
if (aircraft) {
  console.log(`Found: ${aircraft.flight}`)
}
```

## Available Data

Each aircraft object includes:
- **Position**: Latitude, longitude, altitude (barometric & GPS)
- **Movement**: Ground speed, track, heading, vertical rate
- **Identity**: ICAO address, registration, type, flight number/callsign
- **Transponder**: Squawk code, emergency status, category
- **Navigation**: Selected altitude, heading, QNH, active modes
- **Signal**: Messages received, RSSI, last seen timestamps

## API Information

- **Base URL**: `https://api.adsb.lol`
- **Authentication**: None required
- **Rate Limits**: None (as of current documentation)
- **Data License**: [Open Database License (ODbL) 1.0](https://opendatacommons.org/licenses/odbl/1.0/)

## Documentation

- [Getting Started](docs/getting-started.md)
- [Configuration](docs/configuration.md)
- [Schema Documentation](docs/schema.md)
- [API Limits](docs/limits.md)

## Schemas

See `schemas/index.json` for machine-readable definitions and accompanying Markdown docs.

## Testing

```bash
pnpm test
```

## Building

```bash
pnpm run build
```

## License

MIT
