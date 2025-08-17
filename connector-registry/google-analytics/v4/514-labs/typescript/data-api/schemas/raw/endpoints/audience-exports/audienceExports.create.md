# audienceExports.create (Endpoint)

Creates an audience export for later retrieval. This method quickly returns the audience export's resource name and initiates a long running asynchronous request to form an audience export. To export the users in an audience export, first create the audience export through this method and then send the audience resource name to the QueryAudienceExport method.

## Request

- `parent`: Required. The parent resource where this audience export will be created. Format: properties/{property}
- `audienceExport`: Required. The audience export to create
  - `audience`: Required. The audience resource name. This resource name identifies the audience being exported
  - `dimensions`: Required. The dimensions requested and displayed in the query audience export response

## Response

Returns a long-running operation that tracks the creation of the audience export:
- `name`: The server-assigned name of the operation
- `metadata`: Service-specific metadata associated with the operation
- `done`: If the value is false, it means the operation is still in progress
- `response`: The normal response of the operation in case of success

The response will contain the AudienceExport resource once the operation completes.

## HTTP Details

- **Method**: POST
- **Path**: v1beta/{parent=properties/*}/audienceExports

This is an **ENDPOINT** that creates audience exports for Google Analytics 4 properties. Audience exports allow you to export user lists based on audience definitions.

This file accompanies `audienceExports.create.schema.json` for a programmatic definition.
