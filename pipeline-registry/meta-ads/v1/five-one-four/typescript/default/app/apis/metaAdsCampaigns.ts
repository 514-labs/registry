import { ConsumerRecord, DataModel } from "@514labs/moose-lib";

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
  properties: string; // JSON stringified additional properties
}

export default function (record: ConsumerRecord<MetaAdsCampaignRaw>): MetaAdsCampaignRaw[] {
  return [record.value];
}