# getMetadata (Endpoint)

Returns metadata for dimensions and metrics available in reporting methods. Used to explore the dimensions and metrics. In this method, a Google Analytics 4 Property Identifier is specified in the request, and the metadata response includes Custom dimensions and metrics as well as Universal metadata.

## Request

- `name`: The resource name of the metadata to retrieve. This name field is specified in the URL path and not URL parameters. Property is a numeric Google Analytics 4 Property identifier. Example: properties/1234/metadata

## Response

- `name`: Resource name of this metadata
- `dimensions`: The dimension descriptions, including:
  - apiName: The API name of the dimension
  - uiName: The display name of the dimension in the UI
  - description: Description of how this dimension is used and calculated
  - deprecatedApiNames: The names of dimensions that have been replaced by this dimension
  - customDefinition: True if the dimension is a custom dimension for this property
  - category: The category of the dimension
- `metrics`: The metric descriptions, including:
  - apiName: The API name of the metric
  - uiName: The display name of the metric in the UI
  - description: Description of how this metric is used and calculated
  - deprecatedApiNames: The names of metrics that have been replaced by this metric
  - type: The type of this metric (e.g., TYPE_INTEGER, TYPE_FLOAT, TYPE_SECONDS, etc.)
  - expression: The mathematical expression for this derived metric
  - customDefinition: True if the metric is a custom metric for this property
  - blockedReasons: If reasons are specified, your access is blocked to this metric
- `comparisons`: The comparison descriptions

## HTTP Details

- **Method**: GET
- **Path**: v1beta/{name=properties/*/metadata}

This is an **ENDPOINT** that provides metadata about available dimensions and metrics for Google Analytics 4 properties.

This file accompanies `getMetadata.schema.json` for a programmatic definition.
