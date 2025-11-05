# Aircraft

Real-time aircraft tracking data from ADS-B (Automatic Dependent Surveillance-Broadcast) transponders.

## Description

This endpoint returns data for all currently tracked aircraft. The data includes position, altitude, speed, heading, and various other telemetry from aircraft transponders.

## Common Use Cases

### Track all aircraft
Get all currently visible aircraft:
```typescript
for await (const page of conn.aircraft.list()) {
  page.forEach(aircraft => {
    console.log(`${aircraft.flight}: ${aircraft.lat},${aircraft.lon} at ${aircraft.alt_baro}ft`)
  })
}
```

### Filter by type
```typescript
// Military aircraft only
for await (const page of conn.aircraft.list({ military: true })) {
  // ...
}

// Interesting aircraft (special aircraft of note)
for await (const page of conn.aircraft.list({ interesting: true })) {
  // ...
}
```

### Get specific aircraft
```typescript
const aircraft = await conn.aircraft.get('A1B2C3')
if (aircraft) {
  console.log(`Aircraft ${aircraft.icao}: ${aircraft.flight}`)
}
```

## API Endpoints

- `GET /api/data/aircraft` - Get all currently tracked aircraft
- `GET /api/data/aircraft/{icao}` - Get specific aircraft by ICAO hex code

## Data Freshness

The `seen` and `seen_pos` fields indicate how recently data was received:
- `seen`: Seconds since any message was received
- `seen_pos`: Seconds since position was updated

Aircraft typically disappear from the feed after ~60 seconds without updates.

## Coordinate System

- Latitude/Longitude: WGS84 decimal degrees
- Altitude: Feet above mean sea level
- Speed: Knots
- Heading/Track: Degrees (0-360, with 0 = North)
