# Row (Type)

Report data for each row. For example, if RunReportRequest contains:

```json
{
  "dimensions": [{"name": "eventName"}, {"name": "countryId"}],
  "metrics": [{"name": "eventCount"}]
}
```

One row containing "in_app_purchase", "JP", 15 would be:

```json
{
  "dimensionValues": [
    {"value": "in_app_purchase"},
    {"value": "JP"}
  ],
  "metricValues": [
    {"value": "15"}
  ]
}
```

## Properties

- `dimensionValues`: List of requested dimension values. In a PivotReport, dimension values are only listed for dimensions included in a pivot
- `metricValues`: List of requested visible metric values

## Usage

This is a **TYPE** that represents individual data rows in report responses. Each row contains the dimension value combinations and their corresponding metric values.

This file accompanies `Row.schema.json` for a programmatic definition.
