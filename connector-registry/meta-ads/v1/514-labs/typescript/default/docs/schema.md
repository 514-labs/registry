# Schema

Refer to `schemas/index.json` and related files.

## Organization

Schemas support nested folder structures for better organization:

- **raw/** - Raw API schemas
  - `endpoints/` - API endpoint request/response schemas
  - `types/` - Shared type definitions for endpoints (not shown as Files)
  - `events/` - Event payloads
- **extracted/** - Normalized schemas
  - `entities/` - Business entities
  - `metrics/` - Aggregated data
- **files/** - File-based schemas (CSV/JSON/Parquet/Avro/NDJSON). Only items under `schemas/files` appear in the Files tab.

## Adding Schemas

1. Create schema files in appropriate nested folders
2. Update `schemas/index.json` with correct paths for endpoints and tables
3. Place file schemas under `schemas/files` (no index entries needed)
