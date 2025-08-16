# runReport (Endpoint)

Returns a customized report of your Google Analytics event data. Reports contain statistics derived from data collected by the Google Analytics tracking code.

## Request

- `property`: A Google Analytics 4 property identifier whose events are tracked. Example: properties/1234
- `dimensions`: The dimensions requested and displayed
- `metrics`: The metrics requested and displayed  
- `dateRanges`: Date ranges of data to read. If multiple date ranges are requested, each response row will contain a zero based date range index
- `dimensionFilter`: Dimension filters allow you to ask for only specific dimension values in the report
- `metricFilter`: The filter clause of metrics. Applied after aggregating the report's rows
- `offset`: The row count of the start row. The first row is counted as row 0
- `limit`: The number of rows to return. If unspecified, 10,000 rows are returned
- `metricAggregations`: Aggregation of metrics. Aggregated metric values will be shown in rows
- `orderBys`: Specifies how rows are ordered in the response
- `currencyCode`: A currency code in ISO4217 format, such as "USD" or "EUR"
- `cohortSpec`: Cohort group associated with this request
- `keepEmptyRows`: If false or unspecified, rows with metrics being 0 will be omitted from results
- `returnPropertyQuota`: Toggles whether to return the current state of the Property's quota
- `comparisons`: Optional. The configuration of comparisons requested and displayed

## Response

- `dimensionHeaders`: Describes dimension columns. The number of DimensionHeaders equals the number of dimensions in the request
- `metricHeaders`: Describes metric columns. The number of MetricHeaders equals the number of metrics in the request
- `rows`: Rows of dimension value combinations and metric values
- `totals`: If requested, the totaled values of metrics
- `maximums`: If requested, the maximum values of metrics
- `minimums`: If requested, the minimum values of metrics
- `rowCount`: The total number of rows in the query result
- `metadata`: Metadata for the report
- `propertyQuota`: This Analytics Property's quota state including this request

## HTTP Details

- **Method**: POST
- **Path**: v1beta/{property=properties/*}:runReport

This is an **ENDPOINT** that generates customized reports for Google Analytics 4 properties.

This file accompanies `runReport.schema.json` for a programmatic definition.
