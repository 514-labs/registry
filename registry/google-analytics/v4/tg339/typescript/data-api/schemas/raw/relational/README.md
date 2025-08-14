# Raw relational schema

Tables mirror upstream payloads with minimal transformation.

- `ga_raw_events`: one row per event; `event_params` persist as JSONB for fidelity.
- Index on `timestamp` for time-range queries.

See `tables.json` for a programmatic definition and `tables.sql` for reference DDL.
