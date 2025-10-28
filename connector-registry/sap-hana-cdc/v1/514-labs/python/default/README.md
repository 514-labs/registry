# sap-hana-cdc (Python)

Python-based Change Data Capture (CDC) connector for SAP HANA database with real-time streaming capabilities.

## Features

- **Real-time CDC**: Capture database changes as they happen
- **SAP HANA Integration**: Native support for SAP HANA database
- **Streaming Output**: Kafka integration for real-time data streaming
- **Configurable**: Flexible table and schema selection
- **High Performance**: Async/await support with optimized polling
- **Resilient**: Built-in retry logic and error handling

## Requirements

- Python 3.8+
- SAP HANA database access
- Elevated database privileges for CDC setup
- ClickHouse database (for pipeline usage)

## Installation

```bash
pip install -e .
```

## Quick Start

1. **Configure Environment**
   ```bash
   # Set environment variables
   export SAP_HANA_HOST=your-hana-host
   export SAP_HANA_PORT=30015
   export SAP_HANA_USERNAME=your-username
   export SAP_HANA_PASSWORD=your-password
   export SAP_HANA_SOURCE_SCHEMA=your-schema
   export SAP_HANA_TABLES=TABLE1,TABLE2
   ```

2. **Initialize CDC Infrastructure**
   ```python
   from sap_hana_cdc import SAPHanaCDCConnector, SAPHanaCDCConfig
   
   config = SAPHanaCDCConfig.from_env(prefix="SAP_HANA_")
   connector = SAPHanaCDCConnector.build_from_config(config)
   
   # Initialize CDC (requires elevated privileges)
   connector.init_cdc()
   ```

3. **Process Changes**
   ```python
   # Get changes
   changes = connector.get_changes(limit=100)
   for change in changes.changes:
       print(f"Table: {change.table_name}, Type: {change.change_type}")
   ```

## Configuration

See `docs/configuration.md` for detailed configuration options.

## Architecture

The connector implements a CDC pattern with the following components:

- **Infrastructure**: Manages CDC tables and triggers in SAP HANA
- **Reader**: Extracts change events from CDC tables
- **Connector**: High-level interface orchestrating CDC operations
- **Models**: Data structures for change events and configuration

## Key Features

- **Real-time Change Detection**: Captures INSERT, UPDATE, and DELETE operations
- **Transaction-based Tracking**: Groups changes by transaction for consistency
- **JSON Storage**: Stores change data in JSON format for easy processing
- **Client Status Tracking**: Tracks processing status for multiple clients
- **Table Status Management**: Manages table monitoring lifecycle
- **Pruning Support**: Automatic cleanup of old change records

## Examples

See `examples/` directory for usage examples and integration patterns.
