# Configuration

This document describes all configuration options available for the SAP HANA CDC connector.

## SAP HANA Configuration

### Required Parameters

- **host**: SAP HANA server hostname or IP address
- **port**: SAP HANA server port (default: 30015)
- **user**: Database username
- **password**: Database password
- **schema**: Default schema name

### Example

```python
sap_hana_config = {
    "host": "hana-server.company.com",
    "port": 30015,
    "user": "cdc_user",
    "password": "secure_password",
    "schema": "PRODUCTION"
}
```

## CDC Configuration

### Table Selection

- **tables**: List of tables to monitor
  - Use `["*"]` to monitor all tables in the schema
  - Specify table names: `["CUSTOMERS", "ORDERS", "PRODUCTS"]`
- **exclude_tables**: Tables to exclude from monitoring
  - Useful when using wildcard selection: `["SYSTEM_TABLES", "TEMP_TABLES"]`

### Change Types

- **change_types**: Types of changes to capture
  - `["INSERT"]` - Only new records
  - `["UPDATE"]` - Only record modifications  
  - `["DELETE"]` - Only record deletions
  - `["INSERT", "UPDATE", "DELETE"]` - All changes (default)

### Storage Configuration

- **change_table_name**: Name of the table to store change events
  - Default: `"cdc_changes"`
- **change_schema**: Schema for the change table
  - If `None`, uses the same schema as SAP HANA config

### Example

```python
cdc_config = {
    "tables": ["CUSTOMERS", "ORDERS"],
    "exclude_tables": [],
    "change_types": ["INSERT", "UPDATE", "DELETE"],
    "change_table_name": "cdc_changes",
    "change_schema": None
}
```

## Complete Configuration Example

```python
config = {
    "sap_hana": {
        "host": "hana-server.company.com",
        "port": 30015,
        "user": "cdc_user",
        "password": "secure_password",
        "schema": "PRODUCTION"
    },
    "cdc": {
        "tables": ["*"],
        "exclude_tables": ["SYSTEM_TABLES", "TEMP_TABLES"],
        "change_types": ["INSERT", "UPDATE", "DELETE"],
        "change_table_name": "cdc_changes",
        "change_schema": None
    }
}
```

## Environment Variables

You can also configure the connector using environment variables:

```bash
export SAP_HANA_HOST="hana-server.company.com"
export SAP_HANA_PORT="30015"
export SAP_HANA_USER="cdc_user"
export SAP_HANA_PASSWORD="secure_password"
export SAP_HANA_SCHEMA="PRODUCTION"
export CDC_TABLES="CUSTOMERS,ORDERS"
export CDC_CHANGE_TABLE="cdc_changes"
```

## Security Considerations

- Store passwords securely using environment variables or secret management systems
- Use dedicated database users with minimal required permissions
- Consider network security and encryption for database connections
- Regularly rotate database credentials
