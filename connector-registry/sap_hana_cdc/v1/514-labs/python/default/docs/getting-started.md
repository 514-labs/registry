# Getting Started

This guide will help you set up and start using the SAP HANA CDC connector.

## Prerequisites

- Python 3.10 or higher
- SAP HANA database access
- Network connectivity to your SAP HANA instance

## Installation

1. Install the connector:
   ```bash
   bash -i <(curl https://registry.514.ai/install.sh) --dest app/sap_hana_cdc sap_hana_cdc v1 514-labs python default
   ```

## Basic Configuration

Create a configuration using the `SAPHanaCDCConfig` class or set environment variables:

```python
from sap_hana_cdc import SAPHanaCDCConfig

config = SAPHanaCDCConfig(
    host="your-hana-host",
    port=30015,
    user="your-username", 
    password="your-password",
    source_schema="your-schema",
    cdc_schema="your-schema",
    tables=["TABLE1", "TABLE2"],  # Monitor specific tables, or ["*"] for all
    client_id="my_client"
)
```

Or use environment variables:
```bash
export SAP_HANA_HOST=your-hana-host
export SAP_HANA_PORT=30015
export SAP_HANA_USERNAME=your-username
export SAP_HANA_PASSWORD=your-password
export SAP_HANA_SOURCE_SCHEMA=your-schema
export SAP_HANA_CDC_SCHEMA=your-schema
export SAP_HANA_TABLES=TABLE1,TABLE2
export SAP_HANA_CLIENT_ID=my_client
```

## Basic Usage

```python
from sap_hana_cdc import SAPHanaCDCConnector, SAPHanaCDCConfig

# Initialize connector
config = SAPHanaCDCConfig(
    host="your-hana-host",
    port=30015,
    user="your-username",
    password="your-password",
    source_schema="your-schema",
    tables=["CUSTOMERS", "ORDERS"]  # or ["*"] for all tables
)
connector = SAPHanaCDCConnector.build_from_config(config)

# Initialize CDC infrastructure (requires elevated privileges)
connector.init_cdc()

# Get recent changes
changes = connector.get_changes(limit=100)
for change in changes.changes:
    print(f"Table: {change.table_name}")
    print(f"Type: {change.change_type}")
    print(f"Timestamp: {change.event_timestamp}")
    if change.new_values:
        print(f"New values: {change.new_values}")
    if change.old_values:
        print(f"Old values: {change.old_values}")
```
