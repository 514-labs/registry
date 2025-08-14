CREATE TABLE IF NOT EXISTS hubspot_raw_contacts (
  id text PRIMARY KEY,
  properties jsonb NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  archived boolean NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_hubspot_raw_contacts_updated_at
  ON hubspot_raw_contacts (updated_at);

CREATE TABLE IF NOT EXISTS hubspot_raw_companies (
  id text PRIMARY KEY,
  properties jsonb NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  archived boolean NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_hubspot_raw_companies_updated_at
  ON hubspot_raw_companies (updated_at);

CREATE TABLE IF NOT EXISTS hubspot_raw_deals (
  id text PRIMARY KEY,
  properties jsonb NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  archived boolean NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_hubspot_raw_deals_updated_at
  ON hubspot_raw_deals (updated_at);

CREATE TABLE IF NOT EXISTS hubspot_raw_tickets (
  id text PRIMARY KEY,
  properties jsonb NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  archived boolean NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_hubspot_raw_tickets_updated_at
  ON hubspot_raw_tickets (updated_at);

CREATE TABLE IF NOT EXISTS hubspot_raw_engagements (
  id text NOT NULL,
  object_type text NOT NULL,
  properties jsonb NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  archived boolean NOT NULL,
  PRIMARY KEY (id, object_type)
);

CREATE INDEX IF NOT EXISTS idx_hubspot_raw_engagements_updated_at
  ON hubspot_raw_engagements (updated_at);
