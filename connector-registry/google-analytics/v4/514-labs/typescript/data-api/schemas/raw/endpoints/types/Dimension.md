# Dimension (Type)

Dimensions are attributes of your data. For example, the dimension city indicates the city from which an event originates. Dimension values in report responses are strings.

## Properties

Either `name` or `dimensionExpression` is specified:

- `name`: The name of the dimension. See the [API Dimensions](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#dimensions) for the list of dimension names
- `dimensionExpression`: One dimension can be the result of an expression of multiple dimensions. Supports:
  - `lowerCase`: Used to convert a dimension value to lower case
  - `upperCase`: Used to convert a dimension value to upper case  
  - `concatenate`: Used to combine dimension values together

## Usage

This is a **TYPE** used in report requests to specify which dimensions to include in the response. Dimensions define how data is grouped and segmented in reports.

## Examples

- Simple dimension: `{"name": "city"}`
- Expression dimension: `{"dimensionExpression": {"lowerCase": {"dimensionName": "country"}}}`
- Concatenated dimensions: `{"dimensionExpression": {"concatenate": {"dimensionNames": ["country", "city"], "delimiter": " - "}}}`

This file accompanies `Dimension.schema.json` for a programmatic definition.
