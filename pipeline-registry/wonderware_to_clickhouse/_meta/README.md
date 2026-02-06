# Wonderware to ClickHouse Pipeline

> Production-grade data pipeline for extracting time-series sensor data from Wonderware/AVEVA Historian (SQL Server) and loading it into ClickHouse for analytics and visualization.

[![Status](https://img.shields.io/badge/status-beta-yellow)](https://github.com/514-labs/registry)
[![License](https://img.shields.io/badge/license-MIT-blue)](v1/514-labs/_meta/LICENSE)
[![Python](https://img.shields.io/badge/python-3.13+-blue)](https://www.python.org/downloads/)

## Why This Pipeline?

Wonderware/AVEVA Historian stores industrial IoT sensor data in SQL Server, but querying large time-series datasets is slow and inefficient. This pipeline:

- **Moves data to ClickHouse** - 100x faster analytical queries on time-series data
- **Handles scale** - Processes millions of data points with configurable chunking
- **Stays in sync** - Incremental sync every minute keeps data fresh
- **Zero data loss** - Automatic retry, deduplication, and watermark-based resumption

## Quick Start

```bash
# Install the pipeline
moose pipeline install wonderware_to_clickhouse
cd wonderware_to_clickhouse/v1/514-labs/python/default

# Configure connection to Wonderware SQL Server
export WONDERWARE_HOST=your-sql-server-host
export WONDERWARE_USERNAME=your-username
export WONDERWARE_PASSWORD=your-password

# Start the pipeline
moose dev

# Verify it's working
curl http://localhost:4000/consumption/wonderware_status
```

**📖 Full documentation:** [v1/514-labs/python/default/README.md](v1/514-labs/python/default/README.md)

## What You Get

### 🔄 Two Workflows

1. **Historical Backfill** (manual trigger)
   - Loads years of historical data in hours
   - 4-stage DAG: discover tags → chunk time ranges → parallel fetch → finalize
   - Configurable chunking for optimal performance

2. **Incremental Sync** (runs every minute)
   - Keeps ClickHouse up-to-date automatically
   - Watermark-based (picks up where it left off)
   - Redis caching to reduce load on SQL Server

### 📊 Three Data Tables

| Table | Description | Resolution | Retention |
|-------|-------------|------------|-----------|
| **WonderwareHistory** | Raw sensor readings | 1 second | 90 days |
| **WonderwareHistoryAggregated** | Pre-aggregated stats | 1 minute | 2 years |
| **MachineData** | Machine/sensor metadata | - | Permanent |

### 🔌 Seven REST APIs

- `GET /consumption/wonderware_status` - Pipeline health and statistics
- `GET /consumption/wonderware_timeseries` - Query sensor data by tag and time range
- `GET /consumption/wonderware_tags` - List all available sensor tags
- `GET /consumption/machine` - Machine metadata
- `GET /consumption/machine_type` - Machine type definitions
- `GET /consumption/sensor_data` - Sensor readings by machine
- `GET /consumption/sensor_type` - Sensor type definitions

## Architecture

```
┌─────────────────────────┐
│  Wonderware SQL Server  │
│  (History view)         │
└───────────┬─────────────┘
            │
            │ WonderwareClient
            │ (tag discovery + query)
            ▼
    ┌───────────────┐
    │ Redis Cache   │
    │ (tag lists)   │
    └───────────────┘
            │
            │ WonderwareBatchInserter
            │ (with retry)
            ▼
┌─────────────────────────┐
│      ClickHouse         │
├─────────────────────────┤
│ WonderwareHistory       │ ◄── Raw 1-sec data
│ WonderwareHistory       │ ◄── 1-min aggregates
│   Aggregated            │
│ MachineData             │ ◄── Metadata
└─────────────────────────┘
```

## Key Features

✅ **Automated tag discovery** - Scans Wonderware TagRef table, excludes system tags
✅ **Configurable chunking** - Process 10-50 tags at once, 1-7 day time ranges
✅ **Exponential backoff retry** - Handles transient failures automatically
✅ **Skip duplicates** - Built-in deduplication on insert
✅ **Monthly partitioning** - Fast queries with ClickHouse partitions
✅ **Automatic TTL** - Old data expires automatically (90 days raw, 2 years aggregated)
✅ **Production logging** - Comprehensive logs for monitoring and debugging
✅ **Unit tested** - 22 unit tests covering config, models, and inserter

## Configuration

Minimal required configuration:

```bash
export WONDERWARE_HOST=sql-server-hostname
export WONDERWARE_USERNAME=your-username
export WONDERWARE_PASSWORD=your-password
```

Optional tuning parameters:

```bash
export WONDERWARE_TAG_CHUNK_SIZE=50         # Process more tags at once (default: 10)
export WONDERWARE_BACKFILL_CHUNK_DAYS=7     # Larger time chunks (default: 1)
export WONDERWARE_TAG_CACHE_TTL=7200        # Cache tags for 2 hours (default: 3600)
```

**📋 Full configuration reference:** [v1/514-labs/python/default/README.md#configuration](v1/514-labs/python/default/README.md#configuration)

## Use Cases

- **Manufacturing analytics** - Track production line sensor data for OEE calculations
- **Predictive maintenance** - Historical sensor patterns to predict equipment failures
- **Quality control** - Monitor temperature, pressure, flow rates for quality assurance
- **Energy monitoring** - Track power consumption across facilities
- **Real-time dashboards** - Power Grafana/Tableau dashboards with fast ClickHouse queries

## Performance

**Benchmarks** (tested with 150 tags, 30 days of data):

- **Backfill speed**: ~50,000 rows/minute (depends on SQL Server performance)
- **Sync latency**: < 2 minutes (1-minute schedule + processing time)
- **ClickHouse query speed**: Sub-second response for 1M+ rows with proper indexing
- **Memory usage**: ~200MB during backfill, ~50MB during sync

**Scaling tips**:
- Increase `TAG_CHUNK_SIZE` for faster backfill (diminishing returns beyond 50)
- Add SQL Server indexes on `DateTime` and `TagName` columns
- Use ClickHouse `PREWHERE` clauses for filtering large queries

## Requirements

- **Python**: 3.13 or higher
- **Wonderware/AVEVA Historian**: Access to SQL Server Runtime database
- **ClickHouse**: Any version (local or cloud)
- **Redis**: For tag list caching (optional but recommended)
- **Temporal**: Workflow engine (included with Moose)

## Version History

### v1 (2026-02-06) - Initial Release

**Added:**
- Historical backfill workflow with 4-stage DAG
- Incremental sync workflow (1-minute schedule)
- Automated tag discovery from TagRef table
- Redis caching for tag lists (1-hour TTL)
- Batch insert with exponential backoff retry
- 7 REST APIs for querying and monitoring
- WonderwareHistory table (90-day retention)
- WonderwareHistoryAggregated table (2-year retention)
- Comprehensive unit tests (22 tests)
- Complete documentation and getting started guide

**Known Limitations:**
- No support for string tags (VValue field only)
- Aggregation is manual (not using ClickHouse materialized views yet)
- Single SQL Server source (no multi-source support)

## Support & Contributing

- **📖 Documentation**: [docs/getting-started.md](v1/514-labs/python/default/docs/getting-started.md)
- **🐛 Issues**: [github.com/514-labs/registry/issues](https://github.com/514-labs/registry/issues)
- **💬 Discussions**: [github.com/514-labs/registry/discussions](https://github.com/514-labs/registry/discussions)
- **📚 Moose Docs**: [docs.514.dev](https://docs.514.dev)

## License

MIT License - see [LICENSE](v1/514-labs/_meta/LICENSE)

Copyright (c) 2025 514 Labs
