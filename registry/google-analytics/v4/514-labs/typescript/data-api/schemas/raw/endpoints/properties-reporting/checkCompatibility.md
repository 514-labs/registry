# checkCompatibility (Endpoint)

This compatibility method lists dimensions and metrics that can be added to a report request and maintain compatibility. This method fails if the request's dimensions and metrics are incompatible.

## Request

- `property`: A Google Analytics 4 property identifier whose events are tracked. Example: properties/1234
- `dimensions`: The dimensions to check compatibility. This field is optional
- `metrics`: The metrics to check compatibility. This field is optional  
- `dimensionFilter`: The filter clause of dimensions. Applied at post aggregation phase, similar to SQL having-clause
- `metricFilter`: The filter clause of metrics. Applied at post aggregation phase, similar to SQL having-clause
- `compatibilityFilter`: Filters the dimensions and metrics in the response to just this compatibility. Commonly used to filter to only compatible dimensions & metrics

## Response

- `dimensionCompatibilities`: The compatibility for each dimension
- `metricCompatibilities`: The compatibility for each metric

Each compatibility item contains:
- Metadata about the dimension/metric
- Compatibility status (COMPATIBLE or INCOMPATIBLE)

## HTTP Details

- **Method**: POST
- **Path**: v1beta/{property=properties/*}:checkCompatibility

This is an **ENDPOINT** that verifies dimension and metric compatibility for Google Analytics 4 reporting. Use this to ensure your report requests will succeed before making them.

This file accompanies `checkCompatibility.schema.json` for a programmatic definition.
