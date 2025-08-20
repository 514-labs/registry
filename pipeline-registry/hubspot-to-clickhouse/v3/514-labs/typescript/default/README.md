# hubspot-to-clickhouse (TypeScript)

Moose-based pipeline to ingest HubSpot deals into ClickHouse with consumption APIs and a sync workflow.

## Getting started

1) Install dependencies
```bash
pnpm i
```

2) Install the HubSpot connector (pin to v3)
```bash
bash -i <(curl https://connectors.514.ai/install.sh) hubspot v3 514-labs typescript
```

3) Set env vars
```bash
export HUBSPOT_TOKEN=xxx
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
