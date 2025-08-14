# CohortSpec (Type)

The specification of cohorts for a cohort report. Cohort reports create a time series of user retention for the cohort.

## Properties

- `cohorts`: The cohorts requested for the report. Each cohort consists of:
  - `name`: Assigns a name to this cohort. The dimension is added to the dimensionHeaders in the report response
  - `dimension`: The dimension used by cohort. Required and only supports `firstSessionDate`
  - `dateRange`: The cohort selects users whose first session date is between start date and end date (inclusive)
- `cohortsRange`: Defines the selection criteria for the cohorts:
  - `granularity`: The granularity used to interpret the startOffset and endOffset (DAILY, WEEKLY, or MONTHLY)
  - `startOffset`: The start offset relative to the first cohort date
  - `endOffset`: The end offset relative to the first cohort date
- `cohortReportSettings`: Optional settings for the cohort report:
  - `accumulate`: If true, accumulates cohort data over the cohort's lifetime; otherwise data is shown only for the specified relative date range

## Usage

This is a **TYPE** used in various reporting endpoints to specify cohort analysis parameters. Cohort analysis helps you understand user retention by grouping users based on their first session date and tracking their behavior over time.

This file accompanies `CohortSpec.schema.json` for a programmatic definition.
