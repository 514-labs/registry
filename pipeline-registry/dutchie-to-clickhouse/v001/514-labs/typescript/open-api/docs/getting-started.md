# Getting started

This TypeScript implementation ingests HubSpot deals via the HubSpot connector (v3), transforms them into an analytics-friendly schema, and serves analytics/lookup APIs backed by ClickHouse.

## Prerequisites
- Node.js 20+
- pnpm 9+
- Docker (for local Moose infrastructure)

## Install the pipeline
Run the installer:

```bash
bash -i <(curl https://registry.514.ai/install.sh) --type pipeline dutchie-to-clickhouse v001 514-labs typescript open-api
```

## Install dependencies (monorepo)
From the repository root:

```bash
pnpm install
```

## Configure environment
Create a local `.env` (auto-loaded) or export in your shell. See `ENV.EXAMPLE` for a template.

```bash
export DUTCHIE_API_KEY=key
```

See `moose.config.toml` and `aurora.config.toml` for ClickHouse/Redis/Redpanda/HTTP server settings.

## Run the dev server
From this package directory:

```bash
pnpm dev
```

## Trigger a data sync
```bash
curl "http://localhost:4000/workflows/testdutchie/trigger"
```
