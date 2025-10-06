# Getting Started

This guide will help you set up and start using the SAP HANA CDC connector.

## Prerequisites

- Python 3.10 or higher
- SAP HANA database access
- Network connectivity to your SAP HANA instance

## Installation

1. Install the connector:
   ```bash
   pip install -e .
   ```

2. Install additional dependencies if needed:
   ```bash
   pip install -r requirements.txt
   ```

## Basic Configuration

Create a configuration file or set environment variables:

```python
config = {
    "sap_hana": {
        "host": "your-hana-host",
        "port": 30015,
        "user": "your-username", 
        "password": "your-password",
        "schema": "your-schema"
    },
    "cdc": {
        "tables": ["*"],  # Monitor all tables, or specify specific table names
        "exclude_tables": ["system_tables"],  # Tables to exclude
        "change_types": ["INSERT", "UPDATE", "DELETE"],
        "change_table_name": "cdc_changes",
        "change_schema": None  # Uses same schema as SAP HANA config if None
    }
}
```

## Basic Usage

```python
from sap_hana_cdc import Client

# Initialize client
client = Client(config)

# Connect to database
client.connect()

# Initialize CDC infrastructure
client.init_cdc()

# Get recent changes
changes = client.get_changes(limit=100)
for change in changes.changes:
    print(f"Table: {change.table_name}")
    print(f"Type: {change.change_type}")
    print(f"Timestamp: {change.event_timestamp}")
    if change.new_values:
        print(f"New values: {change.new_values}")
    if change.old_values:
        print(f"Old values: {change.old_values}")

# Disconnect when done
client.disconnect()
```

## Next Steps

- Review the [Configuration](configuration.md) guide for advanced options
- Check the [Schema Reference](schema.md) for data structure details
- See [Limits and Considerations](limits.md) for important constraints
