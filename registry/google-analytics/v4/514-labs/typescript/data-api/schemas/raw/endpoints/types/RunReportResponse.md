# RunReportResponse (Type)

The response report table corresponding to a request.

## Properties

- `dimensionHeaders`: Describes dimension columns. The number of DimensionHeaders equals the number of dimensions in the request
- `metricHeaders`: Describes metric columns. The number of MetricHeaders equals the number of metrics in the request
- `rows`: Rows of dimension value combinations and metric values in the report
- `totals`: If requested, the totaled values of metrics
- `maximums`: If requested, the maximum values of metrics
- `minimums`: If requested, the minimum values of metrics
- `rowCount`: The total number of rows in the query result. `rowCount` is independent of the number of rows returned in the response
- `metadata`: Metadata for the report
- `propertyQuota`: This Analytics Property's quota state including this request
- `kind`: Identifies what kind of resource this message is. This `kind` is always the fixed string "analyticsData#runReport"

## Usage

This is a **TYPE** that represents the complete response from a standard report request. It contains all the data rows along with headers and metadata needed to interpret the results.

This file accompanies `RunReportResponse.schema.json` for a programmatic definition.
