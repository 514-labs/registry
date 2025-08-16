# DimensionValue (Type)

The value of a dimension.

## Properties

Either `value` or `oneValue` is populated:

- `value`: Value as a string if the dimension type is a string
- `oneValue`: If a dimension value represents a single value, this field is populated

## Usage

This is a **TYPE** that appears in report responses to represent the actual values of dimensions in each row. Each row contains an array of DimensionValues corresponding to the requested dimensions.

For example, if you request dimensions `["country", "city"]`, each row will contain two DimensionValues - one for the country value and one for the city value.

This file accompanies `DimensionValue.schema.json` for a programmatic definition.
