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
  --params '{"properties":["firstname","lastname"]}' \
  --limit 100 \
  --output contacts.jsonl
```

**Authentication:**
- Via `--config path/to/config.json` (JSON file with auth, timeouts, rate limits)
- Via environment variables: `HUBSPOT_TOKEN`, `DUTCHIE_API_KEY`, or generic `API_TOKEN`

**Output:**
- JSONL format (one JSON object per line)
- Streams to stdout or `--output <file>`
- Respects `--limit` for streaming operations

---

## Check Quality

Analyze connector data quality with automated metrics.

```bash
factory check-quality <connector> \
  --connector-version <version> \
  --author <author> \
  --language <language> \
  --implementation <impl> \
  [options]
```

**Example:**

```bash
# Basic quality check
factory check-quality dutchie \
  --connector-version v001 \
  --author 514-labs \
  --language typescript \
  --implementation open-api

# With detailed output (or use -v shorthand)
factory check-quality dutchie \
  -v v001 \
  -a 514-labs \
  -l typescript \
  -i open-api \
  --verbose
```

### What It Checks

- **Completeness** - % of records with non-null values per field
- **Null Rate** - % of null/undefined values per field
- **Type Consistency** - Detects fields with mixed types (string vs number, etc.)
- **Sample Values** - Shows example values for inspection

### Setup

Create `quality-check.yaml` in your connector directory:

```yaml
connector: dutchie
resources:
  - name: brands
    operation: brand.getAll
    sampleSize: 20
    params:
      paging:
        pageSize: 50
```

### Sample Output

```
============================================================
📊 QUALITY REPORT: brands (Raw API vs Connector Output)
============================================================

RAW API RESPONSE:
  Records: 20
  Total fields: 3
  Overall completeness: 66.7%

CONNECTOR OUTPUT:
  Records: 20
  Total fields: 2
  Overall completeness: 100.0%

⚙️  TRANSFORMATIONS APPLIED:
  • 1 fields removed
  • Quality impact: +33.3%

💡 QUALITY INSIGHTS:

✅ Safe to use without checks:
   • brandId (100% complete)
   • brandName (100% complete)

✅ Connector improved data quality by 33.3%
============================================================
```

### Use Cases

1. **Pre-integration evaluation** - Understand data quality before committing
2. **Field reliability** - Know which fields need defensive coding (`?.`, defaults)
3. **Connector comparison** - Compare quality across different options
4. **Documentation** - Auto-generate quality insights
5. **CI/CD validation** - Fail builds on quality degradation

### Options

- `-v, --connector-version <version>` (required) - Version identifier (e.g., `v001`)
- `-a, --author <author>` (required) - Author org/user (e.g., `514-labs`)
- `-l, --language <language>` (required) - Language (e.g., `typescript`, `python`)
- `-i, --implementation <impl>` (required) - Implementation name (e.g., `open-api`, `data-api`)
- `--config <path>` - Path to auth config JSON file
- `--verbose` - Show detailed field statistics

### Extending Quality Checks

Add custom checks by creating a new file in `src/quality/checks/` and registering it. See comments in `src/quality/checks/index.ts` for details.

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
