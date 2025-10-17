# Configuration

This document describes all configuration options available for the SAP HANA CDC connector.

## SAP HANA Configuration

### Required Parameters

- **host**: SAP HANA server hostname or IP address
- **port**: SAP HANA server port (default: 30015)
- **user**: Database username (default: "SYSTEM")
- **password**: Database password
- **source_schema**: Source schema name (default: "SAPHANADB")
- **cdc_schema**: CDC schema name (default: "SAPHANADB")

### Example

```python
from sap_hana_cdc import SAPHanaCDCConfig

config = SAPHanaCDCConfig(
    host="hana-server.company.com",
    port=30015,
    user="cdc_user",
    password="secure_password",
    source_schema="PRODUCTION",
    cdc_schema="PRODUCTION"
)
```

## CDC Configuration

### Table Selection

- **tables**: List of tables to monitor
  - Use `["*"]` to monitor all tables in the schema
  - Specify table names: `["CUSTOMERS", "ORDERS", "PRODUCTS"]`
  - Default: `[]` (empty list)

### Client Configuration

- **client_id**: Unique identifier for this CDC client
  - Default: `"default_client"`
  - Used for tracking processing status

### Environment Variables

The connector supports configuration via environment variables with the `SAP_HANA_` prefix:

```bash
SAP_HANA_HOST=hana-server.company.com
SAP_HANA_PORT=30015
SAP_HANA_USERNAME=cdc_user
SAP_HANA_PASSWORD=secure_password
SAP_HANA_CLIENT_ID=my_client
SAP_HANA_TABLES=CUSTOMERS,ORDERS,PRODUCTS
SAP_HANA_SOURCE_SCHEMA=PRODUCTION
SAP_HANA_CDC_SCHEMA=PRODUCTION
```

### Example

```python
from sap_hana_cdc import SAPHanaCDCConfig

config = SAPHanaCDCConfig(
    host="hana-server.company.com",
    port=30015,
    user="cdc_user",
    password="secure_password",
    client_id="my_client",
    tables=["CUSTOMERS", "ORDERS"],
    source_schema="PRODUCTION",
    cdc_schema="PRODUCTION"
)
```

## Using Environment Variables

You can also use the `from_env()` method to load configuration from environment variables:

```python
from sap_hana_cdc import SAPHanaCDCConfig, SAPHanaCDCConnector

# Load from environment variables with SAP_HANA_ prefix
config = SAPHanaCDCConfig.from_env(prefix="SAP_HANA_")
connector = SAPHanaCDCConnector.build_from_config(config)
```

## Complete Configuration Example

```python
from sap_hana_cdc import SAPHanaCDCConfig, SAPHanaCDCConnector

config = SAPHanaCDCConfig(
    host="hana-server.company.com",
    port=30015,
    user="cdc_user",
    password="secure_password",
    client_id="my_client",
    tables=["CUSTOMERS", "ORDERS"],
    source_schema="PRODUCTION",
    cdc_schema="PRODUCTION"
)

# Build connector from config
connector = SAPHanaCDCConnector.build_from_config(config)
```

## Security Considerations

- Store passwords securely using environment variables or secret management systems
- Use dedicated database users with minimal required permissions
- Consider network security and encryption for database connections
- Regularly rotate database credentials
