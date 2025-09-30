# Getting started

This package provides a Dutchie POS v001 connector. It exposes a simple lifecycle and typed domain methods for common objects.

## Install

### 1. Navigate to your project

Go to the root directory of your project.

### 2. Run the installer

Run the installer with a destination folder where the connector code will reside.

```bash
bash -i <(curl https://registry.514.ai/install.sh) --dest app/connectors/dutchie dutchie v001 514-labs typescript open-api
```

### 3. Set environment variable in your shell
```
DUTCHIE_API_KEY=<your_api_key>
```

### 4. Start your app

From your project's root directory, install dependencies and run:

```bash
pnpm install && pnpm run dev
```

## Usage

```ts
import { createDutchieConnector } from "@workspace/connector-dutchie";

async function main() {
  const dutchie = createDutchieConnector();

  dutchie.initialize({
    auth: { type: "basic", basic: { username: process.env.DUTCHIE_API_KEY! } },
  });

  for await (const page of conn.brand.getAll({ paging: { pageSize: 50 } })) {
    console.log('page:', page);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

## Usage with Moose projects

Merge this into your `app/ingest/models.ts`:

```ts
import type { Brand } from '../connectors/dutchie';
import {
  IngestPipeline,
  OlapTable,
  DeadLetterModel,
  ClickHouseEngines,
} from "@514labs/moose-lib";

// Create a new type that extends Brand with non-nullable brandId 
// (if you want to create a table with Moose, 
// if you are using other objects only, this step is not required)
export interface BrandWithKey extends Omit<Brand, 'brandId'> {
  brandId: number;
}

export const BrandPipeline = new IngestPipeline<BrandWithKey>("Brand",{
    table: {
      engine: ClickHouseEngines.ReplacingMergeTree,
      orderByFields: ["brandId"]
    },
    stream: true,
    ingest: true,
    deadLetterQueue: false,
})
```

In `app/workflows/dutchie.ts`:

```ts
import { Key, Task, Workflow } from "@514labs/moose-lib";
import { createDutchieConnector } from '../connectors/dutchie'
import { BrandWithKey, BrandPipeline } from '../ingest/models'

export const dutchietask = new Task<null, void>("testdutchietask", {
  run: async () => {
    const apiKey = process.env.DUTCHIE_API_KEY;
    if (!apiKey) throw new Error('DUTCHIE_API_KEY is required');

    const conn = createDutchieConnector();
    conn.initialize({
      auth: { type: 'basic', basic: { username: apiKey } },
    });

    console.log('Getting brands from Dutchie');
    for await (const page of conn.brand.getAll({ paging: { pageSize: 50 } })) {
      const rows: BrandWithKey[] = page
        .filter(b => b.brandId != null)
        .map(b => ({ ...b, brandId: b.brandId as Key<number> }));
      await BrandPipeline.table!.insert(rows);
    }
    console.log('Brands inserted into ClickHouse');
  },
  retries: 1,
  timeout: "30s",
});

export const dutchieworkflow = new Workflow("testdutchie", {
  startingTask: dutchietask,
  retries: 1,
  timeout: "30s",
});
```

Merge this into your `app/index.ts`:

```ts
export * from "./ingest/models"; // may alreaxy exist
export * from "./workflows/dutchie";
```

Run the workflow:

```bash
moose workflow run testdutchie
```

## Available APIs

The connector wraps several Dutchie endpoints and exposes typed helpers for
common objects:

- **Brand** – `brand.getAll`
- **Products** – `products.getAll`
- **Inventory** – `inventory.getAll`
- **Discounts** - `discounts.getAll`

Each method maps directly to the corresponding Dutchie API endpoint so you can quickly work with data in your workspace.

See `docs/configuration.md` for all configuration options.
