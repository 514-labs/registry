# Configuration

## Environment
- `HUBSPOT_TOKEN` (required): HubSpot Private App token.
- `ANONYMIZE_DATA` (optional): `true|false` — obfuscates deal names/amounts for demos.

## Connector (v3)
Install with:
```bash
bash -i <(curl https://registry.514.ai/install.sh) --type connector hubspot v3 514-labs typescript data-api
```

## Moose runtime
Adjust `moose.config.toml` as needed:
- ClickHouse: host/ports, database `local`, user/pass
- Redis: url and key_prefix
- Redpanda: broker and retention
- HTTP server: port 4000 (management 5001)

## Workflow
- Workflow name: `hubspotDataSync`
- Trigger via GET `/consumption/hubspot-workflow-trigger`
- Optional schedule: enable `schedule` in `app/scripts/hubspotWorkflow.ts`

## Security
- Do not log tokens. Prefer `.env` and never commit secrets.
- Use TLS when configuring external hosts in production.
