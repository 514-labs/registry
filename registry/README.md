# Connector Registry

This registry defines a standard, portable file structure for connectors. Connectors are stored by connector name, then by organization/author, and contain shared metadata plus one or more language-specific implementations (e.g., Python and TypeScript).

Connectors created here can be transferred into a target codebase (similar to how shadcn components are copied) without coupling to any specific repository layout.

## Naming conventions

- Connector name: kebab-case (e.g., `stripe`, `google-analytics`)
- Author/organization: kebab-case (e.g., `fiveonefour`, `acme-inc`)
- Python package name: snake_case (e.g., `connector_stripe`)
- TypeScript npm package: prefer `@workspace/` prefix inside this monorepo (e.g., `@workspace/connector-stripe`)
- Do not commit secrets. Use `.env.example` for documented variables; never override real `.env` in this repo.

## Directory layout

Each connector follows the same top-level structure:

```
{connector}/
  meta/               # connector-level shared metadata (name, description, category, tags) and docs/assets
  {author}/
    meta/             # provider-specific metadata and docs
    common/           # shared specifications and examples across implementations (no data schemas)
    python/           # Python implementation (optional)
    typescript/       # TypeScript implementation (optional)
```

### Connector root `meta/`

Connector-level, provider-agnostic information and assets:

- `connector.json`: connector-level metadata (name, title, description, category, tags, homepage)
- `README.md`: overview of the connector (purpose, concepts)
- `assets/`: shared logos/icons (optional)
- `docs/`: shared conceptual docs across providers (optional)

### Provider `meta/`

- `README.md`, `CHANGELOG.md`, `LICENSE`
- `connector.json`: provider metadata (author, languages, capabilities, maintainers)
- `assets/`: provider logos/icons (e.g., `logo.svg`)
- `docs/`: getting started, configuration, schema, limits

### `common/`

- `spec/`: protocol/contract (e.g., `openapi.yaml`, `models.json`)
- `examples/`: sample configs and data
- `tests/`: shared contract tests (e.g., `contract.schema.test.json`)
- Note: Data schemas now live in language-specific implementations to allow type differences per language.

### Language-specific schemas

Each implementation owns its schemas under its own folder. For TypeScript:

```
{connector}/{author}/typescript/src/schemas/
  index.json                # machine-readable registry of datasets
  raw/                      # source-side schemas
    json/*.schema.json + *.md
    relational/{tables.json, tables.sql, README.md}
  extracted/                # post-extraction/normalized schemas
    json/*.schema.json + *.md
    relational/{tables.json, tables.sql, README.md}
```

For Python use an analogous structure under `{connector}/{author}/python/src/{packageName}/schemas/`.

- JSON schemas: JSON Schema draft-07+; include `$schema` and `title`.
- Relational schemas: `tables.json` (programmatic tables/columns/types/PK/FK) and optional `tables.sql` for DDL.
- Every schema has an adjacent Markdown explainer.

## Scaffolds

The `registry/scaffold/` directory contains JSON files that describe how to generate connector folders/files.

- `meta.json`: language-agnostic scaffold
- `python.json`: Python implementation scaffold
- `typescript.json`: TypeScript implementation scaffold

Each scaffold uses variables:

- `{connector}`: connector name (kebab-case)
- `{author}`: organization/author (kebab-case)
- `{packageName}`: language-specific package name
  - Python: snake_case (e.g., `connector_stripe`)
  - TypeScript: npm package (e.g., `@workspace/connector-stripe`)

A generator can interpret the `structure` array and create files/directories with optional `template` contents, replacing placeholders with the provided variables.

## Adding a new connector

1. Choose connector and author names (kebab-case).
2. Create connector root `meta/` with shared provider-agnostic docs and `connector.json`.
3. Generate the provider meta scaffold using `registry/scaffold/meta.json` with your variables.
4. Optionally generate language-specific scaffolds using `registry/scaffold/python.json` and/or `registry/scaffold/typescript.json`.
5. Fill in provider `meta/connector.json` fields (author, languages, capabilities, homepage, maintainers). Point `source.spec` to `common/spec/openapi.yaml` or another contract.
6. Add assets, docs, shared specs, and examples.
7. Add language-specific `src/schemas/` trees with raw and extracted schema definitions, an `index.json`, and Markdown explainers.
8. Implement `client` and related modules in the chosen language(s). Add tests and examples.

> Note: Always use pnpm in this monorepo. For TypeScript, ensure Node 20. Do not commit real `.env` files.

## Example: `stripe` by `fiveonefour` (both Python and TypeScript)

```
stripe/
  meta/
    README.md
    connector.json
  fiveonefour/
    meta/
      README.md
      CHANGELOG.md
      LICENSE
      connector.json
      assets/{logo.svg, icon.svg}
      docs/{getting-started.md, configuration.md, schema.md, limits.md}
    common/
      spec/{openapi.yaml, models.json}
      examples/{config.sample.json, data.sample.json}
      tests/contract.schema.test.json
    python/
      src/connector_stripe/schemas/{index.json, raw/**, extracted/**}
    typescript/
      src/schemas/{index.json, raw/**, extracted/**}
      src/{index.ts, client.ts, config.ts, auth/, extract/, transform/, load/}
      tests/client.test.ts
      examples/basic-usage.ts
```

## Example: `postgres` by `fiveonefour` (TypeScript only)

```
postgres/
  meta/
    README.md
    connector.json
  fiveonefour/
    meta/
      README.md
      CHANGELOG.md
      LICENSE
      connector.json
      assets/
      docs/
    common/
      spec/{openapi.yaml, models.json}
      examples/
      tests/
    typescript/
      src/schemas/{index.json, raw/**, extracted/**}
      src/{index.ts, client.ts, config.ts, auth/, extract/, transform/, load/}
      tests/
      examples/
```

## Root metadata (`{connector}/meta/connector.json`)

Connector-level fields:

- `name`: connector ID (kebab-case)
- `title`: human-readable name
- `version`: semantic version of the connector spec/artifacts
- `category`: one of `api`, `db`, or `stream`
- `tags`: classification tags
- `description`: summary of functionality
- `homepage`: upstream docs or product page

## Provider metadata (`{connector}/{author}/meta/connector.json`)

Provider-specific fields:

- `author`: organization/author maintaining this implementation
- `languages`: list of provided implementations, e.g., `["python", "typescript"]`
- `capabilities`: toggles for `extract`, `transform`, `load`
- `source`: describe the upstream interface and where the spec lives (e.g., `common/spec/openapi.yaml`)
- `maintainers`: contacts for this connector

## Consuming connectors

Connectors can be copied into a target codebase similarly to shadcn components:

- Copy the connector root `meta/` and provider `meta/` and `common/` folders as needed.
- Copy one or more implementation folders (`python/`, `typescript/`) depending on your target stack.
- For TypeScript inside this monorepo, prefer package names prefixed with `@workspace/` and use pnpm.
- For Python, use `pyproject.toml` to build and publish to your internal index if desired.

If you need additional language scaffolds (e.g., Go or Java), follow the patterns used in `python.json` and `typescript.json` and add a new scaffold in `registry/scaffold/`.
