# Factory CLI — Local Connector Testing Harness

Run and test connectors locally without a full pipeline or scheduler.

## Install (workspace)

- Ensure this package is included in your workspace (`pnpm-workspace.yaml`).
- Build:

```bash
pnpm -w -C packages/cli build
```

Optionally link a bin:

```bash
pnpm -w -C packages/cli dev
```

## Usage

```bash
factory run-connector hubspot \
  --implementation typescript/data-api \
  --operation listContacts \
  --params '{"limit":5,"properties":["firstname","lastname"]}' \
  --limit 100 \
  --output contacts.jsonl
```

- Provide config via `--config path/to/config.json` or env vars.
- When no `--config` is provided, it will read `HUBSPOT_TOKEN` (or `API_TOKEN`).
- Logs are enabled by default; disable with `--no-logs`.

## Config

Example `example.config.json`:

```json
{
  "auth": { "type": "bearer", "bearer": { "token": "hs_pat_xxx" } },
  "timeoutMs": 30000,
  "rateLimit": { "requestsPerSecond": 5 }
}
```

## Output

- JSON Lines to stdout or a file via `--output`.
- Streaming operations respect `--limit`.
- On error, prints a JSON line with `error` containing `ConnectorError` fields when applicable.

## Supported connectors

- hubspot (typescript/data-api)

Extend `dynamicImportConnector` in `src/runner.ts` to add more.

