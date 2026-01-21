# SAP HANA View Replication to ClickHouse

This document explains how SAP HANA views are replicated to ClickHouse.

## Overview

SAP HANA views are now replicated as **ClickHouse views** rather than snapshot tables. This means:

- ✅ View logic is recreated in ClickHouse
- ✅ Views automatically reflect current data from underlying tables
- ✅ No initial data load needed for views
- ✅ Views don't require CDC triggers

## How It Works

### 1. Introspection

When you introspect tables/views using `init_cdc.py --recreate-moose-models`:

```bash
python init_cdc.py --recreate-moose-models --tables VIEW1,VIEW2,TABLE1
```

The system will:
- Detect which objects are views vs tables
- Retrieve the view SQL definition from SAP HANA
- Generate Moose models for both tables and views
- Generate a `views.sql` file with ClickHouse-compatible view definitions

### 2. SQL Transformation

The SAP HANA view SQL is automatically transformed to ClickHouse syntax:

- **Schema references**: `"SCHEMA"."TABLE"` → `default.TABLE`
- **Functions**: SAP HANA specific functions converted to ClickHouse equivalents
  - `IFNULL` → `ifNull`
  - `CURRENT_TIMESTAMP` → `now()`
  - `NVL` → `ifNull`
  - `TO_DATE` → `parseDateTimeBestEffort`
- **DUMMY table**: References removed (SAP HANA specific)

### 3. View Creation

The generated `app/ingest/views.sql` file contains CREATE VIEW statements for all views.

**Execute this file in ClickHouse** to create the views:

```bash
# Using clickhouse-client
clickhouse-client --queries-file app/ingest/views.sql

# Or with authentication
clickhouse-client --host <host> --user <user> --password <password> --queries-file app/ingest/views.sql
```

### 4. Workflow

During the initial load workflow:

- **Tables**: Data is loaded from SAP HANA and inserted into ClickHouse
- **Views**: Initial load is **skipped** (no data loading)
  - Views get their data from the underlying replicated tables
  - Views are marked as ACTIVE immediately

## Example

### SAP HANA View

```sql
CREATE VIEW "MYSCHEMA"."CUSTOMER_ORDERS" AS
SELECT
    c.CUSTOMER_ID,
    c.CUSTOMER_NAME,
    o.ORDER_ID,
    o.ORDER_DATE,
    IFNULL(o.TOTAL_AMOUNT, 0) as TOTAL_AMOUNT
FROM "MYSCHEMA"."CUSTOMERS" c
LEFT JOIN "MYSCHEMA"."ORDERS" o ON c.CUSTOMER_ID = o.CUSTOMER_ID
```

### Generated ClickHouse View

```sql
CREATE VIEW IF NOT EXISTS default.CUSTOMER_ORDERS AS
SELECT
    c.CUSTOMER_ID,
    c.CUSTOMER_NAME,
    o.ORDER_ID,
    o.ORDER_DATE,
    ifNull(o.TOTAL_AMOUNT, 0) as TOTAL_AMOUNT
FROM default.CUSTOMERS c
LEFT JOIN default.ORDERS o ON c.CUSTOMER_ID = o.CUSTOMER_ID;
```

## Workflow Steps

1. **Introspect** tables and views:
   ```bash
   python init_cdc.py --recreate-moose-models --tables-from-file tables.txt
   ```

2. **Initialize CDC** infrastructure:
   ```bash
   python init_cdc.py --init-cdc
   ```

3. **Create ClickHouse views**:
   ```bash
   clickhouse-client --queries-file app/ingest/views.sql
   ```

4. **Run the workflow**:
   ```bash
   npx moose-cli dev
   ```

## Benefits

- **Live data**: Views always show current data from underlying tables
- **No storage overhead**: Views don't duplicate data
- **Consistent logic**: View logic from SAP HANA preserved in ClickHouse
- **No CDC needed**: Views don't need change capture triggers

## Limitations

- **SQL Transformation**: Complex SAP HANA SQL may need manual adjustments
- **Functions**: Some SAP HANA functions don't have direct ClickHouse equivalents
- **Manual execution**: The views.sql file must be executed manually in ClickHouse
- **Dependencies**: Views must be created after underlying tables exist

## Troubleshooting

### View creation fails

1. Check that all referenced tables have been replicated and initial load completed
2. Review the generated SQL in `app/ingest/views.sql`
3. Test the SQL directly in ClickHouse to identify syntax issues
4. Manually adjust the SQL if needed for complex transformations

### View shows no data

1. Ensure underlying tables have been loaded
2. Verify table names match between SAP HANA and ClickHouse
3. Check join conditions and schema references

### Unsupported SQL syntax

Some complex SAP HANA features may not transform automatically:
- Modify the SQL in `views.sql` before executing
- Or create a custom ClickHouse view definition manually
