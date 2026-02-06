# Wonderware to ClickHouse Data Pipeline

> Production-grade pipeline for extracting time-series sensor data from Wonderware/AVEVA Historian (SQL Server) and loading it into ClickHouse with incremental sync, historical backfill, and comprehensive monitoring.

## 🎯 What's New

**This pipeline now uses the reusable [Wonderware Historian Connector](../../../../../../../connector-registry/wonderware/)** for all data access operations. The pipeline focuses exclusively on:
- ClickHouse storage and schema management
- Workflow orchestration (backfill + incremental sync)
- Data transformation and aggregation
- REST APIs for querying and monitoring

The connector handles:
- SQL Server connection management
- Tag discovery and caching
- Historical data extraction
- Connection pooling and circuit breaker patterns

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Workflows](#workflows)
- [Data Models](#data-models)
- [APIs](#apis)
- [Performance Tuning](#performance-tuning)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)
- [Testing](#testing)

## Features

### Core Capabilities

- ✅ **Reusable Connector** - Uses standalone Wonderware connector via symlink (can be shared across pipelines)
- ✅ **Automated tag discovery** - Queries Wonderware TagRef table for active tags (excludes system tags like `Sys*`)
- ✅ **Historical backfill** - 4-task DAG workflow for loading years of historical data with configurable chunking
- ✅ **Incremental sync** - 1-minute scheduled workflow with watermark-based sync (never reprocesses data)
- ✅ **Batch processing** - Configurable tag chunking (10-50 tags/batch) and date chunking (1-7 days/chunk)
- ✅ **Resilient connections** - Circuit breaker pattern and exponential backoff retry (3 retries, 2-30 second backoff)
- ✅ **Automatic deduplication** - Skip duplicate rows via `InsertOptions(skip_duplicates=True)`
- ✅ **Redis caching** - Tag lists cached for 1 hour to reduce SQL Server load
- ✅ **Monthly partitioning** - ClickHouse partitions by month for fast time-range queries
- ✅ **Automatic TTL** - Raw data expires after 90 days, aggregates after 2 years
- ✅ **Comprehensive logging** - Debug, info, warning, and error logs for all operations
- ✅ **Unit tested** - Complete test coverage for config, models, inserter, and connector

### What Makes This Production-Ready

1. **No data loss** - Watermark-based sync means you can restart workflows without missing or duplicating data
2. **Handles failures gracefully** - Connector circuit breaker and workflow retry logic handle transient errors
3. **Scales to millions of rows** - Tested with 150+ tags and 30+ days of data (50K+ rows/minute)
4. **Observable** - REST APIs show pipeline health, data freshness, and tag statistics
5. **Maintainable** - Clean separation: connector for data access, pipeline for storage/orchestration

## Quick Start

### Prerequisites

Before starting, ensure you have:
- Python 3.13+ installed
- Access to a Wonderware/AVEVA Historian SQL Server instance
- ClickHouse running (local via Docker or remote)
- Redis running (optional but recommended for tag caching)

### Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Set connector environment variables (for Wonderware connection)
export WONDERWARE_HOST=your-sql-server-host
export WONDERWARE_USERNAME=your-username
export WONDERWARE_PASSWORD=your-password

# Set pipeline environment variables (optional, for tuning)
export WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=10
export WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS=1

# Start the pipeline
moose dev
```

The pipeline will:
1. Start the Moose server on `http://localhost:4000`
2. Create ClickHouse tables (`WonderwareHistory`, `WonderwareHistoryAggregated`, `MachineData`)
3. Launch Temporal workflow engine on `http://localhost:8080`
4. Auto-start the incremental sync workflow (runs every 1 minute)

### Verify Installation

Check that the pipeline is running:

```bash
# Check pipeline status
curl http://localhost:4000/consumption/wonderware_status

# Expected response:
{
  "total_tags": 0,           # Will be 0 until you run backfill
  "total_data_points": 0,
  "oldest_data": null,
  "newest_data": null,
  "data_span_days": null
}
```

### Run Historical Backfill

Load historical data (one-time):

1. Open Temporal UI: http://localhost:8080
2. Click **"Start Workflow"**
3. Select workflow: `wonderware_backfill`
4. Enter input:
   ```json
   {
     "oldest_time": "2025-01-01 00:00:00"
   }
   ```
5. Click **"Run Workflow"**

Monitor progress in the Temporal UI. The workflow will:
- **Task 1**: Discover all active tags from SQL Server (via connector)
- **Task 2**: Split time range into 1-day chunks (configurable)
- **Task 3**: Fetch and insert data in parallel batches
- **Task 4**: Log completion statistics

For a detailed step-by-step guide, see [docs/getting-started.md](docs/getting-started.md).

## Architecture

### Component Overview

```
┌──────────────────────────────────────────────────────────┐
│                 WONDERWARE CONNECTOR                      │
│              (Reusable via Symlink)                       │
├──────────────────────────────────────────────────────────┤
│  • SQL Server connection pooling                         │
│  • Circuit breaker pattern                               │
│  • Tag discovery and caching                             │
│  • Historical data extraction                            │
│  • Connection health monitoring                          │
└───────────────────┬──────────────────────────────────────┘
                    │ Clean API
                    │ (from wonderware import WonderwareConnector)
                    ▼
┌──────────────────────────────────────────────────────────┐
│              WONDERWARE-TO-CLICKHOUSE PIPELINE           │
├──────────────────────────────────────────────────────────┤
│  • Workflow orchestration (backfill + sync)              │
│  • ClickHouse schema and storage                         │
│  • Data transformation and aggregation                   │
│  • REST APIs for querying                                │
│  • Monitoring and observability                          │
└──────────────────────────────────────────────────────────┘
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Wonderware SQL Server                     │
│                   (Runtime database)                         │
│  ┌────────────────┐              ┌─────────────────┐        │
│  │ TagRef Table   │              │  History View   │        │
│  │ (tag metadata) │              │  (time-series)  │        │
│  └────────┬───────┘              └─────────┬───────┘        │
└───────────┼──────────────────────────────┼─────────────────┘
            │                               │
            │ Tag Discovery                 │ Data Query
            │ (once per hour via Redis)     │ (every minute)
            ▼                               ▼
    ┌────────────────────────────────────────────────┐
    │      WONDERWARE CONNECTOR (via symlink)        │
    │  • WonderwareConnector.discover_tags()         │
    │  • WonderwareConnector.fetch_history_data()    │
    │  • Connection pooling + circuit breaker        │
    └────────────────┬───────────────────────────────┘
                     │
                     ▼
            ┌────────────────┐
            │  Redis Cache   │
            │  (tag lists)   │
            │  TTL: 1 hour   │
            └────────────────┘
                     │
                     ▼
    ┌────────────────────────────────────────────────┐
    │      WonderwareBatchInserter (Pipeline)        │
    │  • Convert dicts to Pydantic models            │
    │  • Batch insert with retry (3x, exp backoff)   │
    │  • Skip duplicates                             │
    └────────────────┬───────────────────────────────┘
                     │
                     ▼
    ┌─────────────────────────────────────────────────────────┐
    │                     ClickHouse                           │
    ├──────────────────────────────────────────────────────────┤
    │  WonderwareHistory (raw, 1-sec, 90-day TTL)             │
    │  WonderwareHistoryAggregated (1-min, 2-year TTL)        │
    │  MachineData (metadata, no TTL)                         │
    └─────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### Connector Layer (External)
- **`app/wonderware/`** - Symlink to connector
  - `WonderwareConnector` - High-level facade
  - `WonderwareConfig` - Connection configuration
  - `WonderwareReader` - Data extraction
  - `ConnectionPool` - Connection management with circuit breaker
  - For details, see [Wonderware Connector Documentation](../../../../../../../connector-registry/wonderware/v1/514-labs/python/default/README.md)

#### Configuration Layer (Pipeline)
- **`app/config/wonderware_config.py`**
  - `PipelineConfig` dataclass with `from_env()` static method
  - Pipeline-specific settings (tag_chunk_size, backfill_chunk_days, etc.)
  - Uses `WONDERWARE_PIPELINE_` prefix to avoid collision with connector config
  - **Note**: Connection settings now in connector's `WonderwareConfig`

#### Data Layer (Pipeline)
- **`app/ingest/wonderware_models.py`**
  - `WonderwareHistory` - 42 fields including DateTime, TagName, Value, Quality
  - `WonderwareHistoryAggregated` - 8 fields with first/avg/min/max/count stats
  - Both configured with MergeTree engine, monthly partitioning, TTL

- **`app/ingest/models.py`**
  - `MachineData` - Metadata for machines, sensors, and tag mapping

#### Workflow Layer (Pipeline)
- **`app/workflows/wonderware_backfill.py`**
  - 4-task DAG: discover_tags → chunk_date_ranges → fetch_and_insert → finalize
  - Uses `WonderwareConnector` for all Wonderware interactions
  - Manual trigger only (`schedule=""`)
  - 24-hour timeout, 3 retries

- **`app/workflows/wonderware_sync.py`**
  - Single-task workflow for incremental sync
  - Uses `WonderwareConnector` for data extraction
  - Runs every 1 minute (`*/1 * * * *`)
  - Watermark-based (queries ClickHouse for last timestamp)
  - 5-minute timeout, 3 retries

#### Library Layer (Pipeline)
- **`app/workflows/lib/wonderware_inserter.py`**
  - Batch insert with tenacity retry decorator
  - Converts raw dicts to Pydantic models
  - Handles partial failures gracefully
  - **Note**: No longer has wonderware_client.py (moved to connector)

#### API Layer (Pipeline)
Seven REST APIs for querying and monitoring:
- `wonderware_status` - Pipeline health and statistics
- `wonderware_timeseries` - Query time-series data
- `wonderware_tags` - List all tags
- `machine`, `machine_type`, `sensor_data`, `sensor_type` - Machine metadata

## Configuration

### Connector Configuration (WONDERWARE_*)

These environment variables configure the Wonderware connector for SQL Server access:

```bash
# Required
export WONDERWARE_HOST=sql-server-hostname

# Optional (with defaults)
export WONDERWARE_PORT=1433
export WONDERWARE_DATABASE=Runtime
export WONDERWARE_USERNAME=your-username
export WONDERWARE_PASSWORD=your-password
export WONDERWARE_DRIVER=mssql+pytds
```

For detailed connector configuration options, see the [Wonderware Connector Configuration Guide](../../../../../../../connector-registry/wonderware/v1/514-labs/python/default/docs/configuration.md).

### Pipeline Configuration (WONDERWARE_PIPELINE_*)

These environment variables configure pipeline-specific behavior:

| Variable | Default | Description |
|----------|---------|-------------|
| `WONDERWARE_PIPELINE_TAG_CHUNK_SIZE` | `10` | Tags to process per batch (10-50 recommended) |
| `WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS` | `1` | Days per backfill chunk (1-7 recommended) |
| `WONDERWARE_PIPELINE_BACKFILL_OLDEST_TIME` | `2025-01-01 00:00:00` | Start date for historical backfill |
| `WONDERWARE_PIPELINE_TAG_CACHE_TTL` | `3600` | Seconds to cache tag list in Redis |
| `WONDERWARE_PIPELINE_SYNC_SCHEDULE` | `*/1 * * * *` | Cron expression for sync workflow |

**Example:**
```bash
export WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=50
export WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS=7
export WONDERWARE_PIPELINE_TAG_CACHE_TTL=7200
```

### ClickHouse Configuration

Set these if using non-default ClickHouse settings:

```bash
export CLICKHOUSE_HOST=localhost
export CLICKHOUSE_PORT=18123
export CLICKHOUSE_USER=panda
export CLICKHOUSE_PASSWORD=pandapass
export CLICKHOUSE_DB=local
```

### Configuration File (Optional)

Alternatively, create a `.env` file in the project root:

```bash
# .env
# Connector configuration
WONDERWARE_HOST=192.168.1.100
WONDERWARE_USERNAME=historian_reader
WONDERWARE_PASSWORD=SecurePassword123

# Pipeline configuration
WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=50
WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS=7
WONDERWARE_PIPELINE_TAG_CACHE_TTL=7200
```

Then load it before running Moose:

```bash
source .env
moose dev
```

## Workflows

### Backfill Workflow (Manual Trigger)

**Purpose**: Load historical data from Wonderware into ClickHouse (one-time or periodic).

**Workflow Structure**:
```
discover_tags (Task 1)
    ↓
chunk_date_ranges (Task 2)
    ↓
fetch_and_insert (Task 3)
    ↓
finalize (Task 4)
```

**Task Descriptions**:

1. **discover_tags**
   - Uses `connector.discover_tags()` to query TagRef table
   - Returns list of active, non-system tags
   - Example output: `["Temperature_01", "Pressure_02", "Flow_03", ...]`

2. **chunk_date_ranges**
   - Uses `PipelineConfig` for chunking parameters
   - Splits time range into chunks (default: 1 day)
   - Splits tags into groups (default: 10 tags)
   - Example: 150 tags × 30 days = 450 work units (15 tag chunks × 30 date chunks)

3. **fetch_and_insert**
   - Fetches data using `connector.fetch_history_data()`
   - Inserts to ClickHouse using `WonderwareBatchInserter.insert_rows()`
   - Processes all combinations of tag chunks × date chunks
   - Uses `inclusive_start=True` (BETWEEN operator)

4. **finalize**
   - Logs completion statistics (total rows, processed chunks, duration)
   - No Redis state writes (ClickHouse is source of truth)

**How to Trigger**:

Via Temporal UI (http://localhost:8080):
```json
{
  "oldest_time": "2025-01-01 00:00:00"
}
```

Via Temporal CLI:
```bash
temporal workflow start \
  --task-queue wonderware_backfill \
  --type wonderware_backfill \
  --input '{"oldest_time": "2025-01-01 00:00:00"}'
```

**Configuration**:
- Schedule: Manual only (`schedule=""`)
- Timeout: 24 hours
- Retries: 3 (per task)

### Sync Workflow (Automatic, Every Minute)

**Purpose**: Keep ClickHouse up-to-date with new data from Wonderware.

**Workflow Structure**:
```
sync_current (Single Task)
  1. Query ClickHouse for last timestamp (watermark)
  2. Get cached tag list from Redis (or connector)
  3. Fetch new data using connector (DateTime > watermark)
  4. Insert to ClickHouse with deduplication
```

**How It Works**:

1. **Watermark Query**:
   ```sql
   SELECT max(DateTime) AS max_time FROM WonderwareHistory
   ```
   If no data exists, starts from 1 hour ago

2. **Tag List**:
   - First checks Redis cache (`MS:wonderware:tags:list`)
   - If cache miss, calls `connector.discover_tags()` and caches for 1 hour

3. **Data Fetch**:
   - Uses `connector.fetch_history_data()` with `inclusive_start=False`
   - Uses `>` operator (exclusive start, inclusive end)
   - Example: if last timestamp is `2025-02-06 12:00:00`, fetches `DateTime > '2025-02-06 12:00:00'`

4. **Insert**:
   - Converts raw dicts to `WonderwareHistory` Pydantic models
   - Inserts with `skip_duplicates=True` to handle overlapping data

**Configuration**:
- Schedule: Every 1 minute (`*/1 * * * *`)
- Timeout: 5 minutes
- Retries: 3

**How to Pause**:
```bash
# Stop Moose server (stops all workflows)
# Press Ctrl+C in terminal where moose dev is running

# Or use Temporal CLI to pause workflow
temporal workflow cancel --workflow-id wonderware_current_sync
```

## Data Models

### WonderwareHistory (Raw Data)

**Purpose**: Store raw 1-second resolution sensor data from Wonderware History view.

**Key Fields**:
- `DateTime` (datetime) - Timestamp of the reading
- `TagName` (str) - Sensor identifier (e.g., "Temperature_Reactor_01")
- `Value` (float, optional) - Numeric sensor value
- `VValue` (str, optional) - String sensor value (for text-based sensors)
- `Quality` (int, optional) - OPC quality code (192 = good)
- `wwRetrievalMode` (str) - Always "Delta" for raw data

**Full Schema** (42 fields total):
```python
DateTime, TagName, Value, VValue, Quality, QualityDetail, OpcQuality,
wwTagKey, wwRowCount, wwResolution, wwEdgeDetection, wwRetrievalMode,
wwTimeDeadband, wwValueDeadband, wwTimeZone, wwVersion, wwCycleCount,
wwTimeStampRule, wwInterpolationType, wwQualityRule, wwStateCalc,
StateTime, PercentGood, wwParameters, StartDateTime, SourceTag,
SourceServer, wwFilter, wwValueSelector, wwMaxStates, wwOption,
wwExpression, wwUnit
```

**ClickHouse Configuration**:
- Engine: `MergeTree`
- Order by: `[TagName, DateTime]`
- Partition by: `toYYYYMM(DateTime)` (monthly partitions)
- TTL: `DateTime + INTERVAL 90 DAY` (auto-delete old data)

**Query Examples**:
```sql
-- Get latest reading for a tag
SELECT * FROM WonderwareHistory
WHERE TagName = 'Temperature_01'
ORDER BY DateTime DESC
LIMIT 1;

-- Average value for a tag over 1 hour
SELECT avg(Value) AS avg_temp
FROM WonderwareHistory
WHERE TagName = 'Temperature_01'
  AND DateTime >= '2025-02-06 12:00:00'
  AND DateTime < '2025-02-06 13:00:00';
```

### WonderwareHistoryAggregated (Pre-Aggregated)

**Purpose**: Store 1-minute aggregated statistics for faster queries on larger time ranges.

**Schema**:
```python
TagName (str)              # Sensor identifier
minute_timestamp (datetime) # Minute bucket (e.g., 2025-02-06 12:34:00)
first_value (float)        # First value in the minute
avg_value (float)          # Average value
min_value (float)          # Minimum value
max_value (float)          # Maximum value
count (int)                # Number of readings in the minute
avg_quality (float)        # Average quality code
min_quality (int)          # Minimum quality code
```

**ClickHouse Configuration**:
- Engine: `MergeTree`
- Order by: `[TagName, minute_timestamp]`
- Partition by: `toYYYYMM(minute_timestamp)`
- TTL: `minute_timestamp + INTERVAL 730 DAY` (2 years)

### MachineData (Metadata)

**Purpose**: Map sensor tags to physical machines and locations for dimensional analysis.

**Schema**:
```python
timestamp (datetime)     # When metadata was recorded
enterprise (str)         # Enterprise name
region (str)             # Geographic region
country (str)            # Country
site (str)               # Site/facility name
location (str)           # Location within site
line (str)               # Production line
machine (str)            # Machine identifier
machine_type (str)       # Type of machine
sensor_type (str)        # Type of sensor
sensor_tag (str)         # Wonderware tag name
value (float)            # Current value
```

## APIs

All APIs are available at `http://localhost:4000/consumption/{api_name}`.

### GET /consumption/wonderware_status

**Purpose**: Check pipeline health and get summary statistics.

**Parameters**:
- `tag_name` (optional, string) - Filter statistics by specific tag

**Example Request**:
```bash
curl "http://localhost:4000/consumption/wonderware_status"
```

**Example Response**:
```json
{
  "total_tags": 150,
  "total_data_points": 3896400,
  "oldest_data": "2025-01-01 00:00:00",
  "newest_data": "2025-02-06 15:30:00",
  "data_span_days": 36.645833,
  "tag_filter": null
}
```

### GET /consumption/wonderware_timeseries

**Purpose**: Query time-series data for a specific tag.

**Parameters**:
- `tag_name` (required, string) - Sensor tag identifier
- `date_from` (required, ISO datetime) - Start of time range
- `date_to` (required, ISO datetime) - End of time range
- `limit` (optional, int, default=1000) - Max rows to return

**Example Request**:
```bash
curl "http://localhost:4000/consumption/wonderware_timeseries?tag_name=Temperature_01&date_from=2025-02-06T12:00:00&date_to=2025-02-06T13:00:00&limit=100"
```

### GET /consumption/wonderware_tags

**Purpose**: List all discovered sensor tags.

**Example Request**:
```bash
curl "http://localhost:4000/consumption/wonderware_tags"
```

**Example Response**:
```json
{
  "tags": ["Temperature_01", "Temperature_02", "Pressure_01", "Flow_01"],
  "total": 150
}
```

## Performance Tuning

### Backfill Optimization

**Problem**: Backfill is taking too long (< 10K rows/minute).

**Solutions**:

1. **Increase pipeline tag chunk size**:
   ```bash
   export WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=50  # Up from default 10
   ```

2. **Increase date chunk size**:
   ```bash
   export WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS=7  # Up from default 1
   ```

3. **Optimize SQL Server** (see connector documentation):
   - Add indexes on History table
   - Increase SQL Server memory allocation
   - Enable read committed snapshot isolation

### Sync Optimization

**Problem**: Sync workflow is falling behind (processing time > 1 minute).

**Solutions**:

1. **Increase tag cache TTL**:
   ```bash
   export WONDERWARE_PIPELINE_TAG_CACHE_TTL=7200  # 2 hours instead of 1
   ```

2. **Reduce sync frequency** (if acceptable):
   ```bash
   export WONDERWARE_PIPELINE_SYNC_SCHEDULE="*/5 * * * *"  # Every 5 minutes
   ```

## Monitoring

### Temporal UI (Workflow Monitoring)

**URL**: http://localhost:8080

**Features**:
- View all workflow executions (running, completed, failed)
- Drill into task-level execution details
- View workflow logs and error messages
- Retry failed workflows manually
- Cancel running workflows

### Pipeline Status API

**Check overall health**:
```bash
curl http://localhost:4000/consumption/wonderware_status | jq
```

**Check data freshness**:
```bash
newest=$(curl -s http://localhost:4000/consumption/wonderware_status | jq -r '.newest_data')
```

### Logs

**Moose logs**:
```bash
tail -f .moose/logs/moose.log
```

## Troubleshooting

### Connection Errors

**Error**: Cannot connect to SQL Server

**Solutions**:
1. Verify connector configuration:
   ```bash
   echo $WONDERWARE_HOST
   echo $WONDERWARE_USERNAME
   ```

2. Test connector directly:
   ```python
   from wonderware import WonderwareConnector
   connector = WonderwareConnector.build_from_env()
   print(connector.test_connection())
   ```

3. See [Connector Troubleshooting Guide](../../../../../../../connector-registry/wonderware/v1/514-labs/python/default/README.md#troubleshooting)

### No Data Showing Up

**Debugging Steps**:

1. Check Temporal UI for errors
2. Verify tags were discovered:
   ```python
   from wonderware import WonderwareConnector
   connector = WonderwareConnector.build_from_env()
   print(len(connector.discover_tags()))
   ```

3. Check ClickHouse table:
   ```sql
   SELECT COUNT(*) FROM local.WonderwareHistory;
   ```

### Sync Workflow Stopped

**Solution**:
```bash
# Restart Moose server
moose dev

# Workflow will auto-resume
```

## Testing

### Run Unit Tests

```bash
# Install test dependencies
pip install pytest pytest-cov

# Run all tests
pytest tests/

# Run with coverage report
pytest --cov=app --cov-report=html tests/

# Run specific test file
pytest tests/unit/test_wonderware_config.py
```

### Test Coverage

Current coverage: **Tests covering config, models, and inserter**.

| Module | Tests | Coverage |
|--------|-------|----------|
| `PipelineConfig` | 6 tests | ~90% |
| `wonderware_models.py` | 8 tests | ~85% |
| `wonderware_inserter.py` | 8 tests | ~80% |

**Note**: Connector has its own comprehensive test suite. See [Connector Tests](../../../../../../../connector-registry/wonderware/v1/514-labs/python/default/tests/).

## Related Documentation

- **Wonderware Connector**:
  - [Connector README](../../../../../../../connector-registry/wonderware/v1/514-labs/python/default/README.md)
  - [Connector Configuration Guide](../../../../../../../connector-registry/wonderware/v1/514-labs/python/default/docs/configuration.md)
  - [Connector API Reference](../../../../../../../connector-registry/wonderware/v1/514-labs/python/default/docs/api-reference.md)

## License

MIT License - see [../../../_meta/LICENSE](../../../_meta/LICENSE)

Copyright (c) 2025 514 Labs

## Support

- **GitHub Issues**: [github.com/514-labs/registry/issues](https://github.com/514-labs/registry/issues)
- **Documentation**: [docs.514.dev](https://docs.514.dev)
- **Pipeline Registry**: [github.com/514-labs/registry](https://github.com/514-labs/registry)

---

**Need help?** Open an issue on GitHub or join our community discussions.
