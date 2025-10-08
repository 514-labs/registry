# Outputs

This pipeline writes normalized brand and discount tables to ClickHouse.

## Brand (Brand_0_1)
Fields include:
- brandId (number) - Primary key, unique brand identifier
- brandName (string, optional) - Display name of the brand
- brandCatalogBrandId (string, optional) - Catalog reference identifier

Table uses `ReplacingMergeTree` engine ordered by `brandId` for efficient upserts.

## Discount (Discount_0_1)
Fields include:
- id (number) - Primary key, unique discount identifier
- externalId (string, optional) - External reference ID
- discountCode, discountDescription (string, optional) - Code and description
- validDateFrom, validDateTo (string, optional) - Validity date range
- maxRedemptions, redemptionLimit (number, optional) - Usage limits
- applicationMethodId, applicationMethod (number, string, optional) - How discount is applied
- canStackAutomatically (boolean, optional) - Whether discount can stack
- onlineName (string, optional) - Display name for online channels
- locationRestrictions, restrictToGroupIds (number[], optional) - Restrictions
- monday, tuesday, wednesday, thursday, friday, saturday, sunday (boolean, optional) - Day availability
- isActive, isBundledDiscount (boolean, optional) - Status flags
- reward_* fields (various types, optional) - Discount reward calculation settings
- menuDisplay_* fields (various types, optional) - Menu display settings
- paymentRestrictions_* fields (boolean, optional) - Payment restrictions

Table uses `ReplacingMergeTree` engine ordered by `id` for efficient upserts.

See `app/ingest/models.ts` for the storage definitions and type mappings.

Schemas can be organized under `schemas/index.json` if you want to document datasets formally.
