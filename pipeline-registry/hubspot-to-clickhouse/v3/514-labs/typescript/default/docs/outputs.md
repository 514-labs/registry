# Outputs

This pipeline writes a normalized deals table to ClickHouse.

## HubSpotDeal (analytics.hubspot_deals)
Fields include:
- id (string)
- dealName (string)
- amount (number)
- currency (string)
- stage, stageLabel (string)
- pipeline, pipelineLabel (string)
- closeDate (Date, optional)
- createdAt, lastModifiedAt (Date)
- ownerId (string, optional)
- stageProbability (number)
- forecastAmount, projectedAmount (number)
- daysToClose (number, optional)
- isWon, isClosed, isArchived (boolean)
- contactCount, noteCount (number)
- associatedContacts, associatedCompanies (string[])
- customProperties (object)

See `app/ingest/hubspotModels.ts` for the storage definition and `app/ingest/hubspotTransforms.ts` for transformation logic.

Schemas can be organized under `schemas/index.json` if you want to document datasets formally.
