# audienceExports.get (Endpoint)

Gets configuration metadata about a specific audience export.

## Request

- `name`: Required. The audience export resource name. Format: properties/{property}/audienceExports/{audienceExport}

## Response

Returns the AudienceExport resource:
- `name`: The audience export resource name
- `audience`: The audience resource name. This resource name identifies the audience being exported
- `audienceDisplayName`: The descriptive display name for this audience
- `dimensions`: The dimensions requested and displayed in the query audience export response
- `state`: The current state of this audience export (CREATING, ACTIVE, or FAILED)
- `beginCreatingTime`: The time when CreateAudienceExport was called and the export began
- `creationQuotaTokensCharged`: The total quota tokens charged during creation of the audience export
- `rowCount`: The total number of rows in the export. Only available when state is ACTIVE
- `errorMessage`: Error message is populated when an audience export fails during creation
- `percentageCompleted`: The percentage completed. Only available when state is CREATING

## HTTP Details

- **Method**: GET
- **Path**: v1beta/{name=properties/*/audienceExports/*}

This is an **ENDPOINT** that retrieves metadata about a specific audience export for Google Analytics 4 properties.

This file accompanies `audienceExports.get.schema.json` for a programmatic definition.
