# Getting started

This package provides a Meta Ads v1 connector. It exposes a simple lifecycle and typed domain methods for common objects.

## Install

### 1. Navigate to your project

Go to the root directory of your project.

### 2. Run the installer

Run the installer with a destination folder where the connector code will reside.

```bash
bash -i <(curl https://registry.514.ai/install.sh) --dest app/meta-ads meta-ads v1 514-labs typescript default
```

### 3. Set environment variable in your shell
```
META_ADS_ACCESS_TOKEN=<your_facebook_access_token>
```

### 4. Start your app

From your project's root directory, install dependencies and run:

```bash
pnpm install && pnpm run dev
```

## Usage

```ts
import { createMetaAdsConnector } from "@workspace/connector-meta-ads";

async function main() {
  const metaAds = createMetaAdsConnector();

  metaAds.initialize({
    auth: { type: "bearer", bearer: { token: process.env.META_ADS_ACCESS_TOKEN! } },
  });

  for await (const campaign of metaAds.campaigns.streamAll({ pageSize: 100 })) {
    console.log('campaign:', campaign);
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
import type { Campaign } from '../meta-ads/src';
import {
  IngestPipeline,
  OlapTable,
  DeadLetterModel,
  ClickHouseEngines,
} from "@514labs/moose-lib";

// Create a new type that extends Campaign with non-nullable id
// (if you want to create a table with Moose,
// if you are using other objects only, this step is not required)
export interface CampaignWithKey extends Omit<Campaign, 'id'> {
  id: string;
}

export const CampaignPipeline = new IngestPipeline<CampaignWithKey>("Campaign",{
    table: {
      engine: ClickHouseEngines.ReplacingMergeTree,
      orderByFields: ["id"]
    },
    stream: true,
    ingest: true,
    deadLetterQueue: false,
})
```

In `app/workflows/meta-ads.ts`:

```ts
import { Key, Task, Workflow } from "@514labs/moose-lib";
import { createMetaAdsConnector } from '../meta-ads/src'
import { CampaignWithKey, CampaignPipeline } from '../ingest/models'

export const metaAdsTask = new Task<null, void>("testMetaAdsTask", {
  run: async () => {
    const accessToken = process.env.META_ADS_ACCESS_TOKEN;
    if (!accessToken) throw new Error('META_ADS_ACCESS_TOKEN is required');

    const conn = createMetaAdsConnector();
    conn.initialize({
      auth: { type: 'bearer', bearer: { token: accessToken } },
    });

    console.log('Getting campaigns from Meta Ads');
    // First get ad accounts to find an account ID
    const adAccounts = await conn.getAdAccounts();
    if (adAccounts.length === 0) throw new Error('No ad accounts found');

    const items = await conn.getCampaigns({ adAccountId: adAccounts[0].id });
    const rows: CampaignWithKey[] = items
      .filter(c => c.id != null)
      .map(c => ({ ...c, id: c.id as Key<string> }));

    console.log('Rows:', rows);
    await CampaignPipeline.table!.insert(rows);
    console.log('Campaigns inserted into ClickHouse');
  },
  retries: 1,
  timeout: "30s",
});

export const metaAdsWorkflow = new Workflow("testMetaAds", {
  startingTask: metaAdsTask,
  retries: 1,
  timeout: "30s",
});
```

Merge this into your `app/index.ts`:

```ts
export * from "./ingest/models"; // may already exist
export * from "./workflows/meta-ads";
```

Run the workflow:

```bash
moose run workflow testMetaAds
```

## Available APIs

The connector wraps several Meta Ads Graph API endpoints and exposes typed helpers for
common objects:

- **Campaigns** – `campaigns.list`, `campaigns.get`, `campaigns.stream`
- **AdSets** – `adSets.list`, `adSets.get`, `adSets.stream`
- **Ads** – `ads.list`, `ads.get`, `ads.stream`
- **Insights** – `insights.list`, `insights.get`, `insights.stream`

Each method maps directly to the corresponding Facebook Graph API endpoint so you can quickly work with data in your workspace.

See `docs/configuration.md` for all configuration options.
