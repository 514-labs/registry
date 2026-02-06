# Workflows Guide

Complete guide to the Wonderware to ClickHouse pipeline workflows.

## Table of Contents

- [Overview](#overview)
- [Backfill Workflow](#backfill-workflow)
- [Sync Workflow](#sync-workflow)
- [Workflow Management](#workflow-management)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)
- [Monitoring and Debugging](#monitoring-and-debugging)

## Overview

The pipeline uses **Temporal workflows** for orchestrating data extraction and loading. Two workflows handle different use cases:

| Workflow | Purpose | Trigger | Frequency |
|----------|---------|---------|-----------|
| **Backfill** | Load historical data | Manual | One-time or periodic |
| **Sync** | Keep data up-to-date | Automatic | Every 1 minute (configurable) |

### Why Two Workflows?

**Backfill workflow** is optimized for:
- ✅ Processing large date ranges efficiently
- ✅ Batching queries to reduce load
- ✅ Progress visibility with multi-task DAG
- ✅ Manual control over date ranges

**Sync workflow** is optimized for:
- ✅ Low-latency real-time updates
- ✅ Watermark-based incremental processing
- ✅ Automatic recovery from failures
- ✅ Minimal SQL Server load

## Backfill Workflow

### Purpose

Load historical data from Wonderware into ClickHouse for a specific date range.

### When to Use

- **Initial setup**: Load all historical data before starting sync
- **Gap filling**: Load data for a specific period that was missed
- **Data migration**: Move data from old to new ClickHouse instance
- **Periodic full refreshes**: Re-load data to fix quality issues

### Workflow Architecture

```
┌─────────────────────────────────────────────────────┐
│         BACKFILL WORKFLOW (4-Task DAG)              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Task 1: Discover Tags                             │
│  ↓ Input: oldest_time                              │
│  ↓ Output: tags[], oldest_time                     │
│  └─────────────────────────────────────────┐       │
│                                             ↓       │
│  Task 2: Chunk Date Ranges                         │
│  ↓ Input: tags[], oldest_time                      │
│  ↓ Output: tags[], date_ranges[], tag_chunks[]     │
│  └─────────────────────────────────────────┐       │
│                                             ↓       │
│  Task 3: Fetch and Insert                          │
│  ↓ Input: date_ranges[], tag_chunks[]              │
│  ↓ Loop: For each (date_range, tag_chunk)          │
│  ↓   - Fetch from Wonderware                       │
│  ↓   - Insert to ClickHouse                        │
│  ↓ Output: total_rows, processed_chunks            │
│  └─────────────────────────────────────────┐       │
│                                             ↓       │
│  Task 4: Finalize                                  │
│  ↓ Input: total_rows, processed_chunks             │
│  ↓ Output: status, completion_time                 │
│  └─────────────────────────────────────────┘       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Task 1: Discover Tags

**Purpose:** Get list of active tags from Wonderware TagRef table.

**Implementation:**
```python
def run_discover_tags(ctx: TaskContext[BackfillInput]) -> DiscoverTagsOutput:
    oldest_time = ctx.input.oldest_time
    connector = WonderwareConnector.build_from_env()

    try:
        tags = connector.discover_tags()
        logger.info(f"Discovered {len(tags)} tags to backfill")

        return DiscoverTagsOutput(
            tags=tags,
            oldest_time=oldest_time
        )
    finally:
        connector.close()
```

**Query executed:**
```sql
SELECT "TagName" FROM "TagRef"
WHERE "TagType" = 1 AND "TagName" NOT LIKE 'Sys%'
```

**Output example:**
```json
{
  "tags": ["Temperature_01", "Pressure_02", "Flow_03", ...],
  "oldest_time": "2025-01-01 00:00:00"
}
```

**Duration:** ~5-10 seconds for 150 tags

### Task 2: Chunk Date Ranges

**Purpose:** Split work into manageable batches (date ranges × tag groups).

**Implementation:**
```python
def run_chunk_date_ranges(ctx: TaskContext[DiscoverTagsOutput]) -> ChunkDateRangesOutput:
    tags = ctx.input.tags
    oldest_time = datetime.fromisoformat(ctx.input.oldest_time)
    current_time = datetime.now()
    pipeline_config = PipelineConfig.from_env()

    # Generate date ranges
    date_ranges = []
    current = oldest_time
    while current < current_time:
        next_date = min(
            current + timedelta(days=pipeline_config.backfill_chunk_days),
            current_time
        )
        date_ranges.append((current.isoformat(), next_date.isoformat()))
        current = next_date

    # Chunk tags
    tag_chunks = [
        tags[i:i+pipeline_config.tag_chunk_size]
        for i in range(0, len(tags), pipeline_config.tag_chunk_size)
    ]

    total_work = len(date_ranges) * len(tag_chunks)
    logger.info(f"Created {len(date_ranges)} date ranges and {len(tag_chunks)} tag chunks")
    logger.info(f"Total work units: {total_work}")

    return ChunkDateRangesOutput(
        tags=tags,
        oldest_time=ctx.input.oldest_time,
        date_ranges=date_ranges,
        tag_chunks=tag_chunks
    )
```

**Example calculation:**
```
Tags: 150
Date range: 2025-01-01 to 2025-01-31 (30 days)
Tag chunk size: 10
Date chunk size: 1 day

Tag chunks: 150 / 10 = 15 chunks
Date chunks: 30 / 1 = 30 chunks
Total work units: 15 × 30 = 450 iterations
```

**Output example:**
```json
{
  "tags": [...150 tags...],
  "oldest_time": "2025-01-01 00:00:00",
  "date_ranges": [
    ["2025-01-01T00:00:00", "2025-01-02T00:00:00"],
    ["2025-01-02T00:00:00", "2025-01-03T00:00:00"],
    ...
  ],
  "tag_chunks": [
    ["Tag1", "Tag2", ..., "Tag10"],
    ["Tag11", "Tag12", ..., "Tag20"],
    ...
  ]
}
```

**Duration:** ~1 second

### Task 3: Fetch and Insert

**Purpose:** Fetch data from Wonderware and insert into ClickHouse.

**Implementation:**
```python
def run_fetch_and_insert(ctx: TaskContext[ChunkDateRangesOutput]) -> FetchAndInsertOutput:
    date_ranges = ctx.input.date_ranges
    tag_chunks = ctx.input.tag_chunks

    connector = WonderwareConnector.build_from_env()
    inserter = WonderwareBatchInserter()

    total_rows = 0
    total_chunks = len(date_ranges) * len(tag_chunks)
    processed = 0

    try:
        for date_from, date_to in date_ranges:
            for tag_chunk in tag_chunks:
                processed += 1
                logger.info(
                    f"Processing chunk {processed}/{total_chunks}: "
                    f"{date_from} - {date_to}, tags: {len(tag_chunk)}"
                )

                # Fetch data with inclusive start (BETWEEN)
                rows = connector.fetch_history_data(
                    tag_chunk, date_from, date_to,
                    inclusive_start=True
                )

                if rows:
                    inserted = inserter.insert_rows(rows)
                    total_rows += inserted
                    logger.info(f"Inserted {inserted} rows")

        logger.info(f"Backfill complete: {total_rows:,} total rows inserted")

        return FetchAndInsertOutput(
            total_rows=total_rows,
            processed_chunks=processed
        )
    finally:
        connector.close()
```

**Query per iteration:**
```sql
SELECT
  DateTime, TagName, Value, ... (33 fields total)
FROM "History"
WHERE
  "TagName" IN ('Tag1', 'Tag2', ..., 'Tag10') AND
  "DateTime" BETWEEN '2025-01-01 00:00:00' AND '2025-01-02 00:00:00' AND
  "Value" IS NOT NULL AND
  "wwRetrievalMode" = 'Delta'
ORDER BY "DateTime" ASC
```

**Duration:** ~10-120 minutes (depends on data volume and configuration)

**Progress example:**
```
Processing chunk 1/450: 2025-01-01 - 2025-01-02, tags: 10
Inserted 1,234 rows
Processing chunk 2/450: 2025-01-01 - 2025-01-02, tags: 10
Inserted 1,456 rows
...
Processing chunk 450/450: 2025-01-31 - 2025-02-01, tags: 10
Inserted 987 rows
Backfill complete: 3,896,400 total rows inserted
```

### Task 4: Finalize

**Purpose:** Log completion statistics.

**Implementation:**
```python
def run_finalize(ctx: TaskContext[FetchAndInsertOutput]) -> FinalizeOutput:
    completion_time = datetime.now().isoformat()

    logger.info("=" * 60)
    logger.info("BACKFILL COMPLETE")
    logger.info("=" * 60)
    logger.info(f"Total rows inserted: {ctx.input.total_rows:,}")
    logger.info(f"Processed chunks: {ctx.input.processed_chunks}")
    logger.info(f"Completion time: {completion_time}")
    logger.info("=" * 60)

    return FinalizeOutput(
        status="completed",
        completion_time=completion_time,
        total_rows=ctx.input.total_rows,
        processed_chunks=ctx.input.processed_chunks
    )
```

**Duration:** ~1 second

### Starting a Backfill

**Via Temporal UI:**

1. Open http://localhost:8080
2. Click "Start Workflow"
3. Fill form:
   ```
   Workflow Type: wonderware_backfill
   Workflow ID: (auto-generated or custom)
   Input:
   {
     "oldest_time": "2025-01-01 00:00:00"
   }
   ```
4. Click "Start Workflow"

**Via Temporal CLI:**

```bash
temporal workflow start \
  --type wonderware_backfill \
  --task-queue default \
  --input '{"oldest_time": "2025-01-01 00:00:00"}'
```

**Via Python:**

```python
from temporalio.client import Client
from app.workflows.wonderware_backfill import BackfillInput

async def start_backfill():
    client = await Client.connect("localhost:7233")

    await client.start_workflow(
        "wonderware_backfill",
        BackfillInput(oldest_time="2025-01-01 00:00:00"),
        id="backfill-2025-01-01",
        task_queue="default"
    )
```

### Backfill Configuration

```python
# From wonderware_backfill.py
wonderware_backfill = Workflow(
    name="wonderware_backfill",
    config=WorkflowConfig(
        starting_task=discover_tags_task,
        schedule="",  # Manual trigger only
        retries=3,    # Retry each task up to 3 times
        timeout="24h" # Kill workflow after 24 hours
    )
)
```

### Backfill Best Practices

**1. Test with small date range first:**
```json
{
  "oldest_time": "2025-02-06 00:00:00"  // Just 1 day for testing
}
```

**2. Run during off-peak hours** to minimize SQL Server impact

**3. Monitor progress in Temporal UI:**
- Check Task 3 logs for throughput
- Estimate completion time: `(total_chunks - processed) / throughput`

**4. Adjust chunk sizes based on performance:**
```bash
# If too slow, increase batch sizes
export WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=50
export WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS=7
```

**5. Don't run multiple backfills simultaneously** (will compete for resources)

## Sync Workflow

### Purpose

Keep ClickHouse up-to-date with new data from Wonderware in near real-time.

### Workflow Architecture

```
┌─────────────────────────────────────────────────────┐
│         SYNC WORKFLOW (Single Task)                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Step 1: Get Watermark (last DateTime)             │
│    Query ClickHouse: SELECT max(DateTime)          │
│    └─→ If empty, use 1 hour ago                    │
│                                                     │
│  Step 2: Get Tag List                              │
│    Check Redis cache                               │
│    └─→ If miss, fetch from connector + cache       │
│                                                     │
│  Step 3: Fetch New Data                            │
│    connector.fetch_history_data(                   │
│      tags, watermark, now,                         │
│      inclusive_start=False  // Exclusive start     │
│    )                                               │
│                                                     │
│  Step 4: Insert to ClickHouse                      │
│    inserter.insert_rows(rows)                      │
│    └─→ skip_duplicates=True                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Implementation

```python
def run_sync_current(ctx: TaskContext[None]) -> SyncOutput:
    """Sync recent data from Wonderware to ClickHouse."""

    pipeline_config = PipelineConfig.from_env()
    connector = WonderwareConnector.build_from_env()
    inserter = WonderwareBatchInserter()
    moose_client = MooseClient()
    redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

    try:
        # Step 1: Get watermark
        last_max_time = _get_last_max_timestamp(moose_client)
        if not last_max_time:
            last_max_time = datetime.now() - timedelta(hours=1)
            logger.warning(f"No data found, syncing from {last_max_time}")

        logger.info(f"Syncing data newer than {last_max_time}")

        # Step 2: Get tags (with caching)
        tags = _get_cached_tags(connector, redis_client, pipeline_config.tag_cache_ttl)

        # Step 3: Fetch new data
        total_rows = 0
        tag_chunks = [
            tags[i:i+pipeline_config.tag_chunk_size]
            for i in range(0, len(tags), pipeline_config.tag_chunk_size)
        ]
        current_time = datetime.now()

        for tag_chunk in tag_chunks:
            # Exclusive start (>) to avoid duplicates
            rows = connector.fetch_history_data(
                tag_chunk,
                last_max_time.isoformat(),
                current_time.isoformat(),
                inclusive_start=False
            )

            if rows:
                inserted = inserter.insert_rows(rows)
                total_rows += inserted

        logger.info(f"Sync complete: {total_rows} new rows inserted")

        return SyncOutput(
            last_max_time=last_max_time.isoformat(),
            new_rows=total_rows,
            sync_time=current_time.isoformat()
        )
    finally:
        connector.close()
```

### Watermark Logic

**Get last timestamp from ClickHouse:**
```sql
SELECT max(DateTime) AS max_time
FROM WonderwareHistory
```

**Fallback if empty:**
```python
if not last_max_time:
    last_max_time = datetime.now() - timedelta(hours=1)
```

**Query with exclusive start:**
```sql
-- Uses > (not >=) to avoid re-processing last row
WHERE "DateTime" > '2025-02-06 12:00:00' AND <= '2025-02-06 12:01:00'
```

### Caching Strategy

**Redis cache key:** `MS:wonderware:tags:list`

**Cache logic:**
```python
def _get_cached_tags(connector, redis_client, ttl):
    cache_key = 'MS:wonderware:tags:list'

    # Try cache first
    cached_tags = redis_client.get(cache_key)
    if cached_tags:
        return cached_tags.split(',')

    # Cache miss - fetch from connector
    tags = connector.discover_tags()

    # Cache for TTL seconds
    if tags:
        redis_client.setex(cache_key, ttl, ','.join(tags))

    return tags
```

**Cache benefits:**
- Reduces SQL Server load (1 query per hour vs 1 per minute)
- Faster sync execution
- Falls back gracefully if Redis unavailable

### Sync Configuration

```python
# From wonderware_sync.py
wonderware_current_sync = Workflow(
    name="wonderware_current_sync",
    config=WorkflowConfig(
        starting_task=sync_current_task,
        schedule="*/1 * * * *",  # Every 1 minute
        retries=3,
        timeout="5m"             # Kill if takes > 5 minutes
    )
)
```

### Sync Best Practices

**1. Monitor sync lag:**
```bash
# Check newest data timestamp
newest=$(curl -s http://localhost:4000/consumption/wonderware_status | jq -r '.newest_data')
echo "Last sync: $newest"

# Alert if > 5 minutes old
```

**2. Adjust frequency based on requirements:**
```bash
# Real-time (default)
export WONDERWARE_PIPELINE_SYNC_SCHEDULE="*/1 * * * *"

# Near real-time (reduce load)
export WONDERWARE_PIPELINE_SYNC_SCHEDULE="*/5 * * * *"
```

**3. Use appropriate cache TTL:**
```bash
# Stable environment (tags don't change)
export WONDERWARE_PIPELINE_TAG_CACHE_TTL=7200  # 2 hours

# Dynamic environment
export WONDERWARE_PIPELINE_TAG_CACHE_TTL=1800  # 30 minutes
```

**4. Monitor for failures:**
- Check Temporal UI for failed executions
- Set up alerts for consecutive failures

## Workflow Management

### Pausing Workflows

**Pause sync workflow:**
```bash
# Stop Moose (Ctrl+C in terminal)

# Or cancel in Temporal UI:
# Navigate to workflow → Actions → Cancel
```

**Resume sync workflow:**
```bash
# Restart Moose
moose dev

# Workflow automatically resumes
```

### Canceling Workflows

**Cancel running backfill:**

Temporal UI:
1. Navigate to workflow execution
2. Click "Terminate" button
3. Confirm termination

Temporal CLI:
```bash
temporal workflow cancel --workflow-id backfill-2025-01-01
```

### Retrying Failed Workflows

**Automatic retries:**
- Both workflows configured with `retries=3`
- Exponential backoff between retries
- Failure after 3 attempts

**Manual retry:**

Temporal UI:
1. Navigate to failed workflow
2. Click "Reset" button
3. Select reset point (usually last successful task)
4. Click "Reset and Resume"

## Error Handling

### Common Errors

**1. SQL Server Connection Error**

```
Error: OperationalError: (20009, b'DB-Lib error...')
```

**Cause:** Cannot connect to SQL Server

**Handling:**
- Workflow will retry 3 times with exponential backoff
- After 3 failures, workflow fails
- Fix connection issue and manually retry workflow

**2. ClickHouse Write Error**

```
Error: ClickHouseError: Too many simultaneous queries
```

**Cause:** ClickHouse overloaded

**Handling:**
- Inserter uses retry logic with exponential backoff
- Reduce chunk sizes to lower write load
- Scale up ClickHouse resources

**3. Circuit Breaker Open**

```
Error: CircuitBreakerOpenError: Circuit breaker is open
```

**Cause:** Too many consecutive SQL Server failures

**Handling:**
- Connector circuit breaker protects against cascading failures
- Wait 60 seconds for automatic recovery
- Or fix SQL Server issue and refresh connection

### Debugging Failed Workflows

**1. Check Temporal UI:**
- Navigate to failed workflow
- View "Event History" tab
- Look for `ActivityTaskFailed` events
- Read error message and stack trace

**2. Check Moose logs:**
```bash
grep -A 10 "ERROR" .moose/logs/moose.log
```

**3. Test components individually:**
```python
# Test connector
from wonderware import WonderwareConnector
connector = WonderwareConnector.build_from_env()
print(connector.test_connection())

# Test specific query
rows = connector.fetch_history_data(
    ["Tag1"],
    "2025-02-06T00:00:00",
    "2025-02-06T01:00:00"
)
print(f"Fetched {len(rows)} rows")
```

## Performance Optimization

### Backfill Performance

**Current performance < 10K rows/min?**

1. **Increase batch sizes:**
   ```bash
   export WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=50
   export WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS=7
   ```

2. **Reduce caching overhead:**
   ```bash
   export WONDERWARE_PIPELINE_TAG_CACHE_TTL=7200
   ```

3. **Add SQL Server indexes:**
   ```sql
   CREATE INDEX idx_history_datetime ON History(DateTime);
   CREATE INDEX idx_history_tagname ON History(TagName);
   ```

### Sync Performance

**Sync taking > 1 minute?**

1. **Increase cache TTL:**
   ```bash
   export WONDERWARE_PIPELINE_TAG_CACHE_TTL=7200
   ```

2. **Increase tag chunk size:**
   ```bash
   export WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=30
   ```

3. **Reduce sync frequency:**
   ```bash
   export WONDERWARE_PIPELINE_SYNC_SCHEDULE="*/5 * * * *"
   ```

## Monitoring and Debugging

### Key Metrics

**Backfill:**
- Throughput (rows/minute)
- Progress (chunks processed / total chunks)
- ETA (remaining chunks / throughput)

**Sync:**
- Lag (current time - newest data timestamp)
- Rows per sync
- Execution time per sync

### Monitoring Tools

**1. Temporal UI** - http://localhost:8080
- Real-time workflow status
- Task-level progress
- Error messages and stack traces

**2. Moose Logs** - `.moose/logs/moose.log`
- Application-level logs
- Workflow execution details

**3. Status API** - http://localhost:4000/consumption/wonderware_status
- Data freshness
- Total data points
- Date range coverage

### Alerting

**Example: Alert on sync lag**

```bash
#!/bin/bash
# alert_on_lag.sh

newest=$(curl -s http://localhost:4000/consumption/wonderware_status | jq -r '.newest_data')
now=$(date -u +%s)
newest_ts=$(date -d "$newest" +%s 2>/dev/null || echo 0)
lag=$((now - newest_ts))

if [ $lag -gt 300 ]; then
  echo "ALERT: Data is $lag seconds old (> 5 minutes)"
  # Send alert (email, Slack, PagerDuty, etc.)
fi
```

Run via cron:
```cron
*/5 * * * * /path/to/alert_on_lag.sh
```

## Related Documentation

- [Getting Started](getting-started.md)
- [Configuration Guide](configuration.md)
- [API Reference](apis.md)
