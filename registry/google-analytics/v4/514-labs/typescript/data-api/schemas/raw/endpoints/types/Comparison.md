# Comparison (Type)

Defines a comparison segment. Multiple comparison segments may be requested in a report to compare dimension values in a report. For example, you might report the dimension `eventName` and the metric `eventCount`, and request a comparison on `deviceCategory=tablet`.

## Properties

- `name`: A saved name for this comparison. If unspecified, we will use the comparison_value
- `dimensionFilter`: A basic comparison filter. Only one of dimensionFilter or comparison is specified
- `comparison`: A saved comparison identified by the comparison's resource name. For example: 'comparisons/{comparison_id}'. Only one of dimensionFilter or comparison is specified

## Usage

This is a **TYPE** used in report requests to enable comparative analysis. Comparisons allow you to segment your data and compare metrics across different dimension values, such as comparing mobile vs desktop traffic or comparing different geographic regions.

This file accompanies `Comparison.schema.json` for a programmatic definition.
