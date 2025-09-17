## Connector Factory

Build, own, and ship production‑grade data connectors without black boxes.

Inspired by the shadcn philosophy — copy what you need, keep full ownership, and adapt it to your stack — Connector Factory gives you specs, patterns, and tooling to create connectors that are reliable, testable, and truly yours.

### Why this exists

Everyone needs connectors. Nobody enjoys building or maintaining them. Vendors turned that pain into opaque subscriptions where you pay forever and never own the code. It’s time to change that.

- **Own the code**: No lock‑in. Copy, customize, and version in your repo.
- **Proven patterns**: Rock‑solid abstractions for lifecycle, retries, rate limits, pagination, and error handling.
- **LLM‑friendly specs**: Feed our specifications to your LLM to scaffold connectors fast.
- **Integrate everywhere**: Distribute as packages or embed directly into apps/services.
- **Open source**: Built on top of open source tools and standards.
- **Community**: Built by the community, for the community.

### Monorepo layout

This is a TurboRepo + pnpm monorepo.

- `apps/`: user‑facing apps (e.g. docs site)
- `packages/`: shared libraries (e.g. `@workspace/ui`, `@workspace/models`)
- `services/`: reusable services and infrastructure

Follow the workspace rule: prefix internal packages and services with `@workspace`.

### Quickstart

List available connectors:

```bash
bash -i <(curl https://registry.514.ai/install.sh) --list
```

Install a connector: (arguments: connector, version, author, language)

```bash
bash -i <(curl https://registry.514.ai/install.sh) google-analytics v4 fiveonefour typescript data-api
```

## Contributors

### Requirements

- Node 20 (until Moose Node version issues are resolved)
- pnpm (never npm)

### Development setup

Install dependencies at the workspace root:

```bash
pnpm install
```

Run the documentation app locally:

```bash
pnpm docs:dev
# open http://localhost:3000
```

Build the docs app:

```bash
pnpm docs:build
```

TurboRepo docs: `https://turborepo.com/docs`

### Philosophy (shadcn‑inspired)

We are not a hosted connector product. We’re a system you copy into your repo:

- **Copy/paste first**: Start with templates and snippets, not a dependency.
- **Readable TypeScript**: Prefer clarity over magic. You should debug everything.
- **Composable primitives**: Small, orthogonal building blocks you can swap.
- **Batteries included, not attached**: Patterns and tests you can own and evolve.

---

### Testing checklist

- Unit tests for all public methods
- Integration tests with mock servers
- Retry logic (backoff, jitter, circuit breaker)
- Rate limiting behavior
- Auth flows and expiry/refresh
- Error classification and propagation
- Pagination strategies and edge cases

---

## Developing in this repo

- **Tooling**: TurboRepo + pnpm. Do not override `.env`. Prefer absolute paths in scripts.
- **Node**: Use Node 20. Example with nvm: `nvm use 20`.
- **Workspace**: Internal packages use the `@workspace/*` scope.

Common commands:

```bash
pnpm install
cd apps/components-docs && pnpm dev
```

## Roadmap (high level)

- API connectors: spec + templates + generators
- Blob storage connectors: S3, GCS, Azure
- Database connectors: Postgres, MySQL, SQLite, MongoDB
- SaaS connectors: common third‑party APIs with auth presets
- Distribution tooling: publishable packages and app integration helpers

## Acknowledgements

This project’s philosophy is inspired by shadcn/ui — pragmatic copy‑and‑own code over opaque dependencies.