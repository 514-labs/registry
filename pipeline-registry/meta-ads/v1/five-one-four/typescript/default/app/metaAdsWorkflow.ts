import { Task, Workflow } from "@514labs/moose-lib";
import { createMetaAdsConnector, type MetaAdsConnector } from "@connector-registry/meta-ads/v1/five-one-four/typescript/default";

interface MetaAdsCampaignRawIngestion {
  id: string;
  adAccountId: string;
  name: string;
  status: string;
  objective: string;
  createdTime: string;
  updatedTime: string;
  startTime?: string;
  stopTime?: string;
  dailyBudget?: number;
  lifetimeBudget?: number;
  spendCap?: number;
  bidStrategy?: string;
  budgetRemaining?: number;
  properties: Record<string, string>;
}

interface MetaAdsInsightRawIngestion {
  id: string;
  adAccountId: string;
  campaignId?: string;
  adsetId?: string;
  adId?: string;
  level: "account" | "campaign" | "adset" | "ad";
  dateStart: string;
  dateStop: string;
  impressions?: number;
  clicks?: number;
  spend?: number;
  reach?: number;
  frequency?: number;
  cpm?: number;
  cpc?: number;
  ctr?: number;
  properties: Record<string, string>;
}

if (!process.env.META_ADS_ACCESS_TOKEN) {
  console.log(
    "❌ ERROR: a META_ADS_ACCESS_TOKEN environment variable is required - see the docs for more info"
  );
} else if (process.env.META_ADS_ACCESS_TOKEN === "your_meta_ads_access_token_here") {
  console.log(
    "❌ ERROR: a valid META_ADS_ACCESS_TOKEN environment variable is required - see the docs for more info"
  );
}

if (!process.env.META_ADS_AD_ACCOUNT_ID) {
  console.log(
    "❌ ERROR: a META_ADS_AD_ACCOUNT_ID environment variable is required - see the docs for more info"
  );
}

async function syncMetaAdsCampaigns(): Promise<void> {
  const token = process.env.META_ADS_ACCESS_TOKEN;
  const adAccountId = process.env.META_ADS_AD_ACCOUNT_ID;

  if (!token) throw new Error("META_ADS_ACCESS_TOKEN environment variable is required");
  if (!adAccountId) throw new Error("META_ADS_AD_ACCOUNT_ID environment variable is required");

  console.log("🚀 Starting Meta Ads campaigns sync...");

  const connector = createMetaAdsConnector();
  connector.initialize({
    auth: { type: "bearer", bearer: { token } },
    rateLimit: { requestsPerSecond: 5, burstCapacity: 5 }, // Meta Ads has stricter rate limits
  });

  await connector.connect();

  const campaignFields = [
    "name",
    "status",
    "objective",
    "created_time",
    "updated_time",
    "start_time",
    "stop_time",
    "daily_budget",
    "lifetime_budget",
    "spend_cap",
    "bid_strategy",
    "budget_remaining",
  ];

  let campaignCount = 0,
    successCount = 0,
    errorCount = 0;

  for await (const campaign of connector.streamCampaigns({
    adAccountId,
    fields: campaignFields,
    pageSize: 50, // Smaller page size for Meta Ads
  })) {
    campaignCount++;
    try {
      const cleanProperties: Record<string, string> = {};
      for (const [key, value] of Object.entries(campaign)) {
        if (value !== null && value !== undefined && value !== "" && !["id"].includes(key)) {
          cleanProperties[key] = String(value);
        }
      }

      const campaignData: MetaAdsCampaignRawIngestion = {
        id: campaign.id,
        adAccountId: adAccountId,
        name: campaign.name || "",
        status: campaign.status || "",
        objective: campaign.objective || "",
        createdTime: campaign.created_time || new Date().toISOString(),
        updatedTime: campaign.updated_time || new Date().toISOString(),
        startTime: campaign.start_time,
        stopTime: campaign.stop_time,
        dailyBudget: campaign.daily_budget ? Number(campaign.daily_budget) : undefined,
        lifetimeBudget: campaign.lifetime_budget ? Number(campaign.lifetime_budget) : undefined,
        spendCap: campaign.spend_cap ? Number(campaign.spend_cap) : undefined,
        bidStrategy: campaign.bid_strategy,
        budgetRemaining: campaign.budget_remaining ? Number(campaign.budget_remaining) : undefined,
        properties: cleanProperties,
      };

      const response = await fetch(
        "http://localhost:4000/ingest/MetaAdsCampaignRaw",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(campaignData),
        }
      );
      if (!response.ok)
        throw new Error(
          `Moose ingestion error ${response.status}: ${await response.text()}`
        );
      successCount++;
      if (campaignCount % 25 === 0)
        console.log(
          `📊 Processed ${campaignCount} campaigns (${successCount} ok, ${errorCount} errs)`
        );
    } catch (err) {
      errorCount++;
      console.error(`❌ Error ingesting campaign ${campaignCount}:`, err);
    }
  }

  await connector.disconnect();
  console.log("✅ Meta Ads campaigns sync completed!", {
    campaignCount,
    successCount,
    errorCount,
  });
}

async function syncMetaAdsInsights(): Promise<void> {
  const token = process.env.META_ADS_ACCESS_TOKEN;
  const adAccountId = process.env.META_ADS_AD_ACCOUNT_ID;

  if (!token) throw new Error("META_ADS_ACCESS_TOKEN environment variable is required");
  if (!adAccountId) throw new Error("META_ADS_AD_ACCOUNT_ID environment variable is required");

  console.log("🚀 Starting Meta Ads insights sync...");

  const connector = createMetaAdsConnector();
  connector.initialize({
    auth: { type: "bearer", bearer: { token } },
    rateLimit: { requestsPerSecond: 5, burstCapacity: 5 },
  });

  await connector.connect();

  const insightFields = [
    "impressions",
    "clicks",
    "spend",
    "reach",
    "frequency",
    "cpm",
    "cpc",
    "ctr",
    "date_start",
    "date_stop",
  ];

  // Get insights for the last 30 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const timeRange = {
    since: startDate.toISOString().split('T')[0],
    until: endDate.toISOString().split('T')[0],
  };

  let insightCount = 0,
    successCount = 0,
    errorCount = 0;

  for await (const insight of connector.streamInsights({
    objectId: adAccountId,
    level: "campaign",
    fields: insightFields,
    timeRange,
    pageSize: 50,
  })) {
    insightCount++;
    try {
      const cleanProperties: Record<string, string> = {};
      for (const [key, value] of Object.entries(insight)) {
        if (value !== null && value !== undefined && value !== "" &&
            !["campaign_id", "date_start", "date_stop"].includes(key)) {
          cleanProperties[key] = String(value);
        }
      }

      const insightData: MetaAdsInsightRawIngestion = {
        id: `${insight.campaign_id || adAccountId}-${insight.date_start}-${insight.date_stop}`,
        adAccountId: adAccountId,
        campaignId: insight.campaign_id,
        level: "campaign",
        dateStart: insight.date_start || startDate.toISOString().split('T')[0],
        dateStop: insight.date_stop || endDate.toISOString().split('T')[0],
        impressions: insight.impressions ? Number(insight.impressions) : undefined,
        clicks: insight.clicks ? Number(insight.clicks) : undefined,
        spend: insight.spend ? Number(insight.spend) : undefined,
        reach: insight.reach ? Number(insight.reach) : undefined,
        frequency: insight.frequency ? Number(insight.frequency) : undefined,
        cpm: insight.cpm ? Number(insight.cpm) : undefined,
        cpc: insight.cpc ? Number(insight.cpc) : undefined,
        ctr: insight.ctr ? Number(insight.ctr) : undefined,
        properties: cleanProperties,
      };

      const response = await fetch(
        "http://localhost:4000/ingest/MetaAdsInsightRaw",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(insightData),
        }
      );
      if (!response.ok)
        throw new Error(
          `Moose ingestion error ${response.status}: ${await response.text()}`
        );
      successCount++;
      if (insightCount % 25 === 0)
        console.log(
          `📊 Processed ${insightCount} insights (${successCount} ok, ${errorCount} errs)`
        );
    } catch (err) {
      errorCount++;
      console.error(`❌ Error ingesting insight ${insightCount}:`, err);
    }
  }

  await connector.disconnect();
  console.log("✅ Meta Ads insights sync completed!", {
    insightCount,
    successCount,
    errorCount,
  });
}

export const syncMetaAdsCampaignsTask = new Task<null, void>("syncMetaAdsCampaigns", {
  run: async () => {
    console.log("🔄 Starting Meta Ads campaigns sync workflow with connector...");
    const startTime = Date.now();
    await syncMetaAdsCampaigns();
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`✅ Meta Ads campaigns sync completed successfully in ${duration}s`);
  },
  retries: 3,
  timeout: "5m",
});

export const syncMetaAdsInsightsTask = new Task<null, void>("syncMetaAdsInsights", {
  run: async () => {
    console.log("🔄 Starting Meta Ads insights sync workflow with connector...");
    const startTime = Date.now();
    await syncMetaAdsInsights();
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`✅ Meta Ads insights sync completed successfully in ${duration}s`);
  },
  retries: 3,
  timeout: "5m",
});

export const metaAdsDataSyncWorkflow = new Workflow("metaAdsDataSync", {
  startingTask: syncMetaAdsCampaignsTask,
  retries: 2,
  timeout: "10m",
  // schedule: "@every 1h", // Run every hour
});