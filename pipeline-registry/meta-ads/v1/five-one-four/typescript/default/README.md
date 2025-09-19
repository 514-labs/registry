# Meta Ads Pipeline

A Moose-powered data pipeline that extracts campaign data and insights from Meta Ads (Facebook Ads) and loads them into ClickHouse for analytics.

## Features

- **Campaign Sync**: Extracts campaign metadata including budgets, objectives, and performance
- **Insights Sync**: Pulls performance metrics (impressions, clicks, spend, CTR, etc.)
- **Real-time Processing**: Uses Moose framework for streaming data ingestion
- **Error Handling**: Robust retry logic and detailed error reporting
- **Rate Limiting**: Respects Meta Ads API rate limits

## Prerequisites

1. Meta Ads Business Manager account
2. App with Marketing API access
3. Valid access token with ads_read permissions
4. Docker (for running Moose infrastructure)

## Setup

1. Copy environment variables:
   ```bash
   cp ENV.EXAMPLE .env
   ```

2. Update `.env` with your credentials:
   ```
   META_ADS_ACCESS_TOKEN=your_access_token_here
   META_ADS_AD_ACCOUNT_ID=act_1234567890
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Start Moose infrastructure:
   ```bash
   pnpm run dev
   ```

## Usage

The pipeline runs two main workflows:

### Campaign Sync
Extracts campaign-level data including:
- Campaign name, status, objective
- Budget information (daily/lifetime)
- Bid strategies
- Created/updated timestamps

### Insights Sync
Pulls performance metrics for the last 30 days:
- Impressions, clicks, spend
- Reach, frequency, CPM, CPC, CTR
- Campaign-level aggregations

## Data Models

### Raw Ingestion
- `MetaAdsCampaignRaw`: Raw campaign data from Meta API
- `MetaAdsInsightRaw`: Raw insights/performance data

### Transformed Data
- `MetaAdsCampaignTransformed`: Cleaned and enriched campaign data
- `MetaAdsInsightTransformed`: Processed metrics with calculated fields

## Configuration

The pipeline uses `moose.config.toml` for infrastructure configuration:
- ClickHouse for data storage
- Redis for caching
- Temporal for workflow orchestration
- Redpanda for streaming

## Scheduling

Workflows can be scheduled by uncommenting the schedule line:
```typescript
// schedule: "@every 1h", // Run every hour
```

## API Access

Once running, data is available via HTTP at:
- `http://localhost:4000/consumption/MetaAdsCampaignTransformed`
- `http://localhost:4000/consumption/MetaAdsInsightTransformed`
