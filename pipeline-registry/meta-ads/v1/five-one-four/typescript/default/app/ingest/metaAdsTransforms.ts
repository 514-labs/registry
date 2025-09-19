import { DataModel } from "@514labs/moose-lib";
import { MetaAdsCampaignRaw, MetaAdsInsightRaw } from "./metaAdsModels";

export interface MetaAdsCampaignTransformed extends DataModel {
  id: string;
  adAccountId: string;
  name: string;
  status: string;
  objective: string;
  createdTime: Date;
  updatedTime: Date;
  startTime?: Date;
  stopTime?: Date;
  dailyBudget?: number;
  lifetimeBudget?: number;
  spendCap?: number;
  bidStrategy?: string;
  budgetRemaining?: number;
  isActive: boolean;
  hasEndDate: boolean;
  budget: number;
  budgetType: "daily" | "lifetime" | "none";
}

export interface MetaAdsInsightTransformed extends DataModel {
  id: string;
  adAccountId: string;
  campaignId?: string;
  adsetId?: string;
  adId?: string;
  level: "account" | "campaign" | "adset" | "ad";
  dateStart: Date;
  dateStop: Date;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  frequency: number;
  cpm: number;
  cpc: number;
  ctr: number;
  conversions: number;
  costPerConversion: number;
  roas: number; // Return on Ad Spend
}

export default function transformMetaAdsCampaign(
  campaign: MetaAdsCampaignRaw
): MetaAdsCampaignTransformed[] {
  const budget = campaign.dailyBudget || campaign.lifetimeBudget || 0;
  const budgetType = campaign.dailyBudget ? "daily" :
                    campaign.lifetimeBudget ? "lifetime" : "none";

  return [{
    id: campaign.id,
    adAccountId: campaign.adAccountId,
    name: campaign.name,
    status: campaign.status,
    objective: campaign.objective,
    createdTime: new Date(campaign.createdTime),
    updatedTime: new Date(campaign.updatedTime),
    startTime: campaign.startTime ? new Date(campaign.startTime) : undefined,
    stopTime: campaign.stopTime ? new Date(campaign.stopTime) : undefined,
    dailyBudget: campaign.dailyBudget,
    lifetimeBudget: campaign.lifetimeBudget,
    spendCap: campaign.spendCap,
    bidStrategy: campaign.bidStrategy,
    budgetRemaining: campaign.budgetRemaining,
    isActive: campaign.status === "ACTIVE",
    hasEndDate: !!campaign.stopTime,
    budget,
    budgetType,
  }];
}

export function transformMetaAdsInsight(
  insight: MetaAdsInsightRaw
): MetaAdsInsightTransformed[] {
  const impressions = insight.impressions || 0;
  const clicks = insight.clicks || 0;
  const spend = insight.spend || 0;

  // Calculate derived metrics
  const conversions = 0; // Would need conversion data from Meta
  const costPerConversion = conversions > 0 ? spend / conversions : 0;
  const roas = spend > 0 ? (conversions * 50) / spend : 0; // Assuming $50 avg conversion value

  return [{
    id: insight.id,
    adAccountId: insight.adAccountId,
    campaignId: insight.campaignId,
    adsetId: insight.adsetId,
    adId: insight.adId,
    level: insight.level,
    dateStart: new Date(insight.dateStart),
    dateStop: new Date(insight.dateStop),
    impressions,
    clicks,
    spend,
    reach: insight.reach || 0,
    frequency: insight.frequency || 0,
    cpm: insight.cpm || 0,
    cpc: insight.cpc || 0,
    ctr: insight.ctr || 0,
    conversions,
    costPerConversion,
    roas,
  }];
}