# Schema overview

Schemas document and validate the data contracts at two stages:

- `raw/`: Close to source API responses (staging).
- `extracted/`: Cleaned/normalized shapes for analytics/ELT.

Each stage includes two modalities:

- `json/`: JSON Schema (draft-07+) for payload structure/validation.
- `relational/`: `tables.json` (programmatic tables/columns/types/PK/FK) + optional `tables.sql` (DDL).

Inventory and layout:

- `schemas/index.json` — enumerates entities and points to raw schemas
- `schemas/raw/json/` — raw JSON schemas mirroring TS models (`properties` values as `string|null`)
- `schemas/raw/relational/` — staging tables (`tables.json`) + DDL (`tables.sql`)
- `schemas/extracted/` — reserved for transformed shapes

Start with `contacts`; expand with `companies`, `deals`, `tickets`, and `engagements` as needed. Keep schema and model changes in lockstep.
