# Metric (Type)

The quantitative measurements of a report. For example, the metric `eventCount` is the total number of events. Requests are allowed up to 10 metrics.

## Properties

Either `name` or `expression` is specified:

- `name`: The name of the metric. See [API Metrics](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#metrics) for the list of metric names
- `expression`: A mathematical expression for derived metrics. For example, to use double the total events: `"2 * totalEvents"`
- `invisible`: Indicates if a metric is invisible in the report response. If a metric is invisible, the metric will not produce a column in the response, but can be used in metricFilter and orderBys

## Usage

This is a **TYPE** used in report requests to specify which metrics to include in the response. Metrics represent the quantitative data you want to analyze.

## Examples

- Simple metric: `{"name": "activeUsers"}`
- Derived metric: `{"expression": "totalRevenue / transactions"}`
- Invisible metric for filtering: `{"name": "sessions", "invisible": true}`

This file accompanies `Metric.schema.json` for a programmatic definition.
