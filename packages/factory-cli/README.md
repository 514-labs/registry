# Factory CLI

A Node.js CLI to scaffold new connectors and pipelines from the repository's JSON scaffold templates.

## Install (in this monorepo)

```bash
pnpm -C packages/factory-cli install
pnpm -C packages/factory-cli build
```

Optionally link the binary:

```bash
pnpm -C packages/factory-cli link --global
```

## Usage

- Show help:

```bash
node packages/factory-cli/dist/index.js --help
```

- Scaffold connector/pipeline metadata only:

```bash
node packages/factory-cli/dist/index.js scaffold connector meta \
  --name hubspot \
  --scaffold-version v3 \
  --author 514-labs \
  --yes
```

- Scaffold TypeScript implementation (connector example):

```bash
node packages/factory-cli/dist/index.js scaffold connector typescript \
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
node packages/factory-cli/dist/index.js scaffold pipeline typescript \
  --name google-analytics-to-clickhouse \
  --scaffold-version v1 \
  --author 514-labs \
  --dry-run \
  --yes
```

## Notes

- The CLI auto-detects the repo root from the current working directory.
- Variables are validated against patterns defined in the scaffold JSON.
- Placeholders like `{connector}`, `{pipeline}`, `{author}`, `{version}` are replaced in paths and templates.