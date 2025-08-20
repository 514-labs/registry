import { IngestPipeline, Key, OlapTable, DeadLetterModel, ClickHouseEngines } from "@514labs/moose-lib";

/** Raw HubSpot deal data directly from API */
export interface HubSpotDealRaw {
  id: Key<string>;
  properties: HubSpotDealProperties;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  associations: HubSpotDealAssociations;
}

export interface HubSpotDealProperties {
  [key: string]: string | null | undefined;
}

export interface HubSpotDealAssociations {
  contacts: string[];
  companies: string[];
}

/** Processed/normalized HubSpot deal data */
export interface HubSpotDeal {
  id: Key<string>;
  dealName: string;
  amount: number;
  currency: string;
  stage: string;
  stageLabel: string;
  pipeline: string;
  pipelineLabel: string;
  dealType?: string;
  closeDate?: Date;
  createdAt: Date;
  lastModifiedAt: Date;
  ownerId?: string;
  stageProbability: number;
  forecastAmount: number;
  projectedAmount: number;
  daysToClose?: number;
  isWon: boolean;
  isClosed: boolean;
  isArchived: boolean;
  contactCount: number;
  noteCount: number;
  associatedContacts: string[];
  associatedCompanies: string[];
  customProperties: Record<string, any>;
}

export const hubspotDeadLetterTable = new OlapTable<DeadLetterModel>("HubSpotDealDeadLetter", {
  orderByFields: ["failedAt"],
});

/** Raw HubSpot deal ingestion */
export const HubSpotDealRawPipeline = new IngestPipeline<HubSpotDealRaw>("HubSpotDealRaw", {
  table: false,
  stream: true,
  ingest: true,
  deadLetterQueue: { destination: hubspotDeadLetterTable },
});

/** Processed HubSpot deal storage */
export const HubSpotDealPipeline = new IngestPipeline<HubSpotDeal>("HubSpotDeal", {
  table: {engine: ClickHouseEngines.MergeTree, orderByFields: ["id"]}, // Store processed data in ClickHouse
  stream: true, // Buffer processed records
  ingest: false, // No direct API; only derived from raw data
  deadLetterQueue: {
    destination: hubspotDeadLetterTable,
  },
});

