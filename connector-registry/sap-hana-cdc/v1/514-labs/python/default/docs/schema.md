# Schema Reference

This document describes the data structures and schemas used by the SAP HANA CDC connector.

## Change Event Schema

Each change event captured by the connector follows this schema:

```json
{
  "event_id": "string",
  "event_timestamp": "datetime",
  "change_type": "INSERT|UPDATE|DELETE",
  "transaction_id": "string",
  "schema_name": "string",
  "table_name": "string", 
  "full_table_name": "string",
  "old_values": "object|null",
  "new_values": "object|null"
}
```

### Field Descriptions

- **event_id**: Unique identifier for the change event (auto-generated)
- **event_timestamp**: When the change occurred (database timestamp)
- **change_type**: Type of database operation that triggered the change
- **transaction_id**: Database transaction identifier for grouping related changes
- **schema_name**: Database schema containing the changed table
- **table_name**: Name of the table that was changed
- **full_table_name**: Fully qualified table name (schema.table)
- **old_values**: Previous values (for UPDATE/DELETE operations)
- **new_values**: New values (for INSERT/UPDATE operations)

## Database Schema

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

## Data Types

### Change Types

- **INSERT**: New record created
- **UPDATE**: Existing record modified
- **DELETE**: Record removed

### JSON Storage

- **old_values**: JSON object containing the previous state of the record
- **new_values**: JSON object containing the new state of the record
- Both fields use NCLOB for storage to handle large JSON documents

## Example Change Events

### INSERT Event

```json
{
  "event_id": "12345",
  "event_timestamp": "2024-01-15T10:30:00Z",
  "change_type": "INSERT",
  "transaction_id": "TXN_001",
  "schema_name": "PRODUCTION",
  "table_name": "CUSTOMERS",
  "full_table_name": "PRODUCTION.CUSTOMERS",
  "old_values": null,
  "new_values": {
    "id": 1001,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### UPDATE Event

```json
{
  "event_id": "12346",
  "event_timestamp": "2024-01-15T10:31:00Z",
  "change_type": "UPDATE",
  "transaction_id": "TXN_002",
  "schema_name": "PRODUCTION",
  "table_name": "CUSTOMERS",
  "full_table_name": "PRODUCTION.CUSTOMERS",
  "old_values": {
    "id": 1001,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "new_values": {
    "id": 1001,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### DELETE Event

```json
{
  "event_id": "12347",
  "event_timestamp": "2024-01-15T10:32:00Z",
  "change_type": "DELETE",
  "transaction_id": "TXN_003",
  "schema_name": "PRODUCTION",
  "table_name": "CUSTOMERS",
  "full_table_name": "PRODUCTION.CUSTOMERS",
  "old_values": {
    "id": 1001,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "new_values": null
}
```

## Batch Processing

When retrieving changes, the connector returns a batch structure:

```json
{
  "changes": [
    // Array of change events as described above
  ]
}
```

## Query Parameters

When querying changes, you can use these parameters:

- **since**: Only return changes after this timestamp
- **from_event_id**: Only return changes after this event ID
- **limit**: Maximum number of changes to return (default: 1000)
