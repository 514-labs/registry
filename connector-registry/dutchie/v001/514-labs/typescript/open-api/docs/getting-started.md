# Getting started

This package provides a Dutchie POS v001 connector. It exposes a simple lifecycle and typed domain methods for common objects.

## Install

### 1. Navigate to your project

Choose the directory in your project where you want to install the connector.

### 2. Run the installer

```bash
bash -i <(curl https://registry.514.ai/install.sh) dutchie v001 514-labs typescript open-api
```

### 3. Update project configuration

From your project's root directory, update your project's `package.json` to include the new connector.

```json
{
  "name": "my-ts-app",
  "dependencies": {
    "@workspace/connector-dutchie": "workspace:*",
  },
}
```

Create a workspace configuration (e.g. `pnpm-workspace.yaml`) so your package manager knows where it is.

```yaml
packages:
  - "app/dutchie"
```

### 4. Build the connector

From your project's root directory, install dependencies and build:

```bash
pnpm install && pnpm run build
```

## Quick start

```ts
import { createDutchieConnector } from "@workspace/connector-dutchie";

async function main() {
  const dutchie = createDutchieConnector();

  dutchie.initialize({
    auth: { type: "basic", basic: { username: process.env.DUTCHIE_API_KEY! } },
  });

  for await (const brand of conn.brand.streamAll({ pageSize: 100 })) {
    console.log('brand:', brand);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

## Available APIs

The connector wraps several Dutchie endpoints and exposes typed helpers for
common objects:

- **Brand** – `brand.list`, `brand.get`, `brand.stream`
- **Products** – `products.list`, `products.get`, `products.stream`
- **Inventory** – `inventory.list`, `inventory.get`, `inventory.stream`

Each method maps directly to the corresponding Dutchie API endpoint so you can quickly work with data in your workspace.

See `docs/configuration.md` for all configuration options.
