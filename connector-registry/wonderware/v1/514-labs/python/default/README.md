# Wonderware Historian Connector (Python)

Python connector for extracting historical data from AVEVA Wonderware Historian systems with support for tag discovery and time-series data retrieval.

## Features

- **Tag Discovery**: Automatically discover all available tags from the TagRef table
- **Historical Data Extraction**: Fetch time-series data from the History view with flexible date ranges
- **Connection Pooling**: SQLAlchemy-based connection management with automatic retry
- **Circuit Breaker**: Resilient connection handling to prevent cascading failures
- **Health Checks**: Test connectivity and get system status
- **High Performance**: Optimized batch queries with configurable chunk sizes
- **Type-Safe**: Full type hints for better IDE support and code safety

## Requirements

- Python 3.8+
- SQL Server access to Wonderware Historian database
- Network connectivity to Wonderware SQL Server

## Installation

### Standalone Installation

Install the connector as a standalone Python package:

```bash
# Using the 514 registry installer
bash -i <(curl https://registry.514.ai/install.sh) wonderware v1 514-labs python default
cd wonderware
pip install -r requirements.txt
```

### Bundle into Moose Pipeline

To bundle this connector into your Moose pipeline:

```bash
# From your pipeline directory
bash -i <(curl https://registry.514.ai/install.sh) --dest app/wonderware wonderware v1 514-labs python default
```

Then add to your pipeline's `requirements.txt`:
```
sqlalchemy>=2.0.0
python-tds>=1.15.0
tenacity>=8.0.0
```

Or create a symlink (recommended):
```bash
cd app
ln -s ../../../../../../../connector-registry/wonderware/v1/514-labs/python/default/src/wonderware wonderware
```

For complete bundled installation instructions, see the [Wonderware to ClickHouse pipeline documentation](https://registry.514.ai/pipelines/wonderware_to_clickhouse).

## Quick Start

### Basic Usage

```python
from wonderware import WonderwareConnector

# Initialize connector from environment variables
connector = WonderwareConnector.build_from_env()

# Discover available tags
tags = connector.discover_tags()
print(f"Found {len(tags)} tags")

# Fetch historical data
rows = connector.fetch_history_data(
    tag_names=["Temperature", "Pressure"],
    date_from="2026-01-01T00:00:00",
    date_to="2026-01-02T00:00:00",
    inclusive_start=True
)

print(f"Retrieved {len(rows)} data points")

# Check connection status
status = connector.get_status()
print(f"Connected: {status.connected}, Tags: {status.tag_count}")

# Clean up
connector.close()
```

### Using Context Manager

```python
from wonderware import WonderwareConnector

with WonderwareConnector.build_from_env() as connector:
    tags = connector.discover_tags()
    rows = connector.fetch_history_data(
        tag_names=tags[:10],  # First 10 tags
        date_from="2026-01-01T00:00:00",
        date_to="2026-01-01T01:00:00"
    )
    print(f"Retrieved {len(rows)} rows")
```

### Custom Configuration

```python
from wonderware import WonderwareConnector, WonderwareConfig

# Create custom configuration
config = WonderwareConfig(
    host="wonderware-server.example.com",
    port=1433,
    database="Runtime",
    username="readonly_user",
    password="secure_password",
    driver="mssql+pytds"
)

# Build connector with custom config
connector = WonderwareConnector.build_from_config(config)

# Use connector
tags = connector.discover_tags()
connector.close()
```

## Configuration

The connector requires the following environment variables:

```bash
# Required
export WONDERWARE_HOST=your-wonderware-host

# Optional (with defaults)
export WONDERWARE_PORT=1433
export WONDERWARE_DATABASE=Runtime
export WONDERWARE_USERNAME=your-username
export WONDERWARE_PASSWORD=your-password
export WONDERWARE_DRIVER=mssql+pytds  # SQLAlchemy driver
```

See `docs/configuration.md` for detailed configuration options.

## Architecture

The connector implements a clean separation of concerns:

- **`config.py`**: Configuration management with environment variable support
- **`connection_manager.py`**: Connection pooling with circuit breaker pattern
- **`reader.py`**: Low-level data extraction from SQL Server
- **`connector.py`**: High-level facade providing simple API
- **`models.py`**: Type-safe data models (TagInfo, HistoryRow, ConnectorStatus)

## API Reference

### WonderwareConnector

Main connector class providing high-level access to Wonderware data.

#### Methods

- `build_from_env(prefix="WONDERWARE_")` → `WonderwareConnector`
  - Static factory: Build connector from environment variables

- `build_from_config(config)` → `WonderwareConnector`
  - Static factory: Build connector from WonderwareConfig object

- `discover_tags()` → `List[str]`
  - Discover all active tags (excludes System tags)

- `fetch_history_data(tag_names, date_from, date_to, inclusive_start=True)` → `List[Dict]`
  - Fetch historical data for specified tags and date range

- `get_tag_count()` → `int`
  - Get count of active tags

- `test_connection()` → `bool`
  - Test database connectivity

- `get_status()` → `ConnectorStatus`
  - Get connector status with connection info and metrics

- `refresh_connection()` → `None`
  - Refresh database connection

- `close()` → `None`
  - Close all connections and cleanup resources

### WonderwareConfig

Configuration dataclass for Wonderware connection.

#### Fields

- `host` (str, required): SQL Server hostname
- `port` (int): SQL Server port (default: 1433)
- `database` (str): Database name (default: "Runtime")
- `username` (str): SQL Server username (optional)
- `password` (str): SQL Server password (optional)
- `driver` (str): SQLAlchemy driver (default: "mssql+pytds")

### Models

- **`TagInfo`**: Tag metadata (name, tag_type, tag_key)
- **`HistoryRow`**: Historical data row with all 33 Wonderware fields
- **`ConnectorStatus`**: Connector status (connected, host, database, tag_count, last_check, error)

## Examples

### Batch Processing

```python
from wonderware import WonderwareConnector

connector = WonderwareConnector.build_from_env()

# Get all tags
all_tags = connector.discover_tags()

# Process in chunks of 10
chunk_size = 10
for i in range(0, len(all_tags), chunk_size):
    tag_chunk = all_tags[i:i+chunk_size]

    rows = connector.fetch_history_data(
        tag_names=tag_chunk,
        date_from="2026-01-01T00:00:00",
        date_to="2026-01-02T00:00:00"
    )

    print(f"Chunk {i//chunk_size + 1}: {len(rows)} rows")

connector.close()
```

### Incremental Sync

```python
from wonderware import WonderwareConnector
from datetime import datetime, timedelta

connector = WonderwareConnector.build_from_env()

# Get last sync time (from your database/cache)
last_sync = datetime(2026, 1, 1, 12, 0, 0)
current_time = datetime.now()

# Fetch only new data (exclusive start)
rows = connector.fetch_history_data(
    tag_names=["Tag1", "Tag2"],
    date_from=last_sync.isoformat(),
    date_to=current_time.isoformat(),
    inclusive_start=False  # Exclude start time to avoid duplicates
)

print(f"Found {len(rows)} new rows since last sync")
connector.close()
```

### Error Handling

```python
from wonderware import WonderwareConnector
from wonderware.connection_manager import CircuitBreakerOpenError

connector = WonderwareConnector.build_from_env()

try:
    # Test connection first
    if not connector.test_connection():
        print("Cannot connect to Wonderware")
        exit(1)

    # Fetch data
    rows = connector.fetch_history_data(
        tag_names=["Tag1"],
        date_from="2026-01-01T00:00:00",
        date_to="2026-01-02T00:00:00"
    )

except CircuitBreakerOpenError:
    print("Circuit breaker is open - too many failures")

except Exception as e:
    print(f"Error fetching data: {e}")

finally:
    connector.close()
```

## Testing

Run the test suite:

```bash
# Install test dependencies
pip install pytest pytest-cov

# Run all tests
pytest tests/

# Run with coverage
pytest tests/ --cov=wonderware --cov-report=html

# Run specific test file
pytest tests/test_connector.py -v
```

## Troubleshooting

### Connection Issues

If you encounter connection errors:

1. Verify SQL Server is accessible: `telnet <host> <port>`
2. Check credentials and permissions
3. Ensure `python-tds` driver is installed: `pip install python-tds`
4. Try alternative driver: `export WONDERWARE_DRIVER=mssql+pyodbc`

### No Tags Returned

If `discover_tags()` returns an empty list:

1. Check database name is correct (default: "Runtime")
2. Verify TagRef table exists: `SELECT * FROM TagRef LIMIT 1`
3. Ensure user has SELECT permissions on TagRef table
4. Tags starting with "Sys" are excluded by default

### Performance Issues

For large datasets:

1. Use smaller date ranges
2. Process tags in smaller chunks (10-20 at a time)
3. Consider using date-based partitioning
4. Enable connection pooling (already enabled by default)

## Documentation

- [Configuration Guide](docs/configuration.md) - Detailed configuration options
- [Getting Started](docs/getting-started.md) - Step-by-step tutorial
- [API Reference](docs/api-reference.md) - Complete API documentation

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: https://github.com/514-labs/registry/issues
- Documentation: https://registry.514.ai/connectors/wonderware

## Related

- [Wonderware to ClickHouse Pipeline](https://registry.514.ai/pipelines/wonderware_to_clickhouse)
- [SAP HANA CDC Connector](https://registry.514.ai/connectors/sap_hana_cdc)
