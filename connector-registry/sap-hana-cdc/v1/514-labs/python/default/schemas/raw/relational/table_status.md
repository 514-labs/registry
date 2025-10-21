# Table Status Schema

This document describes the database table structure used to track table processing status for different clients.

## Table Structure

The connector creates a table status tracking table with the following structure:

```sql
CREATE TABLE {cdc_schema}.CDC_TABLE_CHANGES_STATUS (
    SCHEMA_NAME VARCHAR(128) NOT NULL,
    TABLE_NAME VARCHAR(128) NOT NULL,
    CLIENT_ID VARCHAR(128) NOT NULL,
    STATUS VARCHAR(128) NOT NULL,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (SCHEMA_NAME, TABLE_NAME, CLIENT_ID)
);
```

## Column Descriptions

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| SCHEMA_NAME | VARCHAR(128) | No | Database schema name |
| TABLE_NAME | VARCHAR(128) | No | Table name being tracked |
| CLIENT_ID | VARCHAR(128) | No | Client identifier for multi-client support |
| STATUS | VARCHAR(128) | No | Current status of the table (NEW, ACTIVE) |
| CREATED_AT | TIMESTAMP | No | When the table status record was created |
| UPDATED_AT | TIMESTAMP | No | When the table status was last updated |

## Status Values

- **NEW**: Table has been added to CDC monitoring but not yet processed by this client
- **ACTIVE**: Table is actively being processed by this client

## Multi-Client Support

The table status is client-specific, allowing multiple clients to track their own processing status for the same tables. Each connector instance uses its configured `client_id` to track table status independently. This enables:

- Independent processing by different clients
- Client-specific table status tracking
- Support for multiple CDC consumers
- Simplified API (no need to pass client_id to methods)

## Query Examples

### Get New Tables for Current Client
```sql
SELECT TABLE_NAME, CREATED_AT 
FROM CDC_TABLE_CHANGES_STATUS 
WHERE CLIENT_ID = 'my_client' 
AND STATUS = 'NEW';
```

### Get All Active Tables for Current Client
```sql
SELECT TABLE_NAME 
FROM CDC_TABLE_CHANGES_STATUS 
WHERE CLIENT_ID = 'my_client' 
AND STATUS = 'ACTIVE';
```

### Update Table Status for Current Client
```sql
UPDATE CDC_TABLE_CHANGES_STATUS 
SET STATUS = 'ACTIVE' 
WHERE SCHEMA_NAME = 'PRODUCTION' 
AND TABLE_NAME = 'CUSTOMERS' 
AND CLIENT_ID = 'my_client';
```

### Get Recently Added Tables (Last 24 Hours)
```sql
SELECT TABLE_NAME, CREATED_AT 
FROM CDC_TABLE_CHANGES_STATUS 
WHERE CLIENT_ID = 'my_client' 
AND CREATED_AT >= CURRENT_TIMESTAMP - INTERVAL '24' HOUR;
```

### Get Tables Updated Recently
```sql
SELECT TABLE_NAME, STATUS, UPDATED_AT 
FROM CDC_TABLE_CHANGES_STATUS 
WHERE CLIENT_ID = 'my_client' 
AND UPDATED_AT >= CURRENT_TIMESTAMP - INTERVAL '1' HOUR
ORDER BY UPDATED_AT DESC;
```

## API Usage

The `get_table_by_status()` method returns tables with their timestamps:

```python
from sap_hana_cdc import SAPHanaCDCConnector, TableStatus

connector = SAPHanaCDCConnector.build_from_config(config)

# Get newly added tables with timestamps
new_tables = connector.get_table_by_status(TableStatus.NEW)
for table_name, created_at, updated_at in new_tables:
    print(f"New table: {table_name} (created: {created_at}, updated: {updated_at})")

# Get active tables with timestamps
active_tables = connector.get_table_by_status(TableStatus.ACTIVE)
for table_name, created_at, updated_at in active_tables:
    print(f"Active table: {table_name} (created: {created_at}, updated: {updated_at})")
```
