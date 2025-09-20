# Meta Ads Connector

A TypeScript connector for Facebook Graph API to extract campaign data, ad sets, ads, and insights from Meta Ads.

## Features

- **Campaigns**: List, get, and stream campaign data
- **Ad Sets**: Access ad set information and targeting details
- **Ads**: Retrieve individual ad data and creative information
- **Insights**: Get performance metrics and analytics data
- **Streaming Support**: Efficient pagination for large datasets
- **Type Safety**: Full TypeScript support with detailed type definitions

## Installation

```bash
npm install @workspace/connector-meta-ads
```

## Usage

```typescript
import { createMetaAdsConnector } from '@workspace/connector-meta-ads'

// Initialize connector
const connector = createMetaAdsConnector()

// Configure with your Facebook Graph API token
await connector.initialize({
  auth: {
    type: "bearer",
    bearer: { token: "your-facebook-access-token" }
  }
})

await connector.connect()

// List campaigns
const campaigns = await connector.listCampaigns({
  fields: ['id', 'name', 'status', 'objective']
})

// Get insights for a campaign
const insights = await connector.getInsights({
  objectId: "campaign-id",
  level: "campaign",
  fields: ['impressions', 'clicks', 'spend'],
  timeRange: { since: "2023-01-01", until: "2023-01-31" }
})

// Stream all ads with pagination
for await (const ad of connector.streamAds({
  fields: ['id', 'name', 'status']
})) {
  console.log(ad)
}
```

## Authentication

This connector requires a Facebook Graph API access token with appropriate permissions for Meta Ads data.

## API Reference

See the [Facebook Graph API documentation](https://developers.facebook.com/docs/graph-api/) for detailed information about available fields and parameters.

Schemas: see `schemas/index.json` for machine-readable definitions and accompanying Markdown docs.
