# ADS-B Raw Relational Schema

This directory contains SQL table definitions for storing ADS-B.lol data in a relational database.

## Tables

### aircraft
Primary table storing real-time aircraft position and flight data.

- **Primary Key**: `hex` (ICAO identifier)
- **Indexes**: registration, location (lat/lon), callsign
- **Update Pattern**: UPSERT on hex, update all fields

### aircraft_snapshots
Historical snapshots linking aircraft to specific API responses.

- **Primary Key**: `snapshot_id` (auto-increment)
- **Foreign Key**: `hex` references aircraft table
- **Update Pattern**: INSERT only, creates audit trail

## Views

### current_aircraft_positions
Filters aircraft table to show only recently seen aircraft (within 5 minutes) with emergency status decoding.

### military_aircraft
Placeholder view for military aircraft identification (requires additional data source for military hex codes).

## Usage Notes

1. The `aircraft` table should use UPSERT logic to maintain current state
2. The `aircraft_snapshots` table provides historical tracking
3. Lat/lon index enables efficient geographic queries
4. Emergency squawk codes (7500, 7600, 7700) are decoded in views
5. Consider partitioning `aircraft_snapshots` by timestamp for large datasets