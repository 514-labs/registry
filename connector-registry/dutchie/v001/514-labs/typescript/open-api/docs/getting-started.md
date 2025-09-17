# Getting started

This package provides a Dutchie POS v001 connector. It exposes a simple lifecycle and typed domain methods for common objects.

## Install

### 1. Navigate to your project

Choose the directory in your project where you want to install the connector.

### 2. Run the installer

```bash
bash -i <(curl https://registry.514.ai/install.sh) dutchie v001 514-labs typescript open-api
```

### 3. Build the connector

From the generated `dutchie` directory, install dependencies and build:

```bash
npm install
npm run build
```

### 4. Update project configuration

Update your project's `package.json` to include the new connector folder.

### 5. Install dependencies in the project root

```bash
npm install
```

## Quick start

```ts
import { createDutchieConnector } from "@workspace/connector-dutchie";

async function main() {
  const dutchie = createDutchieConnector();

  dutchie.initialize({
    auth: { type: "basic", basic: { username: process.env.DUTCHIE_API_KEY! } },
    baseUrl: "https://api.pos.dutchie.com",
    logging: { enabled: true, level: "info" },
    validation: { enabled: true, strict: false },
  });
  await dutchie.connect?.(); // no-op in this connector

  // Fetch a page of products
  const { data: products } = await dutchie.products.list({ isActive: true, fromLastModifiedDateUTC: "2024-01-01T00:00:00Z" });
  for (const p of products) {
    console.log(`${p.productId}: ${p.name}`);
  }

  // Stream brands lazily
  for await (const page of dutchie.brand.stream({ pageSize: 100 })) {
    for (const b of page) {
      console.log("Brand", b.id);
    }
    break; // remove break to process all pages
  }

  // Fetch inventory with flags
  const { data: inventory } = await dutchie.inventory.list({ includeLabResults: true, includeRoomQuantities: false });
  console.log("Inventory count:", inventory.length);
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
