# Changelog

All notable changes to this pipeline will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1] - 2026-02-06

### Added
- Initial release of Wonderware to ClickHouse pipeline
- `WonderwareHistory` and `WonderwareHistoryAggregated` data models with OlapTable configuration
- `MachineData` model for machine metadata
- Backfill workflow with 4-task DAG: discover_tags -> chunk_dates -> fetch_and_insert -> finalize
- Incremental sync workflow with 1-minute schedule
- Tag discovery from Wonderware TagRef table
- Redis caching for tag lists (configurable TTL)
- Batch insert with exponential backoff retry using tenacity
- APIs: `wonderware_timeseries`, `wonderware_tags`, `machine`, `machine_type`, `sensor_data`, `sensor_type`, `wonderware_status`
- Configuration via environment variables with `WonderwareConfig` dataclass
- Comprehensive unit tests for config, models, and inserter
- Documentation: getting started guide, README, inline code documentation

### Features
- Deduplication via `InsertOptions(skip_duplicates=True)`
- Configurable chunking for large tag sets and date ranges
- Watermark-based incremental sync (queries ClickHouse for last timestamp)
- Connection pooling and retry logic for SQL Server queries
- Pipeline status API showing total tags, data points, data span, oldest/newest data
