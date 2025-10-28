# dutchie-to-clickhouse (TypeScript)

Moose-based pipeline to ingest Dutchie into ClickHouse with consumption APIs and a sync workflow.

IMPORTANT: 
- THIS PROJECT REQUIRES AT LEAST NODEJS 20.19 AND PNPM
- YOU'LL NEED A DUTCHIE ACCOUNT AND VALID API KEY

## Getting started

1) Install dependencies
```bash
pnpm i
```

2) Set env vars
```bash
export DUTCHIE_API_KEY=key
```

3) Run Moose dev
```bash
pnpm dev
```

4) Run a moose workflow to sync data
```bash
curl -X POST "http://localhost:4000/workflows/getBrands/trigger"
```

```bash
curl -X POST "http://localhost:4000/workflows/getDiscounts/trigger"
```

5) Explore other moose commands
```bash
pnpm moose --help
```