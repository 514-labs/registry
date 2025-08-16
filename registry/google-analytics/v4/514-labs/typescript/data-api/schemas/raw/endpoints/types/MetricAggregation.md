# MetricAggregation (Type)

Represents aggregation of metrics.

## Values

- `METRIC_AGGREGATION_UNSPECIFIED`: Unspecified operator
- `TOTAL`: Sum of the values for the requested metric
- `MINIMUM`: Minimum of the values for the requested metric
- `MAXIMUM`: Maximum of the values for the requested metric
- `COUNT`: Count of all values for the requested metric

## Usage

This is a **TYPE** used in report requests to specify how metrics should be aggregated. The aggregated metric values will be shown in rows where the dimensionValues are set to "RESERVED_(MetricAggregation)".

## Example

Request metric aggregations in a report:
```json
{
  "metrics": [{"name": "sessions"}],
  "metricAggregations": ["TOTAL", "MAXIMUM"]
}
```

This file accompanies `MetricAggregation.schema.json` for a programmatic definition.
