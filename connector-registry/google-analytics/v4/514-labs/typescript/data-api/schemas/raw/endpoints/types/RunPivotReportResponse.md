# RunPivotReportResponse (Type)

The response pivot report table corresponding to a pivot request.

## Properties

- `pivotHeaders`: Describes dimension columns. One PivotHeader for each Pivot requested
- `metricHeaders`: Describes metric columns in the report
- `rows`: Rows of dimension value combinations and metric values in the report
- `aggregates`: Aggregation of metric values. Can be totals, minimums, or maximums
- `metadata`: Metadata for the report
- `propertyQuota`: This Analytics Property's quota state including this request
- `kind`: Identifies what kind of resource this message is

## Usage

This is a **TYPE** that represents the complete response from a pivot report request. Pivot reports organize data in a multi-dimensional format with dimensions as both rows and columns.

The structure allows for complex cross-tabulation of data, making it easier to analyze relationships between multiple dimensions.

This file accompanies `RunPivotReportResponse.schema.json` for a programmatic definition.
