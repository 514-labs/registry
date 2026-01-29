# Change Table Schema (Extracted)

This document describes the extracted relational table structure for storing change events.

## Table Structure

The extracted change table maintains the same core structure as the raw change table:

```sql
CREATE TABLE change_events (
    event_id BIGINT PRIMARY KEY,
    event_timestamp TIMESTAMP NOT NULL,
    change_type VARCHAR(10) NOT NULL,
    transaction_id VARCHAR(50) NOT NULL,
    schema_name VARCHAR(128) NOT NULL,
    table_name VARCHAR(128) NOT NULL,
    full_table_name VARCHAR(256) NOT NULL,
    old_values TEXT,
    new_values TEXT
);
```

## Column Descriptions

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| event_id | BIGINT | No | Unique identifier for the change event |
| event_timestamp | TIMESTAMP | No | When the change occurred |
| change_type | VARCHAR(10) | No | Type of change (INSERT/UPDATE/DELETE) |
| transaction_id | VARCHAR(50) | No | Database transaction identifier |
| schema_name | VARCHAR(128) | No | Database schema name |
| table_name | VARCHAR(128) | No | Table name that was changed |
| full_table_name | VARCHAR(256) | No | Fully qualified table name |
| old_values | TEXT | Yes | Previous values as JSON |
| new_values | TEXT | Yes | New values as JSON |

## Indexes

The extracted table includes optimized indexes:

- **Primary Key**: `event_id` (unique identifier)
- **Timestamp Index**: `event_timestamp` for time-based queries
- **Table Index**: `schema_name, table_name` for table-specific queries
- **Transaction Index**: `transaction_id` for transaction-based queries

## Differences from Raw

The extracted table may include:

- Normalized data types for better compatibility
- Additional indexes for query performance
- Optimized storage formats
- Data validation and constraints

## Query Examples

### Get Recent Changes
```sql
SELECT * FROM change_events
ORDER BY event_timestamp DESC
LIMIT 100;
```

### Get Changes for Specific Table
```sql
SELECT * FROM change_events
WHERE schema_name = 'PRODUCTION'
  AND table_name = 'CUSTOMERS'
ORDER BY event_timestamp DESC;
```

### Get Changes by Transaction
```sql
SELECT * FROM change_events
WHERE transaction_id = 'TXN_001'
ORDER BY event_id;
```
