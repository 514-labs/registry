# Factory and Registry

[![Made by Fiveonefour](https://img.shields.io/badge/MADE%20BY-Fiveonefour-black.svg)](https://www.fiveonefour.com)
[![Community](https://img.shields.io/badge/Slack-Community-purple.svg?logo=slack)](https://join.slack.com/t/moose-community/shared_invite/zt-2fjh5n3wz-cnOmM9Xe9DYAgQrNu8xKxg)
[![Docs](https://img.shields.io/badge/Quickstart-Docs-blue.svg)](https://registry.514.ai/docs)
[![MIT license](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Build, own, and ship production‑grade data connectors and pipelines without black boxes.

Inspired by the [shadcn](https://ui.shadcn.com/) philosophy: copy the code you need, keep full ownership, and adapt it to your stack. Factory gives you specs, patterns, and tooling to create connectors that are reliable, testable, and truly yours.

## Why this exists

Everyone needs connectors. Nobody enjoys building or maintaining them. Vendors turned that pain into opaque subscriptions where you pay forever and never own the code. It’s time to change that.

- **Own the code**: No lock‑in. Copy, customize, and version in your repo.
- **Proven patterns**: Rock‑solid abstractions for lifecycle, retries, rate limits, pagination, and error handling.
- **LLM‑friendly specs**: Feed our specifications to your LLM to scaffold connectors fast.
- **Integrate everywhere**: Distribute as packages or embed directly into apps/services.
- **Open source**: Built on top of open source tools and standards.
- **Community**: Built by the community, for the community.

## What's here?

- **Connectors**: Extract data from APIs, SaaS apps, databases, and blob storage with built-in auth, retries, rate limiting, and standardized structure
- **Pipelines**: Build data workflows that connect sources to destinations with lineage tracking, transforms, and visual debugging

The Registry manages the distribution and discovery of these connectors and pipelines.

## Monorepo layout

This is a TurboRepo + pnpm monorepo.

- `apps/`: user‑facing apps (e.g. docs site)
- `packages/`: shared libraries (e.g. `@workspace/ui`, `@workspace/models`)
- `services/`: reusable services and infrastructure

Follow the workspace rule: prefix internal packages and services with `@workspace`.

## Quickstart: find and use connectors

List available connectors:

```bash
bash -i <(curl https://registry.514.ai/install.sh) --type connector --list
```

Install a connector: (arguments: --type, name, version, author, language, implementation)

```bash
bash -i <(curl https://registry.514.ai/install.sh) --type connector google-analytics v4 514-labs typescript data-api
```

## Quickstart: find and use pipelines

List available pipelines:

```bash
bash -i <(curl https://registry.514.ai/install.sh) --type pipeline --list
```

Install a pipeline: (arguments: --type, name, version, author, language, implementation)

```bash
bash -i <(curl https://registry.514.ai/install.sh) --type pipeline hubspot-to-clickhouse v3 514-labs typescript default
```

## Development

### Requirements

- Node 20.19+
- pnpm (never npm)

### Setup

Install dependencies at the workspace root:

```bash
pnpm install
```

### Guidelines

- **Tooling**: TurboRepo + pnpm. Do not override `.env`. Prefer absolute paths in scripts.
- **Node**: Use Node 20.19+. Example with nvm: `nvm use 20.19`.
- **Workspace**: Internal packages use the `@workspace/*` scope.
- **Build guide**: See [Connectors and Pipelines](https://registry.514.ai/create) documentation.

### Common commands

Run the documentation app locally:

```bash
pnpm docs:dev
# open http://localhost:3000
```

Build the docs app:

```bash
pnpm docs:build
```

Other examples:

```bash
cd apps/components-docs && pnpm dev
```

TurboRepo docs: [https://turborepo.com/docs](https://turborepo.com/docs)

## Philosophy (shadcn‑inspired)

We are not a hosted connector product. We’re a system you copy into your repo:

- **Copy/paste first**: Start with templates and snippets, not a dependency.
- **Readable TypeScript**: Prefer clarity over magic. You should debug everything.
- **Composable primitives**: Small, orthogonal building blocks you can swap.
- **Batteries included, not attached**: Patterns and tests you can own and evolve.

## Roadmap (high level)

- API connectors: spec + templates + generators
- Blob storage connectors: S3, GCS, Azure
- Database connectors: Postgres, MySQL, SQLite, MongoDB
- SaaS connectors: common third‑party APIs with auth presets
- Distribution tooling: publishable packages and app integration helpers

## Acknowledgements

This project’s philosophy is inspired by [shadcn/ui](https://ui.shadcn.com/) — pragmatic copy‑and‑own code over opaque dependencies.