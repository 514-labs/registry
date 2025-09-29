# Connector Registry

This registry defines a standard, portable file structure for connectors. Connectors are stored by connector name, then by organization/author, and contain shared metadata plus one or more language-specific implementations (e.g., Python and TypeScript).

Connectors created here can be transferred into a target codebase (similar to how shadcn components are copied) without coupling to any specific repository layout.

## Naming conventions

- Connector name: kebab-case (e.g., `stripe`, `google-analytics`)
- Author/organization (GitHub handle): kebab-case GitHub org or user (e.g., `514-labs`, `tg339`). This value must correspond to a real GitHub organization or user handle, as it is used for linking and avatars.
- Python package name: snake_case (e.g., `connector_stripe`)
- TypeScript npm package: prefer `@workspace/` prefix inside this monorepo (e.g., `@workspace/connector-stripe`)
- Do not commit secrets. Use `.env.example` for documented variables; never override real `.env` in this repo.

## Scaffold a connector
Generate a TypeScript connector (adjust flags as needed):
```bash
npx @514labs/registry scaffold connector typescript \
  --name my-connector \
  --scaffold-version v1 \
  --author 514-labs \
  --implementation default \
  --package-name @workspace/connector-my-connector \
  --resource widgets \
  --yes
```

Output path:
```
connector-registry/<name>/<version>/<author>/typescript/<implementation>/
```

### What gets generated (minimal, testable)
- `src/` with `client/`, `resources/` (single-file resources + barrel), `observability/`, `lib/`, `generated/` (empty)
- `schemas` to show on the registry website
  - `schemas/raw/files/openapi.json` (input path for OpenAPI)
- Tests (examples that can be extended)
- `_meta/` at root/version/author/language levels

### Implement
For full specifications, see `apps/registry-docs/content/docs/specifications/`. They serve as strong guardrails for your LLM-driven dev workflow.
Feel free to update the specs with your learnings.

## Test the connector (two ways)

1) Standalone tests (in the generated connector)
```bash
cd connector-registry/<name>/<version>/<author>/typescript/<implementation>
pnpm install
pnpm test
```

2) Install flow into a project via script (using a branch of this repo)
- Set `REPO_BRANCH` to the branch you want to test and run the installer:
```bash
REPO_BRANCH=my-feature-branch \
bash -i <(curl https://registry.514.ai/install.sh) \
  --type connector <name> <version> <author> typescript <implementation> \
  --dest app/connectors/my-connector
```

Then use the connector in the destination project.
