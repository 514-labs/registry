# Configuration

## Environment
- `DUTCHIE_API_KEY` (required): Dutchie api key.

## Connector (v001)
Install with:
```bash
bash -i <(curl https://registry.514.ai/install.sh) --type pipeline dutchie-to-clickhouse v001 514-labs typescript open-api
```

## Moose runtime
Adjust `moose.config.toml` as needed:
- ClickHouse: host/ports, database `local`, user/pass
- Redis: url and key_prefix
- Redpanda: broker and retention
- HTTP server: port 4000 (management 5001)

## Workflow
- Workflow name: `testdutchie`

## Security
- Do not log tokens. Prefer `.env` and never commit secrets.
- Use TLS when configuring external hosts in production.
