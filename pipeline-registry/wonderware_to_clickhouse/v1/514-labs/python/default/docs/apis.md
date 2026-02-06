# API Reference

Complete reference for the Wonderware to ClickHouse pipeline REST APIs.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Wonderware Status](#get-consumptionwonderware_status)
  - [Wonderware Timeseries](#get-consumptionwonderware_timeseries)
  - [Wonderware Tags](#get-consumptionwonderware_tags)
  - [Machine APIs](#machine-apis)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)

## Overview

The pipeline exposes REST APIs on **http://localhost:4000** for querying and monitoring Wonderware data.

**Base URL:** `http://localhost:4000/consumption/`

**Response Format:** JSON

**All endpoints support:**
- ✅ CORS (Cross-Origin Resource Sharing)
- ✅ Content negotiation (JSON, CSV)
- ✅ Query parameter validation

## Authentication

Currently, the APIs are **unauthenticated** for development.

For production deployment, add authentication middleware:

```python
# app/main.py
from moose_lib import Moose, MooseConfig

app = Moose(MooseConfig())

# Add authentication middleware
@app.middleware("http")
async def auth_middleware(request, call_next):
    # Implement your auth logic
    api_key = request.headers.get("X-API-Key")
    if not api_key or not verify_api_key(api_key):
        return JSONResponse(
            status_code=401,
            content={"error": "Unauthorized"}
        )
    return await call_next(request)
```

## Endpoints

### GET /consumption/wonderware_status

Get pipeline health and summary statistics.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tag_name` | string | No | Filter statistics by specific tag |

#### Response

```typescript
{
  total_tags: number,          // Total unique tags in ClickHouse
  total_data_points: number,   // Total rows in WonderwareHistory
  oldest_data: string | null,  // ISO datetime of oldest data
  newest_data: string | null,  // ISO datetime of newest data
  data_span_days: number | null,  // Days between oldest and newest
  tag_filter: string | null    // Tag name if filtered
}
```

#### Examples

**Get overall status:**
```bash
curl http://localhost:4000/consumption/wonderware_status
```

Response:
```json
{
  "total_tags": 150,
  "total_data_points": 3896400,
  "oldest_data": "2025-01-01T00:00:00",
  "newest_data": "2025-02-06T16:30:00",
  "data_span_days": 36.6875,
  "tag_filter": null
}
```

**Get status for specific tag:**
```bash
curl "http://localhost:4000/consumption/wonderware_status?tag_name=Temperature_01"
```

Response:
```json
{
  "total_tags": 1,
  "total_data_points": 25976,
  "oldest_data": "2025-01-01T00:00:00",
  "newest_data": "2025-02-06T16:30:00",
  "data_span_days": 36.6875,
  "tag_filter": "Temperature_01"
}
```

#### Use Cases

- **Health monitoring:** Check if pipeline is running and data is fresh
- **Alerting:** Alert if `newest_data` is too old
- **Dashboards:** Display overall pipeline metrics
- **Tag verification:** Verify specific tag has data

#### ClickHouse Query

```sql
SELECT
  COUNT(DISTINCT TagName) AS total_tags,
  COUNT(*) AS total_data_points,
  min(DateTime) AS oldest_data,
  max(DateTime) AS newest_data,
  dateDiff('second', min(DateTime), max(DateTime)) / 86400.0 AS data_span_days
FROM WonderwareHistory
WHERE (tag_filter IS NULL OR TagName = tag_filter)
```

---

### GET /consumption/wonderware_timeseries

Query time-series data for a specific tag.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tag_name` | string | **Yes** | Sensor tag identifier |
| `date_from` | string | **Yes** | Start datetime (ISO 8601) |
| `date_to` | string | **Yes** | End datetime (ISO 8601) |
| `limit` | integer | No | Max rows to return (default: 1000, max: 10000) |

#### Response

```typescript
{
  data: Array<{
    DateTime: string,        // ISO datetime
    TagName: string,
    Value: number | null,
    VValue: string | null,
    Quality: number | null,
    // ... additional fields
  }>,
  count: number,             // Number of rows returned
  tag_name: string           // Requested tag name
}
```

#### Examples

**Query 1 hour of data:**
```bash
curl "http://localhost:4000/consumption/wonderware_timeseries?\
tag_name=Temperature_01&\
date_from=2025-02-06T12:00:00&\
date_to=2025-02-06T13:00:00&\
limit=100"
```

Response:
```json
{
  "data": [
    {
      "DateTime": "2025-02-06T12:00:00",
      "TagName": "Temperature_01",
      "Value": 75.3,
      "VValue": null,
      "Quality": 192,
      "QualityDetail": "Good",
      "wwRetrievalMode": "Delta"
    },
    {
      "DateTime": "2025-02-06T12:00:01",
      "TagName": "Temperature_01",
      "Value": 75.4,
      "VValue": null,
      "Quality": 192,
      "QualityDetail": "Good",
      "wwRetrievalMode": "Delta"
    }
  ],
  "count": 100,
  "tag_name": "Temperature_01"
}
```

**Query with Python:**
```python
import requests

response = requests.get(
    "http://localhost:4000/consumption/wonderware_timeseries",
    params={
        "tag_name": "Temperature_01",
        "date_from": "2025-02-06T12:00:00",
        "date_to": "2025-02-06T13:00:00",
        "limit": 1000
    }
)

data = response.json()
print(f"Retrieved {data['count']} data points")

# Convert to pandas DataFrame
import pandas as pd
df = pd.DataFrame(data['data'])
print(df.describe())
```

#### Use Cases

- **Data export:** Export sensor data to CSV/JSON
- **Visualization:** Feed data to charting libraries
- **Analysis:** Statistical analysis of sensor readings
- **Debugging:** Investigate data quality issues

#### ClickHouse Query

```sql
SELECT
  DateTime,
  TagName,
  Value,
  VValue,
  Quality,
  QualityDetail,
  OpcQuality,
  wwTagKey,
  wwRetrievalMode,
  wwTimeZone
FROM WonderwareHistory
WHERE TagName = :tag_name
  AND DateTime >= :date_from
  AND DateTime <= :date_to
ORDER BY DateTime ASC
LIMIT :limit
```

#### Performance Tips

- **Use smaller date ranges** for faster queries
- **Use aggregated table** for large time ranges:
  ```bash
  # Query aggregated data instead
  curl "http://localhost:4000/consumption/wonderware_aggregated?..."
  ```
- **Add indexes** if queries are slow:
  ```sql
  -- ClickHouse automatically creates indexes based on ORDER BY
  -- WonderwareHistory is ordered by (TagName, DateTime)
  ```

---

### GET /consumption/wonderware_tags

List all discovered sensor tags.

#### Parameters

None

#### Response

```typescript
{
  tags: string[],            // Array of tag names
  total: number              // Total count
}
```

#### Examples

**Get all tags:**
```bash
curl http://localhost:4000/consumption/wonderware_tags
```

Response:
```json
{
  "tags": [
    "Temperature_01",
    "Temperature_02",
    "Pressure_01",
    "Pressure_02",
    "Flow_01",
    "Level_01"
  ],
  "total": 150
}
```

**With Python:**
```python
import requests

response = requests.get("http://localhost:4000/consumption/wonderware_tags")
data = response.json()

print(f"Total tags: {data['total']}")
for tag in data['tags'][:10]:
    print(f"  - {tag}")
```

#### Use Cases

- **Tag discovery:** Find available sensors
- **Autocomplete:** Populate tag selection dropdowns
- **Data exploration:** Browse available data
- **Validation:** Verify tag exists before querying

#### ClickHouse Query

```sql
SELECT DISTINCT TagName
FROM WonderwareHistory
ORDER BY TagName ASC
```

---

## Machine APIs

Additional APIs for querying machine metadata (from `MachineData` table).

### GET /consumption/machine

List all machines.

#### Response

```typescript
{
  machines: Array<{
    machine: string,
    machine_type: string,
    line: string,
    location: string,
    site: string
  }>,
  total: number
}
```

#### Example

```bash
curl http://localhost:4000/consumption/machine
```

---

### GET /consumption/machine_type

List all machine types.

#### Response

```typescript
{
  machine_types: string[],
  total: number
}
```

---

### GET /consumption/sensor_data

Query sensor data by machine.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `machine` | string | **Yes** | Machine identifier |
| `date_from` | string | No | Start datetime |
| `date_to` | string | No | End datetime |

#### Response

```typescript
{
  data: Array<{
    timestamp: string,
    machine: string,
    sensor_tag: string,
    sensor_type: string,
    value: number
  }>,
  count: number
}
```

---

### GET /consumption/sensor_type

List all sensor types.

#### Response

```typescript
{
  sensor_types: string[],
  total: number
}
```

---

## Error Handling

### Error Response Format

All errors return:

```json
{
  "error": "Error message",
  "status": 400,
  "details": "Additional context"
}
```

### HTTP Status Codes

| Status | Meaning | When |
|--------|---------|------|
| `200` | OK | Request succeeded |
| `400` | Bad Request | Invalid parameters |
| `404` | Not Found | Endpoint not found |
| `500` | Internal Server Error | Server error |
| `503` | Service Unavailable | ClickHouse not available |

### Common Errors

**Missing required parameter:**
```json
{
  "error": "Missing required parameter: tag_name",
  "status": 400
}
```

**Invalid date format:**
```json
{
  "error": "Invalid date format. Use ISO 8601 (YYYY-MM-DDTHH:MM:SS)",
  "status": 400
}
```

**Tag not found:**
```json
{
  "error": "Tag not found: InvalidTag",
  "status": 404
}
```

**ClickHouse connection error:**
```json
{
  "error": "Database connection failed",
  "status": 503,
  "details": "ClickHouse is not responding"
}
```

## Rate Limiting

**Current:** No rate limiting

**Production recommendation:** Add rate limiting middleware:

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.get("/consumption/wonderware_timeseries")
@limiter.limit("100/minute")
async def wonderware_timeseries(request: Request, ...):
    # ...
```

## Examples

### Example: Real-Time Dashboard

```javascript
// React component for real-time temperature display
import { useEffect, useState } from 'react';

function TemperatureDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date();
      const oneHourAgo = new Date(now - 3600000);

      const response = await fetch(
        `http://localhost:4000/consumption/wonderware_timeseries?` +
        `tag_name=Temperature_01&` +
        `date_from=${oneHourAgo.toISOString()}&` +
        `date_to=${now.toISOString()}&` +
        `limit=1000`
      );

      const json = await response.json();
      setData(json.data);
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  const latestValue = data[data.length - 1]?.Value || 'N/A';

  return (
    <div>
      <h1>Temperature: {latestValue}°C</h1>
      <LineChart data={data} />
    </div>
  );
}
```

### Example: Data Export Script

```python
#!/usr/bin/env python3
"""Export Wonderware data to CSV."""

import requests
import csv
from datetime import datetime, timedelta

def export_to_csv(tag_name, start_date, end_date, output_file):
    """Export tag data to CSV."""

    response = requests.get(
        "http://localhost:4000/consumption/wonderware_timeseries",
        params={
            "tag_name": tag_name,
            "date_from": start_date,
            "date_to": end_date,
            "limit": 10000
        }
    )

    data = response.json()['data']

    # Write to CSV
    with open(output_file, 'w', newline='') as f:
        if data:
            writer = csv.DictWriter(f, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)

    print(f"Exported {len(data)} rows to {output_file}")

if __name__ == "__main__":
    export_to_csv(
        tag_name="Temperature_01",
        start_date="2025-02-01T00:00:00",
        end_date="2025-02-06T23:59:59",
        output_file="temperature_export.csv"
    )
```

### Example: Health Check Monitoring

```bash
#!/bin/bash
# health_check.sh - Monitor pipeline health

STATUS_URL="http://localhost:4000/consumption/wonderware_status"

# Fetch status
status=$(curl -s $STATUS_URL)

# Extract newest_data
newest=$(echo $status | jq -r '.newest_data')

# Calculate age
now=$(date +%s)
newest_ts=$(date -d "$newest" +%s 2>/dev/null || echo 0)
age=$((now - newest_ts))

# Alert if stale (> 5 minutes)
if [ $age -gt 300 ]; then
  echo "ALERT: Data is stale ($age seconds old)"
  # Send alert via email, Slack, etc.
  exit 1
else
  echo "OK: Data is fresh ($age seconds old)"
  exit 0
fi
```

Run via cron:
```cron
*/5 * * * * /path/to/health_check.sh
```

### Example: Grafana Integration

Configure Grafana to query the APIs:

**1. Add JSON data source:**
- Type: JSON API
- URL: `http://localhost:4000`

**2. Create query:**
```
Endpoint: /consumption/wonderware_timeseries
Params:
  tag_name: Temperature_01
  date_from: $__from
  date_to: $__to
  limit: 10000

JSONPath: $.data[*]
```

**3. Add to dashboard:**
- Time series graph
- Auto-refresh every 1 minute

## Testing APIs

### Using curl

```bash
# Test status endpoint
curl http://localhost:4000/consumption/wonderware_status

# Test timeseries with parameters
curl -G http://localhost:4000/consumption/wonderware_timeseries \
  --data-urlencode "tag_name=Temperature_01" \
  --data-urlencode "date_from=2025-02-06T00:00:00" \
  --data-urlencode "date_to=2025-02-06T01:00:00"

# Test tags endpoint
curl http://localhost:4000/consumption/wonderware_tags
```

### Using Python requests

```python
import requests

# Test all endpoints
def test_apis():
    base_url = "http://localhost:4000/consumption"

    # Status
    r = requests.get(f"{base_url}/wonderware_status")
    print(f"Status: {r.status_code}")
    print(r.json())

    # Tags
    r = requests.get(f"{base_url}/wonderware_tags")
    print(f"Tags: {r.json()['total']}")

    # Timeseries
    r = requests.get(
        f"{base_url}/wonderware_timeseries",
        params={
            "tag_name": "Temperature_01",
            "date_from": "2025-02-06T00:00:00",
            "date_to": "2025-02-06T01:00:00"
        }
    )
    print(f"Timeseries: {r.json()['count']} rows")

test_apis()
```

### Using Postman

Import this collection:

```json
{
  "info": { "name": "Wonderware Pipeline APIs" },
  "item": [
    {
      "name": "Get Status",
      "request": {
        "method": "GET",
        "url": "http://localhost:4000/consumption/wonderware_status"
      }
    },
    {
      "name": "Get Tags",
      "request": {
        "method": "GET",
        "url": "http://localhost:4000/consumption/wonderware_tags"
      }
    },
    {
      "name": "Get Timeseries",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:4000/consumption/wonderware_timeseries",
          "query": [
            { "key": "tag_name", "value": "Temperature_01" },
            { "key": "date_from", "value": "2025-02-06T00:00:00" },
            { "key": "date_to", "value": "2025-02-06T01:00:00" }
          ]
        }
      }
    }
  ]
}
```

## Related Documentation

- [Getting Started](getting-started.md)
- [Configuration Guide](configuration.md)
- [Workflows Guide](workflows.md)
