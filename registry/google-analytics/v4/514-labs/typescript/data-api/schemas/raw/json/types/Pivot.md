# Pivot (Type)

Describes the visible dimension columns and rows in the report response. Pivot reports display dimensions as columns and rows in a multidimensional format.

## Properties

- `fieldNames`: Dimension names for visible columns in the report response. Including "dateRange" produces a dateRange column
- `orderBys`: Specifies how dimensions are ordered in the pivot. In the first Pivot, the OrderBys determine Row and PivotDimensionHeader ordering
- `offset`: The row count of the start row. The first row is counted as row 0
- `limit`: The number of unique combinations of dimension values to return in this pivot
- `metricAggregations`: Aggregate the metrics by dimensions in this pivot

## Usage

This is a **TYPE** used in pivot report requests to configure how data is organized in a pivot table format. Multiple pivots can be specified to create complex multi-dimensional reports.

## Example

```json
{
  "fieldNames": ["country", "deviceCategory"],
  "limit": "100",
  "orderBys": [{
    "metric": {"metricName": "sessions"},
    "desc": true
  }]
}
```

This file accompanies `Pivot.schema.json` for a programmatic definition.
