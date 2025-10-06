# SAP HANA CDC Connector

A high-performance, real-time Change Data Capture (CDC) connector for SAP HANA database.

## Features

- **Real-time Change Detection**: Captures INSERT, UPDATE, and DELETE operations as they happen
- **Configurable Table Monitoring**: Monitor specific tables or all tables in a schema
- **Transaction-based Tracking**: Groups changes by transaction for consistency
- **JSON Storage**: Stores change data in JSON format for easy processing
- **High Performance**: Optimized for minimal database impact
- **Flexible Configuration**: Easy setup and configuration options

## Quick Start

1. Install the connector:
   ```bash
   pip install -e .
   ```

2. Configure your SAP HANA connection:
   ```python
   from sap_hana_cdc import Client
   
   client = Client({
       "host": "your-hana-host",
       "port": 30015,
       "user": "your-username",
       "password": "your-password",
       "schema": "your-schema"
   })
   ```

3. Start capturing changes:
   ```python
   client.connect()
   client.init_cdc()
   
   # Get recent changes
   changes = client.get_changes(limit=100)
   for change in changes.changes:
       print(f"Table: {change.table_name}, Type: {change.change_type}")
   ```

## Documentation

- [Getting Started](docs/getting-started.md)
- [Configuration](docs/configuration.md)
- [Schema Reference](docs/schema.md)
- [Limits and Considerations](docs/limits.md)

## License

MIT License - see [LICENSE](LICENSE) for details.
