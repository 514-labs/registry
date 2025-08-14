# batchRunPivotReports (Endpoint)

Returns multiple pivot reports in a batch for a Google Analytics 4 property.

## Request

- `property`: A Google Analytics 4 property identifier whose events are tracked. Example: properties/1234
- `requests`: Individual pivot report requests in the batch. Each request has a separate pivot report response in the batch response. Each batch request is allowed up to 5 requests.

## Response

- `pivotReports`: Individual responses to each pivot report request in the batch request, in the same order as the requests.
- `kind`: Resource type identifier for the batch pivot reports response.

## HTTP Details

- **Method**: POST
- **Path**: v1beta/{property=properties/*}:batchRunPivotReports

This is an **ENDPOINT** that processes batch pivot report requests for Google Analytics 4 properties. Pivot reports are a more advanced feature that allow flexible data aggregation across multiple dimension groups.

This file accompanies `batchRunPivotReports.schema.json` for a programmatic definition.
