# OrderBy (Type)

Order bys define how rows will be sorted in the response. For example, ordering rows by descending event count is one ordering, and ordering rows by the event name string is a different ordering.

## Properties

One of the following must be specified:

- `metric`: Sorts results by a metric's values
  - `metricName`: A metric name in the request to order by
- `dimension`: Sorts results by a dimension's values
  - `dimensionName`: A dimension name in the request to order by
  - `orderType`: Controls the rule for dimension value ordering (ALPHANUMERIC, CASE_INSENSITIVE_ALPHANUMERIC, or NUMERIC)
- `pivot`: Sorts results by a metric's values within a pivot column group
  - `metricName`: In the response, order by this metric column
  - `pivotSelections`: Used to select a dimension name and value pivot

Additional properties:
- `desc`: If true, sorts by descending order

## Usage

This is a **TYPE** used in report requests to specify how results should be sorted. Multiple OrderBys can be specified to create complex sorting rules.

## Example

Sort by sessions descending:
```json
{
  "metric": {"metricName": "sessions"},
  "desc": true
}
```

This file accompanies `OrderBy.schema.json` for a programmatic definition.
