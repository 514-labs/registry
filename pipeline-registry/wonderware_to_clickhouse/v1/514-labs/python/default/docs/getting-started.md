# Getting Started with Wonderware to ClickHouse Pipeline

This guide will walk you through installing, configuring, and running the Wonderware to ClickHouse pipeline for the first time.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Starting the Pipeline](#starting-the-pipeline)
5. [Running Historical Backfill](#running-historical-backfill)
6. [Monitoring the Pipeline](#monitoring-the-pipeline)
7. [Querying Your Data](#querying-your-data)
8. [Next Steps](#next-steps)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Python 3.12 or higher**
  ```bash
  python3 --version  # Should show 3.12.x or higher
  ```

- **Moose CLI** - Data infrastructure framework
  ```bash
  bash -i <(curl -fsSL https://fiveonefour.com/install.sh) moose
  moose --version
  ```
  Install from: https://www.moosejs.com/getting-started

- **pip** - Python package manager (usually included with Python)
  ```bash
  pip --version
  ```

### Required Access

**Wonderware/AVEVA Historian SQL Server:**
- Hostname or IP address
- Port (usually 1433)
- Database name (usually "Runtime")
- Username and password with SELECT access to:
  - `TagRef` table (for tag discovery)
  - `History` view (for time-series data)

**Permissions needed:**
```sql
-- Verify you have SELECT permissions
SELECT TOP 1 * FROM TagRef;
SELECT TOP 1 * FROM History;
```

### Optional (Recommended)

Moose will automatically start local instances if not already running:
- **ClickHouse** - Time-series database
- **Redis** - For caching tag lists
- **Temporal** - Workflow orchestration

You can also use external instances by setting environment variables.

## Installation

### Step 1: Download the Pipeline

**Option A: Using Moose Registry (Recommended)**
```bash
moose pipeline install wonderware_to_clickhouse
cd wonderware_to_clickhouse/v1/514-labs/python/default
```

**Option B: Clone from GitHub**
```bash
git clone https://github.com/514-labs/registry.git
cd registry/pipeline-registry/wonderware_to_clickhouse/v1/514-labs/python/default
```

### Step 2: Create Virtual Environment (Recommended)

```bash
# Create virtual environment
python3 -m venv .venv

# Activate it (macOS/Linux)
source .venv/bin/activate

# Activate it (Windows)
.venv\Scripts\activate

# Your prompt should now show (.venv)
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- `moose-cli` and `moose-lib` - Moose framework
- `pydantic` - Data validation
- `sqlalchemy`, `python-tds`, `tenacity` - Wonderware connector dependencies
- `clickhouse-connect` - ClickHouse client
- `redis` - Redis caching
- `pytest` - Testing framework

### Step 4: Verify Installation

```bash
# Check Python dependencies
pip list | grep -E "moose|sqlalchemy|pydantic|clickhouse"

# Check Moose CLI
moose --version
```

## Configuration

### Understanding Configuration Split

The pipeline uses **two separate configuration namespaces**:

1. **Connector Configuration** (`WONDERWARE_*`) - For Wonderware SQL Server connection
2. **Pipeline Configuration** (`WONDERWARE_PIPELINE_*`) - For pipeline behavior

This separation allows the connector to be reused by other pipelines without conflicts.

### Step 1: Configure Wonderware Connector

Set these environment variables for SQL Server access:

```bash
# Required
export WONDERWARE_HOST=your-sql-server-hostname
export WONDERWARE_USERNAME=your-username
export WONDERWARE_PASSWORD=your-password

# Optional (with defaults)
export WONDERWARE_PORT=1433
export WONDERWARE_DATABASE=Runtime
export WONDERWARE_DRIVER=mssql+pytds
```

**Security Note:** Never commit passwords to git. Use a `.env` file (add to `.gitignore`) or a secrets manager.

### Step 2: Configure Pipeline Behavior (Optional)

Tune pipeline performance and behavior:

```bash
# Tag processing
export WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=10          # Tags per batch (10-50)
export WONDERWARE_PIPELINE_TAG_CACHE_TTL=3600         # Cache duration (seconds)

# Historical backfill
export WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS=1      # Days per chunk (1-7)
export WONDERWARE_PIPELINE_BACKFILL_OLDEST_TIME="2025-01-01 00:00:00"

# Sync schedule
export WONDERWARE_PIPELINE_SYNC_SCHEDULE="*/1 * * * *"  # Cron expression
```

### Step 3: Configure External Services (Optional)

If using external ClickHouse or Redis:

```bash
# ClickHouse (optional)
export CLICKHOUSE_HOST=localhost
export CLICKHOUSE_PORT=18123
export CLICKHOUSE_USER=default
export CLICKHOUSE_PASSWORD=
export CLICKHOUSE_DB=local

# Redis (optional)
export REDIS_HOST=localhost
export REDIS_PORT=6379
```

### Step 4: Create .env File (Recommended)

Create a `.env` file in the project root:

```bash
# .env
# Connector Configuration
WONDERWARE_HOST=192.168.1.100
WONDERWARE_USERNAME=historian_reader
WONDERWARE_PASSWORD=SecurePassword123
WONDERWARE_PORT=1433
WONDERWARE_DATABASE=Runtime

# Pipeline Configuration
WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=20
WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS=7
WONDERWARE_PIPELINE_TAG_CACHE_TTL=7200
WONDERWARE_PIPELINE_BACKFILL_OLDEST_TIME=2024-01-01 00:00:00
```

Then load it:
```bash
source .env
```

**Important:** Add `.env` to your `.gitignore`:
```bash
echo ".env" >> .gitignore
```

## Starting the Pipeline

### Step 1: Test Connector Configuration

Before starting the full pipeline, test your Wonderware connection:

```bash
python3 -c "
from wonderware import WonderwareConnector

connector = WonderwareConnector.build_from_env()

if connector.test_connection():
    print('✓ Connection successful!')
    status = connector.get_status()
    print(f'  Host: {status.host}')
    print(f'  Database: {status.database}')
    print(f'  Tags: {status.tag_count}')
else:
    print('✗ Connection failed')
    print('  Check your WONDERWARE_* environment variables')

connector.close()
"
```

Expected output:
```
✓ Connection successful!
  Host: 192.168.1.100
  Database: Runtime
  Tags: 150
```

### Step 2: Start Moose Development Server

```bash
moose dev
```

This command will:
1. ✅ Validate your configuration
2. ✅ Start ClickHouse (if not running)
3. ✅ Start Redis (if not running)
4. ✅ Create ClickHouse tables (`WonderwareHistory`, `WonderwareHistoryAggregated`, `MachineData`)
5. ✅ Start Temporal workflow engine
6. ✅ Launch API server on http://localhost:4000
7. ✅ Auto-start incremental sync workflow (runs every 1 minute)

You should see output like:
```
🚀 Starting Moose...
✓ ClickHouse started on port 18123
✓ Redis started on port 6379
✓ Created table: WonderwareHistory
✓ Created table: WonderwareHistoryAggregated
✓ Created table: MachineData
✓ Temporal server started on port 8080
✓ API server started on port 4000
✓ Workflows registered: wonderware_backfill, wonderware_current_sync
✓ Sync workflow started (runs every 1 minute)

🎉 Moose is ready!
   API: http://localhost:4000
   Temporal UI: http://localhost:8080
```

### Step 3: Verify Pipeline is Running

**Check API health:**
```bash
curl http://localhost:4000/consumption/wonderware_status
```

Expected response (before backfill):
```json
{
  "total_tags": 0,
  "total_data_points": 0,
  "oldest_data": null,
  "newest_data": null,
  "data_span_days": null
}
```

**Check Temporal UI:**
1. Open http://localhost:8080 in your browser
2. You should see `wonderware_current_sync` workflow running
3. Check "Running" tab to see active workflows

## Running Historical Backfill

The sync workflow only captures new data. To load historical data, run a backfill workflow.

### Step 1: Open Temporal UI

Navigate to http://localhost:8080

### Step 2: Start Backfill Workflow

1. Click **"Start Workflow"** button (top right)
2. Fill in the form:
   - **Workflow Type**: `wonderware_backfill`
   - **Workflow ID**: `backfill-2025-01-01` (or leave empty for auto-generated)
   - **Task Queue**: `default` (or leave empty)
   - **Workflow Input**:
     ```json
     {
       "oldest_time": "2025-01-01 00:00:00"
     }
     ```
3. Click **"Start Workflow"**

### Step 3: Monitor Progress

The workflow will show 4 tasks:

**Task 1: Discover Tags** (~10 seconds)
```
Status: Running → Completed
Output: {"tags": ["Temperature_01", "Pressure_02", ...], "oldest_time": "2025-01-01 00:00:00"}
```

**Task 2: Chunk Date Ranges** (~1 second)
```
Status: Running → Completed
Output: {
  "tags": [...],
  "date_ranges": [
    ["2025-01-01T00:00:00", "2025-01-02T00:00:00"],
    ["2025-01-02T00:00:00", "2025-01-03T00:00:00"],
    ...
  ],
  "tag_chunks": [[...10 tags...], [...10 tags...], ...]
}
```

**Task 3: Fetch and Insert** (longest, depends on data volume)
```
Status: Running...
Logs:
  Processing chunk 1/450: 2025-01-01 - 2025-01-02, tags: 10
  Inserted 1,234 rows
  Processing chunk 2/450: 2025-01-01 - 2025-01-02, tags: 10
  Inserted 1,456 rows
  ...
```

**Task 4: Finalize** (~1 second)
```
Status: Completed
Output: {
  "status": "completed",
  "total_rows": 3896400,
  "processed_chunks": 450,
  "completion_time": "2025-02-06T16:30:00"
}
```

### Step 4: Verify Backfill Completed

```bash
# Check pipeline status
curl http://localhost:4000/consumption/wonderware_status | jq

# Expected response:
{
  "total_tags": 150,
  "total_data_points": 3896400,
  "oldest_data": "2025-01-01 00:00:00",
  "newest_data": "2025-02-06 16:30:00",
  "data_span_days": 36.6
}
```

### Performance Tips

**For faster backfill:**

1. **Increase chunk sizes** (more data per query):
   ```bash
   export WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=50     # Up from 10
   export WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS=7  # Up from 1
   moose dev  # Restart to pick up changes
   ```

2. **Add SQL Server indexes** (if you have admin access):
   ```sql
   CREATE INDEX idx_history_datetime ON History(DateTime);
   CREATE INDEX idx_history_tagname ON History(TagName);
   ```

3. **Run during off-peak hours** to reduce load on SQL Server

**Expected throughput:**
- Small dataset (50 tags, 7 days): ~15 minutes, 40K rows/min
- Medium dataset (150 tags, 30 days): ~2 hours, 50K rows/min
- Large dataset (500 tags, 365 days): ~12 hours, 60K rows/min

## Monitoring the Pipeline

### Real-Time Monitoring with Temporal UI

**URL:** http://localhost:8080

**What to monitor:**

1. **Sync Workflow Health**:
   - Go to "Workflows" tab
   - Filter by `wonderware_current_sync`
   - Should see executions every 1 minute
   - Check for any failures (red status)

2. **Backfill Progress**:
   - Go to "Workflows" tab
   - Filter by `wonderware_backfill`
   - Click on running workflow to see task progress
   - View logs in "Event History" tab

3. **Error Debugging**:
   - Click on failed workflow
   - Go to "Event History" tab
   - Look for `ActivityTaskFailed` events
   - View error message and stack trace

### API Monitoring

**Check overall health:**
```bash
curl http://localhost:4000/consumption/wonderware_status | jq
```

**Check data freshness:**
```bash
# Get newest data timestamp
newest=$(curl -s http://localhost:4000/consumption/wonderware_status | jq -r '.newest_data')
echo "Last data received: $newest"

# Alert if data is stale (> 5 minutes)
```

**Check specific tag:**
```bash
curl "http://localhost:4000/consumption/wonderware_status?tag_name=Temperature_01" | jq
```

### Log Monitoring

**Moose application logs:**
```bash
tail -f .moose/logs/moose.log
```

**Filter for errors:**
```bash
grep -i "error\|exception\|failed" .moose/logs/moose.log
```

**Watch sync workflow:**
```bash
tail -f .moose/logs/moose.log | grep "wonderware_sync"
```

## Querying Your Data

### Using the REST API

**List all tags:**
```bash
curl http://localhost:4000/consumption/wonderware_tags | jq
```

**Query time-series data:**
```bash
curl "http://localhost:4000/consumption/wonderware_timeseries?\
tag_name=Temperature_01&\
date_from=2025-02-06T12:00:00&\
date_to=2025-02-06T13:00:00&\
limit=100" | jq
```

**Response:**
```json
{
  "data": [
    {
      "DateTime": "2025-02-06T12:00:00",
      "TagName": "Temperature_01",
      "Value": 75.3,
      "Quality": 192
    },
    ...
  ],
  "count": 100,
  "tag_name": "Temperature_01"
}
```

### Using ClickHouse Directly

**Connect to ClickHouse:**
```bash
clickhouse-client --host localhost --port 19000
```

**Query raw data:**
```sql
-- Latest reading for a tag
SELECT *
FROM WonderwareHistory
WHERE TagName = 'Temperature_01'
ORDER BY DateTime DESC
LIMIT 1;

-- Average over 1 hour
SELECT
  avg(Value) AS avg_temp,
  min(Value) AS min_temp,
  max(Value) AS max_temp,
  count() AS reading_count
FROM WonderwareHistory
WHERE TagName = 'Temperature_01'
  AND DateTime >= '2025-02-06 12:00:00'
  AND DateTime < '2025-02-06 13:00:00';
```

**Query aggregated data (faster for large time ranges):**
```sql
-- Daily averages for last 30 days
SELECT
  toDate(minute_timestamp) AS day,
  avg(avg_value) AS daily_avg
FROM WonderwareHistoryAggregated
WHERE TagName = 'Temperature_01'
  AND minute_timestamp >= now() - INTERVAL 30 DAY
GROUP BY day
ORDER BY day;
```

**Export to CSV:**
```sql
SELECT *
FROM WonderwareHistory
WHERE TagName = 'Temperature_01'
  AND DateTime >= '2025-02-06 00:00:00'
FORMAT CSV
INTO OUTFILE '/tmp/temperature_data.csv';
```

### Using Python

```python
from wonderware import WonderwareConnector
import clickhouse_connect

# Connect to ClickHouse
client = clickhouse_connect.get_client(
    host='localhost',
    port=18123,
    database='local'
)

# Query data
result = client.query('''
    SELECT DateTime, TagName, Value
    FROM WonderwareHistory
    WHERE TagName = 'Temperature_01'
      AND DateTime >= '2025-02-06 00:00:00'
    ORDER BY DateTime DESC
    LIMIT 100
''')

# Convert to pandas DataFrame
df = result.result_set.to_pandas()
print(df.head())

# Calculate statistics
print(f"Mean: {df['Value'].mean()}")
print(f"Std: {df['Value'].std()}")
```

## Next Steps

Now that your pipeline is running:

### 1. Set Up Monitoring

- **Create Grafana dashboards** for real-time visualization
- **Set up alerts** for stale data or workflow failures
- **Monitor SQL Server load** and optimize queries if needed

### 2. Optimize Performance

See [Configuration Guide](configuration.md) for tuning options:
- Adjust chunk sizes for your data volume
- Configure caching TTLs
- Optimize ClickHouse partitioning

### 3. Explore Advanced Features

- **Create materialized views** in ClickHouse for pre-aggregations
- **Add custom workflows** for specific data processing needs
- **Build custom APIs** on top of the data

### 4. Production Deployment

See [Deployment Guide](deployment.md) for:
- Production configuration best practices
- Security hardening
- High availability setup
- Backup and recovery

### 5. Learn More

- [Configuration Guide](configuration.md) - Detailed configuration options
- [Workflows Guide](workflows.md) - Deep dive into workflows
- [API Reference](apis.md) - Complete API documentation
- [Connector Documentation](../../../../../../../connector-registry/wonderware/v1/514-labs/python/default/README.md)

## Troubleshooting

### Issue: "Cannot connect to SQL Server"

**Symptoms:**
- Connector test fails
- Workflows fail immediately
- Error: `OperationalError: (20009, b'DB-Lib error...')`

**Solutions:**

1. **Verify network connectivity:**
   ```bash
   telnet $WONDERWARE_HOST 1433
   # Should connect. Press Ctrl+] then 'quit' to exit
   ```

2. **Check credentials:**
   ```bash
   echo $WONDERWARE_HOST
   echo $WONDERWARE_USERNAME
   # (Don't echo password!)
   ```

3. **Test with SQL Server tools:**
   ```bash
   sqlcmd -S $WONDERWARE_HOST -U $WONDERWARE_USERNAME -P $WONDERWARE_PASSWORD
   # Try: SELECT @@VERSION
   ```

4. **Check SQL Server configuration:**
   - Ensure TCP/IP protocol is enabled
   - Verify SQL Server authentication mode (mixed mode required for username/password)
   - Check firewall allows port 1433

### Issue: "No data after backfill"

**Symptoms:**
- Backfill completes successfully
- `wonderware_status` shows 0 data points
- ClickHouse table is empty

**Solutions:**

1. **Check if tags exist in Wonderware:**
   ```python
   from wonderware import WonderwareConnector
   connector = WonderwareConnector.build_from_env()
   tags = connector.discover_tags()
   print(f"Found {len(tags)} tags")
   connector.close()
   ```

2. **Check if data exists for date range:**
   - Verify `WONDERWARE_PIPELINE_BACKFILL_OLDEST_TIME` is within your data range
   - Check Wonderware has data for those tags/dates

3. **Check Temporal workflow logs:**
   - Go to http://localhost:8080
   - Find backfill workflow
   - Check "Event History" for errors

4. **Query ClickHouse directly:**
   ```sql
   SELECT COUNT(*) FROM local.WonderwareHistory;
   ```

### Issue: "Sync workflow stopped"

**Symptoms:**
- No new data appearing
- `newest_data` timestamp is stale
- Temporal UI shows no recent sync executions

**Solutions:**

1. **Check if Moose is running:**
   ```bash
   ps aux | grep moose
   ```

2. **Restart Moose:**
   ```bash
   # Stop with Ctrl+C, then:
   moose dev
   ```

3. **Check Temporal UI:**
   - Verify `wonderware_current_sync` workflow is scheduled
   - Look for any error messages

### Issue: "Redis connection failed"

**Symptoms:**
- Warning: `redis.exceptions.ConnectionError`
- Sync is slower than expected

**Solutions:**

1. **Start Redis:**
   ```bash
   # Via Docker
   docker run -d -p 6379:6379 redis:7

   # Or via Homebrew (macOS)
   brew services start redis
   ```

2. **Pipeline will work without Redis** - tags will be fetched from SQL Server each time (slower but functional)

### Issue: "Backfill is very slow"

**Solutions:**

See [Performance Tuning](#performance-tips) section above.

Key settings to adjust:
```bash
export WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=50
export WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS=7
```

### Need More Help?

- **Check detailed troubleshooting:** See main [README](../README.md#troubleshooting)
- **Connector issues:** See [Connector Troubleshooting](../../../../../../../connector-registry/wonderware/v1/514-labs/python/default/README.md#troubleshooting)
- **GitHub Issues:** https://github.com/514-labs/registry/issues
- **Moose Documentation:** https://docs.moosejs.com

---

**Congratulations!** 🎉 Your Wonderware to ClickHouse pipeline is now running. Data is flowing from your historian into ClickHouse for analysis and visualization.
