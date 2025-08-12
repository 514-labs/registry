# ADS-B Extracted Schemas

This directory contains processed/normalized schemas for aircraft data after connector processing.

## Extracted Aircraft Data

The connector returns the raw API data with minimal processing - primarily adding metadata and error handling:

```json
{
  "data": {
    "ac": [/* raw aircraft array */],
    "total": 123,
    "ctime": 1691234567,
    "ptime": 1691234568
  },
  "status": 200,
  "headers": {
    "content-type": "application/json",
    "x-ratelimit-remaining": "299"
  },
  "meta": {
    "timestamp": "2023-08-05T12:34:56.789Z",
    "duration": 245,
    "retryCount": 0,
    "requestId": "adsb-1691234567890-123",
    "rateLimit": {
      "limit": 300,
      "remaining": 299,
      "reset": "2023-08-05T12:35:00.000Z"
    }
  }
}
```

## Processing Notes

The ADS-B connector performs minimal data transformation:
- Wraps raw API responses in structured envelope
- Adds request correlation IDs and timing metadata
- Provides rate limiting information
- Handles error standardization

For ETL use cases, additional transformation would be implemented in `src/transform/` modules.