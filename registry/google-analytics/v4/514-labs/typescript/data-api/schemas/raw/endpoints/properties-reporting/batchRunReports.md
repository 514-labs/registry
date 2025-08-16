# batchRunReports (Endpoint)

Returns multiple reports in a batch for a Google Analytics 4 property.

## Request

- `property`: A Google Analytics 4 property identifier whose events are tracked. To learn more, see [where to find your Property ID](https://developers.google.com/analytics/devguides/reporting/data/v1/property-id). Within a batch request, this property should either be unspecified or consistent with the batch-level property. Example: properties/1234
- `requests`: Individual requests in the batch. Each request has a separate report response in the batch response. Each batch request is allowed up to 5 requests.

## Response

- `reports`: Individual responses to each request in the batch request, in the same order as the requests.
- `kind`: Resource type identifier for the batch response.

## HTTP Details

- **Method**: POST
- **Path**: v1beta/{property=properties/*}:batchRunReports

This is an **ENDPOINT** that processes batch report requests for Google Analytics 4 properties.

This file accompanies `batchRunReports.schema.json` for a programmatic definition.
