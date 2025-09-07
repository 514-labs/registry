## Pipeline Registry

This registry defines a standard, portable file structure for data pipelines. A pipeline moves data from a source system into a destination system using the MooseStack. Pipelines are stored by pipeline name, then by version and organization/author, and contain shared metadata plus one or more language-specific implementations (e.g., Python and TypeScript) for transforms and orchestration helpers.

Pipelines created here can be transferred into a target codebase (similar to how shadcn components are copied) without coupling to any specific repository layout.

### Naming conventions

- **pipeline name**: kebab-case (e.g., `ga-to-clickhouse`, `shopify-orders-to-warehouse`)
- **author/organization**: kebab-case GitHub org or user (e.g., `514-labs`). Must correspond to a real GitHub handle (used for linking and avatars)
- **python package name**: snake_case (e.g., `pipeline_ga_to_clickhouse`)
- **typescript npm package**: prefer `@workspace/` prefix inside this monorepo (e.g., `@workspace/pipeline-ga-to-clickhouse`)
- Do not commit secrets. Use `.env.example` for documented variables; never override real `.env` in this repo.

## Directory layout

Each pipeline follows the same top-level structure:

```
{pipeline}/
  _meta/                  # pipeline-level shared metadata and assets only (no docs)
  {version}/
    _meta/                # version-level metadata and assets only (no docs)
    {author}/
      _meta/              # provider-specific metadata (pipeline.json) and assets only (no docs)
      python/             # Python implementation (optional)
      typescript/         # TypeScript implementation (optional)
```

Notes:

- `_meta` folders are metadata-and-assets only. All documentation (getting started, configuration, outputs) must live in the language-specific implementations (e.g., `typescript/docs/*`).

### Pipeline metadata

Pipeline metadata is captured in JSON. There is a root-level descriptor and a provider-level descriptor:

- Root: `{pipeline}/_meta/pipeline.json`
- Provider/version scoped: `{pipeline}/{version}/{author}/_meta/pipeline.json`

The provider-level `pipeline.json` includes the full runnable definition: source, systems, transformations, destination, schedule, and lineage hints.

Root descriptor fields:

- `identifier` (kebab-case ID, matches folder name)
- `name` (display name)

Example provider-level `pipeline.json`:

```json
{
  "$schema": "https://schemas.connector-factory.dev/pipeline.schema.json",
  "name": "ga-to-clickhouse",
  "author": "514-labs",
  "authorType": "organization",
  "version": "v4",
  "description": "Ingest GA4 events and load into ClickHouse",
  "tags": ["ga4", "clickhouse", "etl"],
  "schedule": { "cron": "0 * * * *", "timezone": "UTC" },
  "source": {
    "type": "connector",
    "connector": { "name": "google-analytics", "version": "v4", "author": "514-labs" },
    "stream": "events"
  },
  "systems": [
    { "id": "s3_raw", "type": "s3", "bucket": "my-bucket", "path": "ga/events/raw/" }
  ],
  "transformations": [
    { "id": "normalize_events", "type": "typescript", "inputs": ["s3_raw"], "outputs": ["ch_stage.events"] }
  ],
  "destination": { "system": "clickhouse", "database": "analytics", "table": "events" },
  "lineage": {
    "nodes": [
      { "id": "source", "kind": "source", "label": "GA4" },
      { "id": "s3_raw", "kind": "system", "label": "S3 raw" },
      { "id": "normalize_events", "kind": "transform", "label": "Normalize" },
      { "id": "dest", "kind": "destination", "label": "CH analytics.events" }
    ],
    "edges": [
      { "from": "source", "to": "s3_raw", "label": "extract" },
      { "from": "s3_raw", "to": "normalize_events" },
      { "from": "normalize_events", "to": "dest", "label": "load" }
    ]
  },
  "maintainers": []
}
```

## Lineage

Every pipeline should include a clear lineage representation that shows the source, intermediate systems/transformations, and destination.

- Prefer a Moose lineage manifest at `moose/lineage.manifest.json` within each implementation. The docs render this manifest directly.
- Optionally, define a lineage schema overlay under `lineage/schemas/` to enumerate outputs (tables, files) and pointer datasets to connectors. The docs UI derives diagrams from those schemas when present.

We no longer scaffold or ship per-implementation lineage generator scripts. Instead, author the manifest and schemas directly alongside the implementation.

## Scaffolds

The `_scaffold/` directory contains JSON files that describe how to generate pipeline folders/files.

- `python.json`: Python implementation scaffold (includes `_meta` folder, docs, and lineage placeholders)
- `typescript.json`: TypeScript implementation scaffold (includes `_meta` folder, docs, and lineage placeholders)

Each scaffold uses variables:

- `{pipeline}`: pipeline name (kebab-case)
- `{version}`: pipeline version identifier (e.g., `v1`, `2024-10-01`)
- `{author}`: organization/author (kebab-case GitHub handle)
- `{packageName}`: language-specific package name
  - Python: snake_case (e.g., `pipeline_ga_to_clickhouse`)
  - TypeScript: npm package (e.g., `@workspace/pipeline-ga-to-clickhouse`)

A generator can interpret the `structure` array and create files/directories with optional `template` contents, replacing placeholders with the provided variables.

## Adding a new pipeline

1. Choose pipeline, version, and author names (kebab-case). The author must be a GitHub organization or user handle.
2. Generate language-specific implementations using `_scaffold/python.json` and/or `_scaffold/typescript.json`.
3. Each implementation includes its own `_meta` folder with pipeline metadata and assets (including from/to logos).
4. Put documentation into the language-specific implementations' `docs/` folder.
5. Optionally define output schemas in each implementation under `schemas/`.
6. Create lineage definitions in `lineage/` and `moose/` folders within the implementation.

> Note: Always use pnpm in this monorepo. For TypeScript, ensure Node 20. Do not commit real `.env` files.
