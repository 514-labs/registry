# dutchie-to-clickhouse (TypeScript)

Moose-based pipeline to ingest Dutchie into ClickHouse with consumption APIs and a sync workflow.

IMPORTANT: 
- THIS PROJECT REQUIRES AT LEAST NODEJS 20.19 AND PNPM
- YOU'LL NEED A DUTCHIE ACCOUNT AND VALID TOKEN WITH AT LEAST READ-ONLY SCOPE

## Getting started

1) Install dependencies
```bash
pnpm i
```

3) Set env vars
```bash
export DUTCHIE_API_KEY=key
```

4) Run Moose dev
```bash
pnpm dev
```

Example trigger (fire-and-forget):
```bash
curl "http://localhost:4000/workflows/testdutchie/trigger"
```
