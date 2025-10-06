# Factory CLI

Local connector testing harness for running and analyzing connectors without a full pipeline.

## Features

- **Run Operations** - Execute connector operations with custom parameters
- **Quality Analysis** - Automated data quality checks with actionable insights

---

## Installation

```bash
# Build the CLI
pnpm -w -C packages/cli build

# Optional: Link binary for global use
pnpm -w -C packages/cli dev
```

---

## Run Connector

Execute individual connector operations locally.

```bash
factory run-connector <connector> \
  --implementation <impl> \
  --operation <operation> \
  [--params <json>] \
  [--limit <n>] \
  [--output <file>] \
  [--config <path>] \
  [--no-logs]
```

**Example:**

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

---

## Check Quality

Analyze connector data quality before using it.

```bash
factory check-quality dutchie \
  -v v001 \
  -a 514-labs \
  -l typescript \
  -i open-api \
  --verbose
```

**Requires `quality-check.yaml` in connector directory:**

```yaml
connector: dutchie
resources:
  - name: products
    operation: products.getAll
    sampleSize: 20
```

**Shows:**
- Overall assessment (Production Ready / Has Issues)
- Field completeness (Critical <50%, Warning 50-90%, Safe >90%)
- **Attribution** - Is poor quality from the API or connector?
- Actionable code examples for null handling
- Exit codes: `0` (pass), `1` (warnings), `2` (critical issues)

---

## Config File Format

```json
{
  "auth": {
    "type": "bearer",
    "bearer": { "token": "your_token_here" }
  },
  "timeoutMs": 30000,
  "rateLimit": { "requestsPerSecond": 5 }
}
```

---

## Supported Connectors

- HubSpot (`typescript/data-api`)
- Dutchie (`typescript/open-api`)

Extend `dynamicImportConnector` in `src/runner.ts` to add more.
