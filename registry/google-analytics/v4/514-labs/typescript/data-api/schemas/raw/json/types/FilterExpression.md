# FilterExpression (Type)

To express dimension or metric filters, create a hierarchy of filters using logical AND, OR, and NOT operators.

## Properties

A FilterExpression contains one of:

- `andGroup`: The FilterExpressions in andGroup have an AND relationship
- `orGroup`: The FilterExpressions in orGroup have an OR relationship  
- `notExpression`: The FilterExpression is NOT of notExpression
- `filter`: A primitive filter that defines the actual filtering logic

## Filter Types

The `filter` property supports several filter types:

- `stringFilter`: For string matching with options like EXACT, BEGINS_WITH, ENDS_WITH, CONTAINS, FULL_REGEXP, PARTIAL_REGEXP
- `inListFilter`: Matches any value in a list of values
- `numericFilter`: For numeric comparisons (EQUAL, LESS_THAN, GREATER_THAN, etc.)
- `betweenFilter`: Matches values between a range (inclusive)

## Usage

This is a **TYPE** used in report requests to filter dimension values or metric values. Filters can be combined using logical operators to create complex filtering conditions.

## Examples

- Simple filter: `{"filter": {"fieldName": "country", "stringFilter": {"matchType": "EXACT", "value": "United States"}}}`
- AND group: `{"andGroup": {"expressions": [filter1, filter2]}}`
- Complex filter: Combining multiple filters with AND/OR/NOT operators

This file accompanies `FilterExpression.schema.json` for a programmatic definition.
