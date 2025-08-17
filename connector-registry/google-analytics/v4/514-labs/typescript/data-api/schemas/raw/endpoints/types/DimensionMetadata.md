# DimensionMetadata (Type)

Explains a dimension and provides information about its usage.

## Properties

- `apiName`: The API name of the dimension. See [API Dimensions](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#dimensions)
- `uiName`: The display name of the dimension in the UI
- `description`: Description of how this dimension is used and calculated
- `deprecatedApiNames`: The names of dimensions that have been replaced by this dimension
- `customDefinition`: True if the dimension is a custom dimension for this property
- `category`: The category of the dimension (e.g., EVENT, USER, ITEM, etc.)

## Usage

This is a **TYPE** returned by the getMetadata endpoint to describe available dimensions. It provides detailed information about each dimension including whether it's custom or standard, its display name, and usage instructions.

This file accompanies `DimensionMetadata.schema.json` for a programmatic definition.
