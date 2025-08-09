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
  {author}/
    meta/               # language-agnostic metadata, docs, assets
    common/             # shared specifications and examples across implementations
    python/             # Python implementation (optional)
    typescript/         # TypeScript implementation (optional)
```

### `meta/`

- `README.md`, `CHANGELOG.md`, `LICENSE`
- `connector.json`: registry metadata (name, author, version, languages, tags, capabilities)
- `assets/`: logos/icons (e.g., `logo.svg`)
- `docs/`: getting started, configuration, schema, limits

### `common/`

- `spec/`: protocol/contract (e.g., `openapi.yaml`, `models.json`)
- `examples/`: sample configs and data
- `tests/`: shared contract tests (e.g., `contract.schema.test.json`)

### `python/` (optional)

- `pyproject.toml`: package metadata and build settings
- `src/{packageName}/`: Python package source
  - `client.py`: entry point client
  - `config.py`: configuration types
  - `auth/`, `extract/`, `transform/`, `load/`, `schemas/`: implementation modules
- `tests/`: unit tests (e.g., `test_client.py`)
- `examples/`: runnable examples (e.g., `basic_usage.py`)

### `typescript/` (optional)

- `package.json`: package metadata and scripts (Node >= 20; use pnpm)
- `tsconfig.json`: compiler options
- `src/`: TypeScript source
  - `client.ts`: entry point client
  - `config.ts`: configuration types
  - `auth/`, `extract/`, `transform/`, `load/`, `schemas/`: implementation modules
- `tests/`: vitest tests (e.g., `client.test.ts`)
- `examples/`: runnable examples (e.g., `basic-usage.ts`)

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
2. Generate the meta scaffold using `registry/scaffold/meta.json` with your variables.
3. Optionally generate language-specific scaffolds using `registry/scaffold/python.json` and/or `registry/scaffold/typescript.json`.
4. Fill in `meta/connector.json` fields (description, tags, category, capabilities, homepage, maintainers). Point `source.spec` to `common/spec/openapi.yaml` or another contract.
5. Add assets, docs, shared specs, and examples.
6. Implement `client` and related modules in the chosen language(s). Add tests and examples.

> Note: Always use pnpm in this monorepo. For TypeScript, ensure Node 20. Do not commit real `.env` files.

## Example: `stripe` by `fiveonefour` (both Python and TypeScript)

```
stripe/
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
      pyproject.toml
      src/connector_stripe/{__init__.py, client.py, config.py, auth/, extract/, transform/, load/, schemas/}
      tests/test_client.py
      examples/basic_usage.py
    typescript/
      package.json
      tsconfig.json
      src/{index.ts, client.ts, config.ts, auth/, extract/, transform/, load/, schemas/}
      tests/client.test.ts
      examples/basic-usage.ts
```

## Example: `postgres` by `fiveonefour` (TypeScript only)

```
postgres/
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
      package.json
      tsconfig.json
      src/{index.ts, client.ts, config.ts, auth/, extract/, transform/, load/, schemas/}
      tests/
      examples/
```

## Metadata (`meta/connector.json`)

Minimal fields you will want to fill:

- `name`: connector ID (kebab-case)
- `author`: organization/author
- `version`: semantic version
- `languages`: list of provided implementations, e.g., `["python", "typescript"]`
- `category`: one of `api`, `db`, or `stream`
- `capabilities`: toggles for `extract`, `transform`, `load`
- `source`: describe the upstream interface and where the spec lives (e.g., `common/spec/openapi.yaml`)
- `maintainers`: contacts for this connector

## Consuming connectors

Connectors can be copied into a target codebase similarly to shadcn components:

- Copy the `meta/` and `common/` folders as-is.
- Copy one or more implementation folders (`python/`, `typescript/`) depending on your target stack.
- For TypeScript inside this monorepo, prefer package names prefixed with `@workspace/` and use pnpm.
- For Python, use `pyproject.toml` to build and publish to your internal index if desired.

If you need additional language scaffolds (e.g., Go or Java), follow the patterns used in `python.json` and `typescript.json` and add a new scaffold in `registry/scaffold/`.
