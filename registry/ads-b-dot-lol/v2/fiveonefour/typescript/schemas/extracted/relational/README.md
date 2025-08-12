# ADS-B Extracted Relational Schema

This directory contains SQL table definitions for the processed/enriched ADS-B data after extraction and transformation.

## Tables

### aircraft_enriched
Enhanced aircraft data with computed fields and quality indicators.

**Computed Columns**:
- `alt_baro_m`: Altitude in meters (converted from feet)
- `gs_kmh`: Ground speed in km/h (converted from knots)
- `emergency_status`: Decoded emergency status from squawk codes
- `data_quality`: Completeness indicator for the record

**Enrichments**:
- Military aircraft flagging (requires external data source)
- Request correlation ID for traceability
- Processing timestamp for audit trail
- Multiple indexes for query optimization

### api_responses
Metadata about API calls and responses for monitoring and debugging.

**Key Metrics**:
- Response times and retry counts
- Rate limiting information
- Aircraft counts per request
- Endpoint usage patterns

### flight_statistics (Materialized)
Aggregated statistics by flight/callsign updated via triggers.

**Aggregations**:
- Unique aircraft per flight
- Average altitude and speed
- Emergency event counts
- Last seen timestamp

## Usage Patterns

1. **Real-time Ingestion**: Insert into `aircraft_enriched` with computed fields auto-populated
2. **Analytics Queries**: Use indexed columns and materialized views for performance
3. **Data Quality**: Filter by `data_quality` field for complete records only
4. **Monitoring**: Query `api_responses` for API health metrics

## Performance Considerations

- Computed columns are STORED for query performance
- Multiple indexes support common query patterns
- Materialized view with trigger reduces aggregation overhead
- Consider partitioning by `processed_at` for time-series queries