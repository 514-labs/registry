import { Task, Workflow } from "@514labs/moose-lib";
import { createHubSpotConnector, type HubSpotConnector } from "./hubspot/src";

interface HubSpotDealRawIngestion {
  id: string;
  properties: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  associations: {
    contacts: string[];
    companies: string[];
  };
}

async function syncHubSpotDeals(): Promise<void> {
  const token = process.env.HUBSPOT_TOKEN;
  if (!token) throw new Error("HUBSPOT_TOKEN environment variable is required");

  console.log("🚀 Starting HubSpot deals sync...");

  const connector = createHubSpotConnector();
  connector.initialize({
    auth: { type: "bearer", bearer: { token } },
    rateLimit: { requestsPerSecond: 10, burstCapacity: 10 },
  });

  await connector.connect();

  const dealProperties = [
    "dealname", "amount", "dealstage", "pipeline", "dealtype",
    "closedate", "createdate", "hs_lastmodifieddate", "hubspot_owner_id",
    "deal_currency_code", "dealstage_label", "pipeline_label",
    "hs_deal_stage_probability", "hs_forecast_amount", "hs_projected_amount",
    "num_associated_contacts", "num_contacted_notes", "days_to_close"
  ];

  let dealCount = 0, successCount = 0, errorCount = 0;

  for await (const deal of connector.streamDeals({ properties: dealProperties, pageSize: 100 })) {
    dealCount++;
    try {
      const cleanProperties: Record<string, string> = {};
      for (const [key, value] of Object.entries(deal.properties || {})) {
        if (value !== null && value !== undefined && value !== "") cleanProperties[key] = String(value);
      }

      const dealData: HubSpotDealRawIngestion = {
        id: deal.id,
        properties: cleanProperties,
        createdAt: deal.createdAt,
        updatedAt: deal.updatedAt,
        archived: deal.archived || false,
        associations: { contacts: [], companies: [] },
      };

      const response = await fetch("http://localhost:4000/ingest/HubSpotDealRaw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dealData),
      });
      if (!response.ok) throw new Error(`Moose ingestion error ${response.status}: ${await response.text()}`);
      successCount++;
      if (dealCount % 50 === 0) console.log(`📊 Processed ${dealCount} total (${successCount} ok, ${errorCount} errs)`);
    } catch (err) {
      errorCount++;
      console.error(`❌ Error ingesting deal ${dealCount}:`, err);
    }
  }

  await connector.disconnect();
  console.log("✅ HubSpot sync completed!", { dealCount, successCount, errorCount });
}

export const syncHubSpotDealsTask = new Task<null, void>("syncHubSpotDeals", {
  run: async () => {
    console.log("🔄 Starting HubSpot deals sync workflow with connector...");
    const startTime = Date.now();
    await syncHubSpotDeals();
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`✅ HubSpot deals sync completed successfully in ${duration}s`);
  },
  retries: 3,
  timeout: "1m",
});

export const hubspotDataSyncWorkflow = new Workflow("hubspotDataSync", {
  startingTask: syncHubSpotDealsTask,
  retries: 2,
  timeout: "1m",
  // schedule: "@every 30s",
});
