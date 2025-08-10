# Schema

This connector defines both raw (upstream) and extracted (post-normalization) schemas.

- Programmatic index (TypeScript): `../../typescript/src/schemas/index.json`
- Raw schemas (TypeScript):
  - JSON: `../../typescript/src/schemas/raw/json/events.schema.json` with explainer `../../typescript/src/schemas/raw/json/events.md`
  - Relational: `../../typescript/src/schemas/raw/relational/tables.json` (+ optional `tables.sql`) with explainer `../../typescript/src/schemas/raw/relational/README.md`
- Extracted schemas (TypeScript):
  - JSON: `../../typescript/src/schemas/extracted/json/events.schema.json` with explainer `../../typescript/src/schemas/extracted/json/events.md`
  - Relational: `../../typescript/src/schemas/extracted/relational/tables.json` (+ optional `tables.sql`) with explainer `../../typescript/src/schemas/extracted/relational/README.md`

For other languages, use an analogous path under their implementation folder.
