# audienceExports.query (Endpoint)

Retrieves an audience export of users. After creating an audience, the users are not immediately available for exporting. First, a request to CreateAudienceExport is necessary to create an audience export of users, and then second, this method is used to retrieve the users in the audience export.

## Request

- `name`: Required. The audience export resource name. Format: properties/{property}/audienceExports/{audienceExport}
- `offset`: Optional. The row count of the start row. The first row is counted as row 0. When paging, the first request does not specify offset; or equivalently, sets offset to 0. The first request returns the first limit of rows. The second request sets offset to the limit of the first request; the second request returns the second limit of rows
- `limit`: Optional. The number of rows to return. If unspecified, 10,000 rows are returned. The API returns a maximum of 250,000 rows per request, no matter how many you ask for

## Response

- `audienceExport`: Configuration data about the audience export being queried, including all metadata fields
- `audienceRows`: Rows for each user in the audience export. Each row contains dimension values for the requested dimensions
- `rowCount`: The total number of rows in the audience export. This is independent of the number of rows returned in the response
- `audienceDimensionHeaders`: Headers for the dimensions in the audience export, describing each dimension column

## HTTP Details

- **Method**: POST
- **Path**: v1beta/{name=properties/*/audienceExports/*}:query

This is an **ENDPOINT** that retrieves the actual user data from an audience export. The audience export must be in ACTIVE state before it can be queried.

This file accompanies `audienceExports.query.schema.json` for a programmatic definition.
