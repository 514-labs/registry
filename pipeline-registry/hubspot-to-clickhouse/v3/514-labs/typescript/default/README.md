# hubspot-to-clickhouse (TypeScript)

Moose-based pipeline to ingest HubSpot deals into ClickHouse with consumption APIs and a sync workflow.

IMPORTANT: THIS PROJECT REQUIRES AT LEAST NODEJS 20.19 AND PNPM

## Getting started

### Pre-config
This project comes from a monorepo. To prepare it for use outside of a monorepo simply edit the `package.json` and remove the `@workspace/` fom the value of the name field. That's it - save your changes and continue.

### Installing

1) Install dependencies
```bash
pnpm i
```

2) Build the Hubspot connector code
```bash
cd app/hubspot
pnpm i
cd ../..
```

3) Set env vars or use .env file
```bash
export HUBSPOT_TOKEN=hs_pat_xxx
export ANONYMIZE_DATA=true # true to anonmize real hubspot data, false to use actual data
```

or

```bash
cp ENV.EXAMPLE .env
vi .env
```

4) Run Moose dev
```bash
pnpm dev
```

5) Generate lineage assets (provider `_meta/assets/`)
```bash
pnpm run lineage
pnpm run lineage:svg
```

See `app/` for models, transforms, APIs, and workflow. See `schemas/index.json` for dataset definitions.

## APIs

- Ingestion: `POST /ingest/HubSpotDealRaw`
- Analytics: `GET /consumption/hubspot-deals-analytics`
- Deal lookup: `GET /consumption/hubspot-deal-lookup`
- Pipeline performance: `GET /consumption/hubspot-deal-pipeline`
- Workflow trigger: `GET /consumption/hubspot-workflow-trigger`

Example trigger (fire-and-forget):
```bash
curl "http://localhost:4000/consumption/hubspot-workflow-trigger"
```
