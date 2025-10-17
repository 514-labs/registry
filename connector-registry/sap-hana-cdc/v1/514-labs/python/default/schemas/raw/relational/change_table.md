# Change Table Schema

This document describes the database table structure used to store change events.

## Table Structure

The connector creates a change tracking table with the following structure:

```sql
CREATE TABLE {change_schema}.{change_table_name} (
    CHANGE_ID BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    TABLE_SCHEMA VARCHAR(128) NOT NULL,
    TABLE_NAME VARCHAR(128) NOT NULL,
    CHANGE_TYPE VARCHAR(10) NOT NULL,
    CHANGE_TIMESTAMP TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TRANSACTION_ID VARCHAR(50) NOT NULL,
    OLD_VALUES NCLOB,
    NEW_VALUES NCLOB
);
```

## Column Descriptions

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| CHANGE_ID | BIGINT | No | Auto-generated primary key |
| TABLE_SCHEMA | VARCHAR(128) | No | Database schema name |
| TABLE_NAME | VARCHAR(128) | No | Table name that was changed |
| CHANGE_TYPE | VARCHAR(10) | No | Type of change (INSERT/UPDATE/DELETE) |
| CHANGE_TIMESTAMP | TIMESTAMP | No | When the change occurred |
| TRANSACTION_ID | VARCHAR(50) | No | Database transaction identifier |
| OLD_VALUES | NCLOB | Yes | Previous values as JSON |
| NEW_VALUES | NCLOB | Yes | New values as JSON |

## Indexes

The table includes the following indexes for optimal query performance:

- **Primary Key**: `CHANGE_ID` (auto-generated)
- **Timestamp Index**: `CHANGE_TIMESTAMP` for time-based queries
- **Table Index**: `TABLE_SCHEMA, TABLE_NAME` for table-specific queries
- **Transaction Index**: `TRANSACTION_ID` for transaction-based queries

## Storage Considerations

- **NCLOB Fields**: Used for JSON storage to handle large documents
- **Identity Column**: Auto-incrementing primary key for ordering
- **Timestamp Default**: Uses database server time for consistency
- **VARCHAR Sizes**: Sized for typical SAP HANA identifiers

## Query Examples

### Get Recent Changes
```sql
SELECT * FROM cdc_changes 
ORDER BY CHANGE_TIMESTAMP DESC 
LIMIT 100;
```

### Get Changes for Specific Table
```sql
SELECT * FROM cdc_changes 
WHERE TABLE_SCHEMA = 'PRODUCTION' 
  AND TABLE_NAME = 'CUSTOMERS'
ORDER BY CHANGE_TIMESTAMP DESC;
```

### Get Changes by Transaction
```sql
SELECT * FROM cdc_changes 
WHERE TRANSACTION_ID = 'TXN_001'
ORDER BY CHANGE_ID;
```

## Maintenance

- **Retention Policy**: Implement data retention to manage table size
- **Index Maintenance**: Monitor and maintain indexes for performance
- **Storage Monitoring**: Track table growth and storage usage
