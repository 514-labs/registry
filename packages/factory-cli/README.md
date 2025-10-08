# Factory / Registry CLI

A Node.js CLI to scaffold new connectors and pipelines from the repository's JSON scaffold templates.

## Install

### From npm (recommended)

Install globally:

```bash
npm install -g @514labs/registry
```

Or use with npx (no installation required):

```bash
npx @514labs/registry --help
```

### Local development (in this monorepo)

```bash
pnpm --filter @514labs/registry install
pnpm --filter @514labs/registry build
```

Optionally link the binary:

```bash
pnpm -C packages/factory-cli link --global
```

## Usage

### Using the installed CLI

- Show help:

```bash
registry --help
```

- Scaffold connector/pipeline metadata only:

```bash
registry scaffold connector meta \
  --name hubspot \
  --scaffold-version v3 \
  --author 514-labs \
  --yes
```

- Scaffold TypeScript implementation (connector example):

```bash
registry scaffold connector typescript \
  --name hubspot \
  --scaffold-version v3 \
  --author 514-labs \
  --implementation default \
  --package-name @workspace/connector-hubspot \
  --resource contacts \
  --yes
```

- Dry run without writing files:

```bash
registry scaffold pipeline typescript \
  --name google-analytics-to-clickhouse \
  --scaffold-version v1 \
  --author 514-labs \
  --dry-run \
  --yes
```

- Flattening generated types

Generate a flattened TypeScript interface from a a nested TypeScript interface. Re-running with the same `--name` replaces the prior declaration (idempotent, no duplicates).

```bash
# From repo root
pnpm --filter @514labs/registry build
pnpm --filter @514labs/registry flatten \
  --source <absolute-path-to-source-type-file> \
  --type <type-name-to-flatten> \
  --out <absolute-path-for-the-flattened-type> \
  --name <resulting-flattened-type-name>
```

Notes:
- The command writes to a single file and updates the exported type by name if it already exists.
- Optional flags: `--delimiter _` (default `_`), `--name <OutType>` (default `<type>Flat`).

### Using npx (no installation)

Replace `registry` with `npx @514labs/registry` in any of the above commands:

```bash
npx @514labs/registry --help
npx @514labs/registry scaffold connector meta --name example --yes
```

### Local development

For local development in this monorepo, use the direct path:

```bash
node packages/factory-cli/dist/index.js --help
```

## Notes

- The CLI auto-detects the repo root from the current working directory.
- Variables are validated against patterns defined in the scaffold JSON.
- Placeholders like `{connector}`, `{pipeline}`, `{author}`, `{version}` are replaced in paths and templates.