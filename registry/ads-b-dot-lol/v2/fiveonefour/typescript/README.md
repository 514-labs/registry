# ADS-B.lol Connector

TypeScript connector for [ADS-B.lol API](https://api.adsb.lol/docs) - real-time aircraft tracking data.

## API Coverage

### Implemented Endpoints

**Aircraft Filtering** (v2)
- `GET /v2/icao/{icao_hex}` - Track specific aircraft by ICAO hex
- `GET /v2/callsign/{callsign}` - Track aircraft by callsign
- `GET /v2/reg/{registration}` - Track aircraft by registration
- `GET /v2/type/{aircraft_type}` - Aircraft by type code (e.g., B738, A320)
- `GET /v2/sqk/{squawk}` - Aircraft by squawk code
- `GET /v2/mil` - Military aircraft only
- `GET /v2/ladd` - Aircraft on FAA LADD (privacy) list
- `GET /v2/pia` - Aircraft with privacy ICAO addresses

**Geospatial Queries** (v2)
- `GET /v2/lat/{lat}/lon/{lon}/dist/{radius}` - Aircraft within radius
- `GET /v2/closest/{lat}/{lon}/{radius}` - Find closest aircraft to a point

### Not Implemented

**Legacy Endpoints** (v0)
- `GET /api/0/airport/{icao}` - Airport information (not aircraft tracking)
- `POST /api/0/routeset` - Batch route lookups (requires POST body handling)
- `GET /0/me` - Receiver stats (metadata, not aircraft data)
- `GET /0/my` - Map redirect (returns HTML, not data)

These legacy endpoints are excluded because they either:
1. Don't return aircraft data (airport info, receiver stats)
2. Return HTML instead of JSON (map redirect)
3. Use older API patterns that may be deprecated

## Response Schemas

### Aircraft Response
All v2 endpoints return the same response structure:

```typescript
interface AircraftResponse {
  ac: Aircraft[];       // Array of aircraft
  total: number;        // Total aircraft in response
  ctime: number;        // Cache timestamp
  ptime: number;        // Processing timestamp
}

interface Aircraft {
  hex: string;          // ICAO hex identifier
  type: string;         // Aircraft type code
  flight: string;       // Callsign
  r: string;           // Registration
  t: string;           // Aircraft type description
  alt_baro: number;    // Barometric altitude (feet)
  alt_geom: number;    // Geometric altitude (feet)  
  gs: number;          // Ground speed (knots)
  track: number;       // Track angle (degrees)
  baro_rate: number;   // Barometric vertical rate (feet/min)
  squawk: string;      // Transponder code
  emergency: string;   // Emergency status
  category: string;    // Aircraft category
  nav_qnh: number;     // QNH setting (mb)
  nav_altitude_mcp: number;  // Selected altitude (feet)
  lat: number;         // Latitude
  lon: number;         // Longitude
  nic: number;         // Navigation Integrity Category
  rc: number;          // Radius of Containment (meters)
  seen_pos: number;    // Time since last position (seconds)
  version: number;     // ADS-B version
  nac_p: number;       // Navigation Accuracy Category - Position
  nac_v: number;       // Navigation Accuracy Category - Velocity
  sil: number;         // Source Integrity Level
  sil_type: string;    // SIL supplement type
  alert: number;       // Alert status
  spi: number;         // Special Position Identification
  mlat: number[];      // MLAT receiver IDs
  tisb: number[];      // TIS-B receiver IDs
  messages: number;    // Total messages received
  seen: number;        // Time since last message (seconds)
  rssi: number;        // Signal strength (dBFS)
}
```

### Error Response
```typescript
interface ErrorResponse {
  error: string;
  code: number;
  details?: string;
}
```

## Usage Examples

```typescript
import { AdsbConnector } from './index';

const adsb = new AdsbConnector();
await adsb.initialize();
await adsb.connect();

// Find aircraft near San Francisco Airport
const nearby = await adsb.findNearby(37.7749, -122.4194, 50);
console.log(`Found ${nearby.length} aircraft within 50km`);

// Track specific aircraft
const aircraft = await adsb.trackByRegistration('N12345');
const united = await adsb.trackByCallsign('UAL123');
const byHex = await adsb.trackByICAO('A12345');

// Find military aircraft
const military = await adsb.getMilitary();

// Find aircraft in emergency
const emergencies = await adsb.getEmergencies();  // Squawk 7700
const hijack = await adsb.getHijack();           // Squawk 7500

// Get aircraft by type
const boeing737s = await adsb.getByType('B738');

// Get closest aircraft to a location
const closest = await adsb.findClosest(40.7128, -74.0060, 100);

// Find aircraft by airline (searches by callsign prefix)
const deltaFlights = await adsb.getByAirline('DAL');
const unitedFlights = await adsb.getByAirline('UAL');

// Cancel long-running requests
const controller = new AbortController();
const promise = adsb.findNearby(37.7749, -122.4194, 1000, controller.signal);

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);

try {
  const aircraft = await promise;
} catch (error) {
  if (error.code === 'CANCELLED') {
    console.log('Request was cancelled');
  }
}
```