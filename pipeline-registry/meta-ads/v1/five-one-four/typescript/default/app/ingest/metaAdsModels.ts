import { DataModel } from "@514labs/moose-lib";

export interface MetaAdsCampaignRaw extends DataModel {
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

export interface MetaAdsInsightRaw extends DataModel {
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