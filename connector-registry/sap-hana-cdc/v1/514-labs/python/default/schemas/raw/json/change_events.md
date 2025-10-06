# Change Events Schema

This document describes the raw change events captured by the SAP HANA CDC connector.

## Overview

Change events represent individual database changes (INSERT, UPDATE, DELETE) captured in real-time from SAP HANA tables.

## Schema Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| event_id | string | Yes | Unique identifier for the change event |
| event_timestamp | datetime | Yes | When the change occurred |
| change_type | string | Yes | Type of operation (INSERT/UPDATE/DELETE) |
| transaction_id | string | Yes | Database transaction identifier |
| schema_name | string | Yes | Database schema name |
| table_name | string | Yes | Table name that was changed |
| full_table_name | string | Yes | Fully qualified table name |
| old_values | object/null | No | Previous values (UPDATE/DELETE only) |
| new_values | object/null | No | New values (INSERT/UPDATE only) |

## Example Events

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
    "email": "john@example.com"
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
    "email": "john@example.com"
  },
  "new_values": {
    "id": 1001,
    "name": "John Doe",
    "email": "john.doe@example.com"
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
    "email": "john.doe@example.com"
  },
  "new_values": null
}
```

## Data Quality

- Events are captured in near real-time as they occur
- All events include transaction context for consistency
- JSON values preserve original data types and structure
- Timestamps reflect database server time
