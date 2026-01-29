# Change Events (Extracted)

This document describes the extracted and transformed change events from SAP HANA CDC connector.

## Schema

Each extracted change event follows this structure:

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

## Field Descriptions

- **event_id**: Unique identifier for the change event (auto-generated)
- **event_timestamp**: When the change occurred (database timestamp)
- **change_type**: Type of database operation that triggered the change
- **transaction_id**: Database transaction identifier for grouping related changes
- **schema_name**: Database schema containing the changed table
- **table_name**: Name of the table that was changed
- **full_table_name**: Fully qualified table name (schema.table)
- **old_values**: Previous values (for UPDATE/DELETE operations)
- **new_values**: New values (for INSERT/UPDATE operations)

## Usage

The extracted change events are normalized and ready for downstream processing. They maintain the same structure as raw events but may include additional transformations or enrichments applied during extraction.

## Example

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
