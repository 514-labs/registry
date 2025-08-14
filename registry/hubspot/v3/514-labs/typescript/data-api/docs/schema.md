# Schema overview

Schemas document and validate the data contracts at two stages:

- `raw/`: Close to source API responses (staging).
- `extracted/`: Cleaned/normalized shapes for analytics/ELT.

Each stage includes two modalities:

- `json/`: JSON Schema (draft-07+) for payload structure/validation.
- `relational/`: `tables.json` (programmatic tables/columns/types/PK/FK) + optional `tables.sql` (DDL).

See `schemas/index.json` for the entity inventory. Start with `contacts`; expand with `companies`, `deals`, `tickets`, and `engagements` as needed.
