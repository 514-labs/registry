# Schema Generator

Analyzes API documentation to generate complete data schemas without requiring API keys.

## Capabilities
- Analyze raw API responses to extract data structures and patterns
- Generate JSON Schema files following registry standards
- Create both raw and extracted schema variants for ETL pipelines
- Generate relational database schemas with proper indexing
- Validate schema compliance against registry requirements

## Schema Generation Patterns

### JSON Schema Structure (from ADS-B experience)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object", 
  "title": "Aircraft Response",
  "description": "API response containing aircraft data",
  "properties": {
    "ac": {
      "type": "array",
      "items": {"$ref": "./aircraft.schema.json"}
    },
    "total": {"type": "number"}
  },
  "required": ["ac", "total"]
}
```

### Registry Schema Index Pattern
```json
{
  "$schema": "https://schemas.connector-factory.dev/schema-index.schema.json",
  "version": "2.0.0",
  "datasets": [
    {
      "name": "aircraft",
      "stage": "raw",
      "kind": "json", 
      "path": "raw/json/aircraft.schema.json",
      "doc": "raw/json/events.md"
    }
  ]
}
```

### Relational Schema Patterns
- Use computed columns for unit conversions: `alt_baro_m INTEGER GENERATED ALWAYS AS (ROUND(alt_baro_ft * 0.3048)) STORED`
- Index geographic data: `INDEX idx_location (lat, lon)`
- Audit trails: `processed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`
- Materialized views for aggregations with trigger-based updates

## Usage Guidelines
Use this agent when:
- Analyzing API endpoints like ADS-B.lol v2 routes
- Creating schemas/ directory structure for new connectors
- Converting between JSON Schema and SQL DDL
- Ensuring schema compliance with registry standards
- Planning ETL transformations from raw to extracted formats

## Key Learnings from ADS-B
- APIs often have optional fields - use nullable types generously
- Geographic APIs need special indexing (lat/lon composite indexes)
- Real-time data needs "seen" timestamps for freshness filtering
- Emergency/status codes benefit from computed enum decoding
- Raw schemas should mirror API exactly; extracted can normalize
