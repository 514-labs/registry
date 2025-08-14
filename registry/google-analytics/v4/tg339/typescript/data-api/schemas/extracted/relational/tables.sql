-- Extracted GA relational schema (DDL example)
CREATE TABLE IF NOT EXISTS ga_events (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  user_id text NULL,
  occurred_at timestamptz NOT NULL,
  params jsonb NULL
);

CREATE INDEX IF NOT EXISTS idx_ga_events_occurred_at ON ga_events (occurred_at);
