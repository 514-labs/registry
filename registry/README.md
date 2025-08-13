# Connector Registry

This registry defines a standard, portable file structure for connectors. Connectors are stored by connector name, then by organization/author, and contain shared metadata plus one or more language-specific implementations (e.g., Python and TypeScript).

Connectors created here can be transferred into a target codebase (similar to how shadcn components are copied) without coupling to any specific repository layout.

## Naming conventions

- Connector name: kebab-case (e.g., `stripe`, `google-analytics`)
- Author/organization (GitHub handle): kebab-case GitHub org or user (e.g., `514-labs`, `tg339`). This value must correspond to a real GitHub organization or user handle, as it is used for linking and avatars.
- Python package name: snake_case (e.g., `connector_stripe`)
- TypeScript npm package: prefer `@workspace/` prefix inside this monorepo (e.g., `@workspace/connector-stripe`)
- Do not commit secrets. Use `.env.example` for documented variables; never override real `.env` in this repo.

## Directory layout

Each connector follows the same top-level structure:

```
{connector}/
  _meta/              # connector-level shared metadata and assets only (no docs)
  {author}/
    _meta/            # provider-specific metadata and assets only (no docs)
    python/           # Python implementation (optional)
    typescript/       # TypeScript implementation (optional)
```

Notes:

- `_meta` folders are metadata-and-assets only. All documentation (getting started, configuration, schema, limits) must live in the language-specific implementations (e.g., `typescript/docs/*`).

### Language-specific schemas

Each implementation owns its schemas under its own folder. For TypeScript:

```
{connector}/{author}/typescript/
  docs/{getting-started.md, configuration.md, schema.md, limits.md}
  schemas/
    index.json
    raw/{json/*.schema.json, relational/{tables.json, tables.sql, README.md}}
    extracted/{json/*.schema.json, relational/{tables.json, tables.sql, README.md}}
```

For Python use an analogous structure under `{connector}/{author}/python/src/{packageName}/schemas/` and place docs alongside the implementation.

- JSON schemas: JSON Schema draft-07+; include `$schema` and `title`.
- Relational schemas: `tables.json` (programmatic tables/columns/types/PK/FK) and optional `tables.sql` for DDL.
- Every schema has an adjacent Markdown explainer.

## Scaffolds

The `registry/scaffold/` directory contains JSON files that describe how to generate connector folders/files.

- `meta.json`: root and provider `_meta` scaffold (assets only)
- `python.json`: Python implementation scaffold
- `typescript.json`: TypeScript implementation scaffold (includes `docs/`)

Each scaffold uses variables:

- `{connector}`: connector name (kebab-case)
- `{author}`: organization/author (kebab-case)
- `{packageName}`: language-specific package name
  - Python: snake_case (e.g., `connector_stripe`)
  - TypeScript: npm package (e.g., `@workspace/connector-stripe`)

A generator can interpret the `structure` array and create files/directories with optional `template` contents, replacing placeholders with the provided variables.

## Adding a new connector

1. Choose connector and author names (kebab-case). The author must be a GitHub organization or user handle.
2. Create connector root `_meta/` with `connector.json` and assets only.
3. Generate the provider `_meta` scaffold using `registry/scaffold/meta.json` with your variables.
4. Add language-specific implementations using `registry/scaffold/python.json` and/or `registry/scaffold/typescript.json`.
5. Put documentation into the language-specific implementations (not `_meta`).
6. Add language-specific `schemas/` trees with raw and extracted schema definitions, an `index.json`, and Markdown explainers.
7. Implement `client` and related modules in the chosen language(s). Add tests and examples.

> Note: Always use pnpm in this monorepo. For TypeScript, ensure Node 20. Do not commit real `.env` files.

## Example: `stripe` by `fiveonefour` (both Python and TypeScript)

```
stripe/
  _meta/
    connector.json
    assets/
  fiveonefour/
    _meta/
      CHANGELOG.md
      LICENSE
      connector.json
      assets/{logo.svg, icon.svg}
    python/
      src/connector_stripe/schemas/{index.json, raw/**, extracted/**}
    typescript/
      README.md
      docs/{getting-started.md, configuration.md, schema.md, limits.md}
      schemas/{index.json, raw/**, extracted/**}
      src/{index.ts, client.ts, config.ts, auth/, extract/, transform/, load/}
      tests/client.test.ts
      examples/basic-usage.ts
```

## Example: `postgres` by `fiveonefour` (TypeScript only)

```
postgres/
  _meta/
    connector.json
    assets/
  fiveonefour/
    _meta/
      CHANGELOG.md
      LICENSE
      connector.json
      assets/
    typescript/
      README.md
      docs/{getting-started.md, configuration.md, schema.md, limits.md}
      schemas/{index.json, raw/**, extracted/**}
      src/{index.ts, client.ts, config.ts, auth/, extract/, transform/, load/}
      tests/
      examples/
```

## Root metadata (`{connector}/_meta/connector.json`)

Connector-level fields:

- `name`, `title`, `version`, `category`, `tags`, `description`, `homepage`

## Provider metadata (`{connector}/{author}/_meta/connector.json`)

Provider-specific fields:

- `author`, `authorType` (one of `user` or `organization`), `avatarUrlOverride` (optional), `languages`, `capabilities`, `source`, `maintainers`

Avatar resolution:

- If `avatarUrlOverride` is set, it will be used directly.
- Otherwise, the system will fetch from GitHub based on `authorType` and `author` handle. If `authorType` is omitted, it will try user first, then organization.

## Consuming connectors

Connectors can be copied into a target codebase similarly to shadcn components:

- Copy the connector root `_meta/` and provider `_meta/` folders as needed.
- Copy one or more implementation folders (`python/`, `typescript/`) depending on your target stack.
- For TypeScript inside this monorepo, prefer package names prefixed with `@workspace/` and use pnpm.
- For Python, use `pyproject.toml` to build and publish to your internal index if desired.

If you need additional language scaffolds (e.g., Go or Java), follow the patterns used in `python.json` and `typescript.json` and add a new scaffold in `registry/scaffold/`.
