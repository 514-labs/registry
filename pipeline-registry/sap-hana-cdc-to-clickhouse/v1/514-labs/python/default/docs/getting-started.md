# Getting started

This Python implementation provides real-time Change Data Capture (CDC) from SAP HANA to ClickHouse. It continuously syncs database changes, supports tables and views, and includes automatic data pruning.

## Prerequisites
- Python 3.8+
- SAP HANA database with CDC-enabled schema
- ClickHouse database
- Moose CLI

## Install the pipeline

Run the installer:

```bash
bash -i <(curl https://registry.514.ai/install.sh) --type pipeline sap-hana-cdc-to-clickhouse v1 514-labs python default
```

## Install dependencies

From the repository root (i.e. the main folder the installer created):

```bash
pip install -r requirements.txt
```

## Configure environment

Create a local `.env` file or export environment variables in your shell:

```bash
# SAP HANA Connection
export SAP_HANA_HOST=your-hana-host.example.com
export SAP_HANA_PORT=30015
export SAP_HANA_USERNAME=your-username
export SAP_HANA_PASSWORD=your-password

# SAP HANA Schemas
export SAP_HANA_SOURCE_SCHEMA=YOUR_SOURCE_SCHEMA
export SAP_HANA_CDC_SCHEMA=YOUR_CDC_SCHEMA

# Tables to Monitor (comma-separated)
export SAP_HANA_TABLES=CUSTOMERS,ORDERS,PRODUCTS

# Client Identifier
export SAP_HANA_CLIENT_ID=my_client

# Optional: CDC Retention Period (default: 7 days)
export SAP_HANA_CDC_RETENTION_DAYS=7
```

See `moose.config.toml` for ClickHouse and other infrastructure settings.

## Initialize CDC infrastructure

Before running the pipeline, initialize the CDC infrastructure in SAP HANA:

```bash
python init_cdc.py --init-all --tables CUSTOMERS,ORDERS,PRODUCTS
```

This command will:
- Generate Moose data models from SAP HANA schemas
- Create CDC capture tables for each specified table
- Set up triggers for change tracking
- Configure initial synchronization

## Run the dev server

From the repository root:

```bash
moose dev
```

The pipeline will:
- Connect to SAP HANA and ClickHouse
- Sync any new tables to ClickHouse
- Begin processing CDC changes in real-time
- Run the pruning workflow daily at midnight

## Monitor the pipeline

Check pipeline status and logs:

```bash
# View pipeline logs
moose logs

# Check workflow status
curl http://localhost:4000/workflows
```

## Manual operations

### Generate models for new tables

```bash
python init_cdc.py --generate-models --tables NEW_TABLE1,NEW_TABLE2
```

### Recreate CDC tables

If you need to reset CDC tracking for specific tables:

```bash
python init_cdc.py --recreate-cdc-tables --tables TABLE1,TABLE2
```

### Reinitialize CDC

To completely reinitialize CDC for tables:

```bash
python init_cdc.py --init-all --tables TABLE1,TABLE2
```

## Workflows

### CDC Workflow (`cdc`)
- **Schedule**: Continuous (runs indefinitely)
- **Purpose**: Syncs changes from SAP HANA to ClickHouse
- Discovers and syncs new tables automatically
- Processes CDC change records in real-time
- Updates client status for monitoring

### Pruning Workflow (`prune_database`)
- **Schedule**: Daily at midnight (`@daily`)
- **Purpose**: Maintains database performance
- Removes CDC entries older than retention period
- Configurable via `SAP_HANA_CDC_RETENTION_DAYS`

## Troubleshooting

### Pipeline not starting
- Verify all environment variables are set correctly
- Check SAP HANA connectivity: `ping $SAP_HANA_HOST`
- Ensure CDC tables exist in SAP HANA
- Review logs: `moose logs`

### Tables not syncing
- Verify tables exist in `SAP_HANA_SOURCE_SCHEMA`
- Check CDC triggers are enabled on source tables
- Ensure ClickHouse is accessible
- Run initialization: `python init_cdc.py --init-all --tables TABLE_NAME`

### Data not appearing in ClickHouse
- Check if CDC changes are being captured in SAP HANA
- Verify Moose models are generated correctly
- Review workflow logs for errors
- Ensure ClickHouse database and tables exist

## Support

- [Moose Documentation](https://docs.fiveonefour.com/moose)
- [Moose Community Slack](https://join.slack.com/t/moose-community/shared_invite/zt-2fjh5n3wz-cnOmM9Xe9DYAgQrNu8xKxg)
- [GitHub Issues](https://github.com/514-labs/registry/issues)
