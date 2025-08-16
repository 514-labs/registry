# ResponseMetaData (Type)

Response metadata for the report.

## Properties

- `dataLossFromOtherRow`: If true, the report results may be affected by data loss from the "other" row. This indicates that the report contains (other) row
- `schemaRestrictionResponse`: Describes the schema restrictions actively enforced in creating this report, such as restrictions on metric combinations
- `currencyCode`: The currency code used in this report (ISO 4217 format)
- `timeZone`: The property's time zone (e.g., America/Los_Angeles)
- `emptyReason`: If empty reason is specified, the report is empty for this reason
- `subjectToThresholding`: If true, this report is subject to thresholding and only returns data that meets minimum aggregation thresholds

## Usage

This is a **TYPE** included in report responses to provide metadata about the report results. It helps understand data quality, restrictions, and processing information.

This file accompanies `ResponseMetaData.schema.json` for a programmatic definition.
