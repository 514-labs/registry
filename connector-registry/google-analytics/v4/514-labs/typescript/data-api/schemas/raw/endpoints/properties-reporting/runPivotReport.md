# runPivotReport (Endpoint)

Returns a customized pivot report of your Google Analytics event data. Pivot reports are more advanced and expressive formats than regular reports. In a pivot report, dimensions are only visible if they are included in a pivot. Multiple pivots can be specified to further dissect your data.

## Request

- `property`: A Google Analytics 4 property identifier whose events are tracked. Example: properties/1234
- `dimensions`: The dimensions requested. All defined dimensions must be used by one of the following: dimension_expression, dimension_filter, pivots, order_bys
- `metrics`: The metrics requested, at least one metric needs to be specified
- `dateRanges`: The date range to retrieve event data for the report
- `pivots`: Describes the visual format of the report's dimensions in columns or rows. The union of the fieldNames (dimension names) in all pivots must be a subset of dimension names defined in Dimensions
- `dimensionFilter`: The filter clause of dimensions. Dimensions must be requested to be used in this filter
- `metricFilter`: The filter clause of metrics. Applied after aggregating the report's rows
- `currencyCode`: A currency code in ISO4217 format, such as "USD" or "EUR"
- `cohortSpec`: Cohort group associated with this request
- `keepEmptyRows`: If false or unspecified, rows with metrics being 0 will be omitted from results
- `returnPropertyQuota`: Toggles whether to return the current state of the Property's quota
- `comparisons`: Optional. The configuration of comparisons requested and displayed

## Response

The response contains pivot headers, dimension headers, metric headers, and rows of data organized according to the pivot configuration.

## HTTP Details

- **Method**: POST
- **Path**: v1beta/{property=properties/*}:runPivotReport

This is an **ENDPOINT** that generates pivot reports for Google Analytics 4 properties. Pivot reports provide more flexibility in organizing and presenting multi-dimensional data.

This file accompanies `runPivotReport.schema.json` for a programmatic definition.
