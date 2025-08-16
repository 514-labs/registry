# audienceExports.list (Endpoint)

Lists all audience exports for a Google Analytics 4 property. This method returns audience exports regardless of state.

## Request

- `parent`: Required. The parent resource for audience exports. Format: properties/{property}
- `pageSize`: Optional. The maximum number of audience exports to return. The service may return fewer than this value. If unspecified, at most 200 audience exports will be returned. The maximum value is 1000 (higher values will be coerced to the maximum)
- `pageToken`: Optional. A page token, received from a previous ListAudienceExports call. Provide this to retrieve the subsequent page

## Response

- `audienceExports`: The audience exports list. Each item contains:
  - `name`: The audience export resource name
  - `audience`: The audience resource name
  - `audienceDisplayName`: The descriptive display name for this audience
  - `dimensions`: The dimensions requested and displayed
  - `state`: The current state (CREATING, ACTIVE, or FAILED)
  - `beginCreatingTime`: The time when CreateAudienceExport was called
  - `creationQuotaTokensCharged`: The total quota tokens charged
  - `rowCount`: The total number of rows (only for ACTIVE state)
  - `errorMessage`: Error message (only for FAILED state)
  - `percentageCompleted`: The percentage completed (only for CREATING state)
- `nextPageToken`: A token that can be sent as pageToken to retrieve the next page. If this field is omitted, there are no subsequent pages

## HTTP Details

- **Method**: GET
- **Path**: v1beta/{parent=properties/*}/audienceExports

This is an **ENDPOINT** that lists all audience exports for a Google Analytics 4 property.

This file accompanies `audienceExports.list.schema.json` for a programmatic definition.
