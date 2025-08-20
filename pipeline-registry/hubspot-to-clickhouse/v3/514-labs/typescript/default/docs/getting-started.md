# Getting started

This TypeScript implementation ingests HubSpot deals via the HubSpot connector (v3), transforms them into an analytics-friendly schema, and serves analytics/lookup APIs backed by ClickHouse.

## Prerequisites
- Node.js 20+
- pnpm 9+
- Docker (for local Moose infrastructure)

## Install dependencies (monorepo)
From the repository root:

```bash
pnpm install
```

## Configure environment
Create a local `.env` (auto-loaded) or export in your shell. See `ENV.EXAMPLE` for a template.

```bash
export HUBSPOT_TOKEN=hs_pat_xxx
# Optional: anonymize deal names/amounts for demos
export ANONYMIZE_DATA=true
```

See `moose.config.toml` and `aurora.config.toml` for ClickHouse/Redis/Redpanda/HTTP server settings.

## Run the dev server
From this package directory:

```bash
pnpm dev
```

Available endpoints (default localhost:4000):
- POST `/ingest/HubSpotDealRaw`
- GET `/consumption/hubspot-deals-analytics`
- GET `/consumption/hubspot-deal-lookup`
- GET `/consumption/hubspot-deal-pipeline`
- GET `/consumption/hubspot-workflow-trigger`

## Trigger a data sync
```bash
curl "http://localhost:4000/consumption/hubspot-workflow-trigger"
```

Optionally run the workflow on a schedule by enabling the schedule in `app/scripts/hubspotWorkflow.ts`.
