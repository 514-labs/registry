# Run Report

Returns a customized report of your Google Analytics event data.

## Endpoint

`POST /v1beta/properties/{propertyId}:runReport`

## Common Dimensions

- `date` - Date (YYYYMMDD format)
- `country` - Country name
- `city` - City name
- `deviceCategory` - Device category (desktop, mobile, tablet)
- `sessionSource` - Session source
- `sessionMedium` - Session medium
- `sessionCampaign` - Campaign name
- `pagePath` - Page path
- `pageTitle` - Page title

## Common Metrics

- `activeUsers` - Number of distinct users who visited your site or app
- `sessions` - Number of sessions
- `screenPageViews` - Total number of app screens or web pages viewed
- `conversions` - Total number of conversion events
- `totalRevenue` - Total revenue from purchases and subscriptions
- `engagementRate` - Percentage of engaged sessions
- `averageSessionDuration` - Average session duration in seconds

## Example Request

```json
{
  "dateRanges": [
    {
      "startDate": "7daysAgo",
      "endDate": "today"
    }
  ],
  "dimensions": [
    { "name": "date" },
    { "name": "country" }
  ],
  "metrics": [
    { "name": "activeUsers" },
    { "name": "sessions" }
  ],
  "limit": 100
}
```

## Example Response

```json
{
  "dimensionHeaders": [
    { "name": "date" },
    { "name": "country" }
  ],
  "metricHeaders": [
    { "name": "activeUsers", "type": "TYPE_INTEGER" },
    { "name": "sessions", "type": "TYPE_INTEGER" }
  ],
  "rows": [
    {
      "dimensionValues": [
        { "value": "20251015" },
        { "value": "United States" }
      ],
      "metricValues": [
        { "value": "1234" },
        { "value": "2345" }
      ]
    }
  ],
  "rowCount": 1,
  "metadata": {
    "currencyCode": "USD",
    "timeZone": "America/Los_Angeles"
  }
}
```
