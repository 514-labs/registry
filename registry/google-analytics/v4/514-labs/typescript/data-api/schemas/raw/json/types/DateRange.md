# DateRange (Type)

A contiguous set of days: startDate, startDate + 1, ..., endDate. Requests are allowed up to 4 date ranges.

## Properties

- `startDate`: The inclusive start date for the query in the format YYYY-MM-DD. Cannot be after endDate. The format NdaysAgo, yesterday, or today is also accepted, and in that case, the date is inferred based on the property's reporting time zone
- `endDate`: The inclusive end date for the query in the format YYYY-MM-DD. Cannot be before startDate. The format NdaysAgo, yesterday, or today is also accepted, and in that case, the date is inferred based on the property's reporting time zone
- `name`: Assigns a name to this date range. The dimension dateRange is valued to this name in a report response. If set, cannot begin with date_range_ or RESERVED_. If not set, date ranges are named by their zero based index in the request: date_range_0, date_range_1, etc

## Usage

This is a **TYPE** used in report requests to specify the time period for data retrieval. Multiple date ranges can be specified to compare data across different time periods.

## Examples

- Fixed dates: `{"startDate": "2023-01-01", "endDate": "2023-01-31"}`
- Relative dates: `{"startDate": "7daysAgo", "endDate": "yesterday"}`
- Named range: `{"startDate": "30daysAgo", "endDate": "yesterday", "name": "last_month"}`

This file accompanies `DateRange.schema.json` for a programmatic definition.
