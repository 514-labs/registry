-- Raw GA relational schema (DDL example)
CREATE TABLE IF NOT EXISTS ga_raw_events (
  event_name text NOT NULL,
  user_id text NULL,
  timestamp timestamptz NOT NULL,
  event_params jsonb NULL,
  PRIMARY KEY (event_name, timestamp)
);

CREATE INDEX IF NOT EXISTS idx_ga_raw_events_ts ON ga_raw_events (timestamp);
