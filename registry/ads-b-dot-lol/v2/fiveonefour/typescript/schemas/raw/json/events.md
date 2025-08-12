# ADS-B.lol Raw API Response Schemas

This directory contains the raw JSON schemas for data returned directly from the ADS-B.lol API endpoints.

## Aircraft Response Schema

The main response format returned by most ADS-B.lol endpoints:

```json
{
  "ac": [/* array of aircraft objects */],
  "total": 123,
  "ctime": 1691234567,
  "ptime": 1691234568
}
```

## Individual Aircraft Schema

Each aircraft object in the `ac` array contains real-time flight data:

```json
{
  "hex": "A12345",          // Required: ICAO hex ID
  "type": "B738",           // Aircraft type code
  "flight": "UAL123",       // Callsign
  "r": "N123AB",            // Registration
  "alt_baro": 35000,        // Barometric altitude (ft)
  "gs": 450,                // Ground speed (kts)
  "track": 090,             // Track angle (degrees)
  "lat": 34.0522,           // Latitude
  "lon": -118.2437,         // Longitude
  "squawk": "1200",         // Transponder code
  "seen": 2                 // Seconds since last update
}
```

## API Endpoints

These schemas apply to responses from:

- `/v2/icao/{hex}` - Aircraft by ICAO
- `/v2/callsign/{callsign}` - Aircraft by callsign  
- `/v2/mil` - Military aircraft
- `/v2/lat/{lat}/lon/{lon}/dist/{radius}` - Geographic search
- And all other v2 endpoints