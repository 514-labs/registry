# MetricMetadata (Type)

Explains a metric and provides information about its usage.

## Properties

- `apiName`: The API name of the metric. See [API Metrics](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#metrics)
- `uiName`: The display name of the metric in the UI
- `description`: Description of how this metric is used and calculated
- `deprecatedApiNames`: The names of metrics that have been replaced by this metric
- `type`: The type of this metric (TYPE_INTEGER, TYPE_FLOAT, TYPE_CURRENCY, etc.)
- `expression`: The mathematical expression for this derived metric (if applicable)
- `customDefinition`: True if the metric is a custom metric for this property
- `blockedReasons`: If reasons are specified, your access is blocked to this metric
- `category`: The category of the metric (e.g., EVENT, USER, SESSION, TRANSACTION, etc.)

## Usage

This is a **TYPE** returned by the getMetadata endpoint to describe available metrics. It provides detailed information about each metric including its data type, whether it's custom or standard, and usage instructions.

This file accompanies `MetricMetadata.schema.json` for a programmatic definition.
