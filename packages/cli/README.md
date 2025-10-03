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

- **Field Completeness** - % of records with non-null values
- **Risk Categorization** - Critical (<50%), Warning (50-90%), Safe (>90%)
- **Null Rates** - Exact count of null/missing values
- **Type Consistency** - Detects fields with mixed types
- **Actionable Recommendations** - Specific code examples for handling issues

### Output Format

**Inverted Pyramid Design:** Decision first, details on demand

**Default (Concise):**
- Overall assessment (Production Ready / Has Issues)
- Issue count and severity
- Only shows problematic fields (hides perfect scores)
- Code examples for fixes
- Exit code for CI/CD

**Verbose (`--verbose`):**
- Full field-by-field breakdown
- Raw vs normalized comparison
- Transformation details
- All fields including safe ones

### Sample Output

```
======================================================================
📊 QUALITY CHECK SUMMARY
======================================================================

✅ ASSESSMENT: Production Ready (with minor caveats)
   • 94.5% average completeness
   • 13 field(s) need null handling
   • 3 resource(s) analyzed, 54 total records

──────────────────────────────────────────────────────────────────────
⚠️  ACTION REQUIRED

⚠️  Warning fields (50-90% complete):
   → Add null checks to your code:

   const value = record.strain ?? 'default';
   const name = record.strain?.toUpperCase() ?? 'Unknown';

──────────────────────────────────────────────────────────────────────

Resource Summary:
┌───────────┬──────────────┬─────────┬──────────┬─────────┬──────┐
│ Resource  │ Completeness │ Records │ Critical │ Warning │ Safe │
├───────────┼──────────────┼─────────┼──────────┼─────────┼──────┤
│ brands    │       100.0% │      20 │        0 │       0 │    2 │
│ products  │        91.8% │      20 │        0 │      10 │   48 │
│ discounts │        91.6% │      14 │        0 │       3 │   30 │
└───────────┴──────────────┴─────────┴──────────┴─────────┴──────┘

💡 NEXT STEPS:

   1. Add null checks for warning fields (see examples above)
   2. Run with --verbose for detailed field-level analysis

⚠️  Exit code: 1 (warnings present)

======================================================================
```

### Exit Codes

- **0** - All checks passed (>90% complete, no issues)
- **1** - Warnings present (50-90% complete fields)
- **2** - Critical issues (fields <50% complete or fatal errors)

**CI/CD Integration:**

```bash
# Fail pipeline if quality is too low
factory check-quality my-connector -v v001 -a org -l typescript -i open-api
EXIT_CODE=$?
if [ $EXIT_CODE -eq 2 ]; then
  echo "Critical quality issues - blocking deployment"
  exit 1
fi
```

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

### Use Cases

1. **Quick Go/No-Go Decision** - Assessment in first line (30 seconds vs 5+ minutes)
2. **Defensive Coding** - Specific code examples for null handling
3. **Connector Comparison** - Overall assessment + completeness scores
4. **CI/CD Validation** - Exit codes for automated quality gates
5. **Field Reliability** - Risk categorization (Critical/Warning/Safe)

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
