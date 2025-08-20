import { ConsumptionApi } from "@514labs/moose-lib";

interface HubSpotDealsAnalyticsQueryParams {
  groupBy?: "stage" | "pipeline" | "month";
  limit?: number;
  includeArchived?: boolean;
  currency?: string;
}

interface HubSpotDealAnalyticsData {
  groupField: string;
  groupLabel: string;
  dealCount: number;
  totalAmount: number;
  avgAmount: number;
  wonAmount: number;
  wonCount: number;
  winRate: number;
  avgDaysToClose?: number;
}

interface HubSpotDealLookupQueryParams {
  dealId?: string;
  dealName?: string;
  ownerId?: string;
  stage?: string;
  limit?: number;
}

interface HubSpotDealData {
  id: string;
  dealName: string;
  amount: number;
  currency: string;
  stage: string;
  stageLabel: string;
  pipeline: string;
  pipelineLabel: string;
  closeDate?: string;
  createdAt: string;
  ownerId?: string;
  isWon: boolean;
  isClosed: boolean;
  contactCount: number;
  associatedContacts: string[];
  associatedCompanies: string[];
}

export const HubSpotDealsAnalyticsApi = new ConsumptionApi<
  HubSpotDealsAnalyticsQueryParams,
  HubSpotDealAnalyticsData[]
>("hubspot-deals-analytics", async (
  { groupBy = "stage", limit = 10, includeArchived = false, currency },
  { client, sql },
) => {
  let query;

  if (groupBy === "pipeline") {
    if (currency) {
      query = sql`
        SELECT 
          pipeline as groupField,
          pipelineLabel as groupLabel,
          count(*) as dealCount,
          sum(amount) as totalAmount,
          avg(amount) as avgAmount,
          sum(case when isWon then amount else 0 end) as wonAmount,
          count(case when isWon then 1 end) as wonCount,
          round(count(case when isWon then 1 end) * 100.0 / count(*), 2) as winRate,
          avg(daysToClose) as avgDaysToClose
        FROM HubSpotDeal FINAL
        WHERE isArchived = ${includeArchived} AND currency = ${currency}
        GROUP BY pipeline, pipelineLabel
        ORDER BY totalAmount DESC
        LIMIT ${limit}
      `;
    } else {
      query = sql`
        SELECT 
          pipeline as groupField,
          pipelineLabel as groupLabel,
          count(*) as dealCount,
          sum(amount) as totalAmount,
          avg(amount) as avgAmount,
          sum(case when isWon then amount else 0 end) as wonAmount,
          count(case when isWon then 1 end) as wonCount,
          round(count(case when isWon then 1 end) * 100.0 / count(*), 2) as winRate,
          avg(daysToClose) as avgDaysToClose
        FROM HubSpotDeal FINAL
        WHERE isArchived = ${includeArchived}
        GROUP BY pipeline, pipelineLabel
        ORDER BY totalAmount DESC
        LIMIT ${limit}
      `;
    }
  } else if (groupBy === "month") {
    if (currency) {
      query = sql`
        SELECT 
          toYYYYMM(createdAt) as groupField,
          formatDateTime(createdAt, '%Y-%m') as groupLabel,
          count(*) as dealCount,
          sum(amount) as totalAmount,
          avg(amount) as avgAmount,
          sum(case when isWon then amount else 0 end) as wonAmount,
          count(case when isWon then 1 end) as wonCount,
          round(count(case when isWon then 1 end) * 100.0 / count(*), 2) as winRate,
          avg(daysToClose) as avgDaysToClose
        FROM HubSpotDeal FINAL
        WHERE isArchived = ${includeArchived} AND currency = ${currency}
        GROUP BY toYYYYMM(createdAt), formatDateTime(createdAt, '%Y-%m')
        ORDER BY groupField DESC
        LIMIT ${limit}
      `;
    } else {
      query = sql`
        SELECT 
          toYYYYMM(createdAt) as groupField,
          formatDateTime(createdAt, '%Y-%m') as groupLabel,
          count(*) as dealCount,
          sum(amount) as totalAmount,
          avg(amount) as avgAmount,
          sum(case when isWon then amount else 0 end) as wonAmount,
          count(case when isWon then 1 end) as wonCount,
          round(count(case when isWon then 1 end) * 100.0 / count(*), 2) as winRate,
          avg(daysToClose) as avgDaysToClose
        FROM HubSpotDeal FINAL
        WHERE isArchived = ${includeArchived}
        GROUP BY toYYYYMM(createdAt), formatDateTime(createdAt, '%Y-%m')
        ORDER BY groupField DESC
        LIMIT ${limit}
      `;
    }
  } else {
    if (currency) {
      query = sql`
        SELECT 
          stage as groupField,
          stageLabel as groupLabel,
          count(*) as dealCount,
          sum(amount) as totalAmount,
          avg(amount) as avgAmount,
          sum(case when isWon then amount else 0 end) as wonAmount,
          count(case when isWon then 1 end) as wonCount,
          round(count(case when isWon then 1 end) * 100.0 / count(*), 2) as winRate,
          avg(daysToClose) as avgDaysToClose
        FROM HubSpotDeal FINAL
        WHERE isArchived = ${includeArchived} AND currency = ${currency}
        GROUP BY stage, stageLabel
        ORDER BY totalAmount DESC
        LIMIT ${limit}
      `;
    } else {
      query = sql`
        SELECT 
          stage as groupField,
          stageLabel as groupLabel,
          count(*) as dealCount,
          sum(amount) as totalAmount,
          avg(amount) as avgAmount,
          sum(case when isWon then amount else 0 end) as wonAmount,
          count(case when isWon then 1 end) as wonCount,
          round(count(case when isWon then 1 end) * 100.0 / count(*), 2) as winRate,
          avg(daysToClose) as avgDaysToClose
        FROM HubSpotDeal FINAL
        WHERE isArchived = ${includeArchived}
        GROUP BY stage, stageLabel
        ORDER BY totalAmount DESC
        LIMIT ${limit}
      `;
    }
  }

  const data = await client.query.execute<HubSpotDealAnalyticsData>(query);
  const result: HubSpotDealAnalyticsData[] = await data.json();
  return result;
});

export const HubSpotDealLookupApi = new ConsumptionApi<
  HubSpotDealLookupQueryParams,
  HubSpotDealData[]
>("hubspot-deal-lookup", async (
  { dealId, dealName, ownerId, stage, limit = 20 },
  { client, sql },
) => {
  let query;

  if (dealId) {
    query = sql`
      SELECT 
        id, dealName, amount, currency, stage, stageLabel, pipeline, pipelineLabel,
        closeDate, createdAt, ownerId, isWon, isClosed, contactCount,
        associatedContacts, associatedCompanies
      FROM HubSpotDeal FINAL
      WHERE id = ${dealId}
      ORDER BY lastModifiedAt DESC
      LIMIT ${limit}
    `;
  } else if (dealName && ownerId && stage) {
    query = sql`
      SELECT 
        id, dealName, amount, currency, stage, stageLabel, pipeline, pipelineLabel,
        closeDate, createdAt, ownerId, isWon, isClosed, contactCount,
        associatedContacts, associatedCompanies
      FROM HubSpotDeal FINAL
      WHERE dealName ILIKE ${`%${dealName}%`} AND ownerId = ${ownerId} AND stage = ${stage}
      ORDER BY lastModifiedAt DESC
      LIMIT ${limit}
    `;
  } else if (dealName && ownerId) {
    query = sql`
      SELECT 
        id, dealName, amount, currency, stage, stageLabel, pipeline, pipelineLabel,
        closeDate, createdAt, ownerId, isWon, isClosed, contactCount,
        associatedContacts, associatedCompanies
      FROM HubSpotDeal FINAL
      WHERE dealName ILIKE ${`%${dealName}%`} AND ownerId = ${ownerId}
      ORDER BY lastModifiedAt DESC
      LIMIT ${limit}
    `;
  } else if (dealName && stage) {
    query = sql`
      SELECT 
        id, dealName, amount, currency, stage, stageLabel, pipeline, pipelineLabel,
        closeDate, createdAt, ownerId, isWon, isClosed, contactCount,
        associatedContacts, associatedCompanies
      FROM HubSpotDeal FINAL
      WHERE dealName ILIKE ${`%${dealName}%`} AND stage = ${stage}
      ORDER BY lastModifiedAt DESC
      LIMIT ${limit}
    `;
  } else if (dealName) {
    query = sql`
      SELECT 
        id, dealName, amount, currency, stage, stageLabel, pipeline, pipelineLabel,
        closeDate, createdAt, ownerId, isWon, isClosed, contactCount,
        associatedContacts, associatedCompanies
      FROM HubSpotDeal FINAL
      WHERE dealName ILIKE ${`%${dealName}%`}
      ORDER BY lastModifiedAt DESC
      LIMIT ${limit}
    `;
  } else if (ownerId && stage) {
    query = sql`
      SELECT 
        id, dealName, amount, currency, stage, stageLabel, pipeline, pipelineLabel,
        closeDate, createdAt, ownerId, isWon, isClosed, contactCount,
        associatedContacts, associatedCompanies
      FROM HubSpotDeal FINAL
      WHERE ownerId = ${ownerId} AND stage = ${stage}
      ORDER BY lastModifiedAt DESC
      LIMIT ${limit}
    `;
  } else if (ownerId) {
    query = sql`
      SELECT 
        id, dealName, amount, currency, stage, stageLabel, pipeline, pipelineLabel,
        closeDate, createdAt, ownerId, isWon, isClosed, contactCount,
        associatedContacts, associatedCompanies
      FROM HubSpotDeal FINAL
      WHERE ownerId = ${ownerId}
      ORDER BY lastModifiedAt DESC
      LIMIT ${limit}
    `;
  } else if (stage) {
    query = sql`
      SELECT 
        id, dealName, amount, currency, stage, stageLabel, pipeline, pipelineLabel,
        closeDate, createdAt, ownerId, isWon, isClosed, contactCount,
        associatedContacts, associatedCompanies
      FROM HubSpotDeal FINAL
      WHERE stage = ${stage}
      ORDER BY lastModifiedAt DESC
      LIMIT ${limit}
    `;
  } else {
    query = sql`
      SELECT 
        id, dealName, amount, currency, stage, stageLabel, pipeline, pipelineLabel,
        closeDate, createdAt, ownerId, isWon, isClosed, contactCount,
        associatedContacts, associatedCompanies
      FROM HubSpotDeal FINAL
      ORDER BY lastModifiedAt DESC
      LIMIT ${limit}
    `;
  }

  const data = await client.query.execute<HubSpotDealData>(query);
  const result: HubSpotDealData[] = await data.json();
  return result;
});

interface HubSpotPipelinePerformanceData {
  pipeline: string;
  pipelineLabel: string;
  totalDeals: number;
  totalValue: number;
  wonDeals: number;
  wonValue: number;
  lostDeals: number;
  avgDaysToClose: number;
  conversionRate: number;
}

export const HubSpotDealPipelineApi = new ConsumptionApi<
  { daysBack?: number; limit?: number },
  HubSpotPipelinePerformanceData[]
>("hubspot-deal-pipeline", async (
  { daysBack = 30, limit = 10 },
  { client, sql },
): Promise<HubSpotPipelinePerformanceData[]> => {
  const query = sql`
    SELECT 
      pipeline,
      pipelineLabel,
      count(*) as totalDeals,
      sum(amount) as totalValue,
      sum(case when isWon then 1 else 0 end) as wonDeals,
      sum(case when isWon then amount else 0 end) as wonValue,
      sum(case when isClosed and not isWon then 1 else 0 end) as lostDeals,
      avg(case when isClosed then daysToClose end) as avgDaysToClose,
      round(sum(case when isWon then 1 else 0 end) * 100.0 / count(*), 2) as conversionRate
    FROM HubSpotDeal FINAL
    WHERE createdAt >= subtractDays(now(), ${daysBack})
    GROUP BY pipeline, pipelineLabel
    ORDER BY totalValue DESC
    LIMIT ${limit}
  `;

  const data = await client.query.execute<HubSpotPipelinePerformanceData>(query);
  const result: HubSpotPipelinePerformanceData[] = await data.json();
  return result;
});
