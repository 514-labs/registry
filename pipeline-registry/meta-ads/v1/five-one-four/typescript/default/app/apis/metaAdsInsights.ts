import { ConsumerRecord, DataModel } from "@514labs/moose-lib";

export interface MetaAdsInsightRaw extends DataModel {
  id: string;
  adAccountId: string;
  campaignId?: string;
  adsetId?: string;
  adId?: string;
  level: string; // "account" | "campaign" | "adset" | "ad"
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
  properties: string; // JSON stringified additional properties
}

export default function (record: ConsumerRecord<MetaAdsInsightRaw>): MetaAdsInsightRaw[] {
  return [record.value];
}