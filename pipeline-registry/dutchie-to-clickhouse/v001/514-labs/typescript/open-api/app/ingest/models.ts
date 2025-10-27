import {
  IngestPipeline,
  Key,
  OlapTable,
  DeadLetterModel,
  ClickHouseEngines,
} from "@514labs/moose-lib";
import type { Brand, DiscountApiResponseFlat } from '../connectors/dutchie';

export interface BrandWithKey extends Omit<Brand, "brandId"> {
  brandId: number;
}

export const BrandPipeline = new IngestPipeline<BrandWithKey>("Brand", {
  table: {
    engine: ClickHouseEngines.ReplacingMergeTree,
    orderByFields: ["brandId"]
  },
  stream: true,
  ingestApi: true,
  deadLetterQueue: false,
});


export interface DiscountWithKey extends Omit<DiscountApiResponseFlat, "id"> {
  id: number;
}

export const DiscountPipeline = new IngestPipeline<DiscountWithKey>("Discount", {
  table: {
    engine: ClickHouseEngines.ReplacingMergeTree,
    orderByFields: ["id"]
  },
  stream: true,
  ingestApi: true,
  deadLetterQueue: false,
});
