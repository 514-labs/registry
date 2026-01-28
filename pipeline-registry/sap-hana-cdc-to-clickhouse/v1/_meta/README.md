# SAP HANA CDC to ClickHouse Pipeline (v1)

A production-ready, Moose-based pipeline that provides real-time Change Data Capture (CDC) from SAP HANA to ClickHouse. This pipeline continuously syncs database changes, supports views and tables, and includes automatic data pruning.

## Features

- **Real-time CDC**: Continuous synchronization of changes from SAP HANA to ClickHouse
- **Table & View Support**: Works with both standard tables and database views
- **Automatic Discovery**: New tables are automatically detected and synced
- **Model Generation**: Generates Moose data models automatically from SAP HANA schemas
- **Data Pruning**: Configurable retention policies with daily cleanup
- **Status Tracking**: Client status monitoring for pipeline health
- **Error Handling**: Comprehensive error handling with retries

## Prerequisites

Before installing this pipeline, ensure you have:

- **Python 3.8+** installed
- **SAP HANA Database** access with CDC-enabled schema
- **ClickHouse Database** access
- **Moose CLI** ([Installation Guide](https://docs.fiveonefour.com/moose/getting-started/quickstart))
- Valid database credentials with appropriate permissions

### SAP HANA Requirements

Your SAP HANA database must have:
- CDC capture tables enabled in the source schema
- A dedicated CDC schema for change tracking
- Read permissions on source tables/views
- Write permissions on CDC tables

## Installation

### 1. Install Moose CLI

```bash
pip install moose-cli
```

### 2. Install Pipeline Dependencies

```bash
cd pipeline-registry/sap-hana-cdc-to-clickhouse/v1/514-labs/python/default
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Set the required environment variables for your SAP HANA and pipeline configuration:

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
export SAP_HANA_TABLES=CUSTOMERS,ORDERS,PRODUCTS,INVENTORY

# Client Identifier
export SAP_HANA_CLIENT_ID=my_production_client

# Optional: CDC Retention Period (default: 7 days)
export SAP_HANA_CDC_RETENTION_DAYS=7
```

### 4. Initialize CDC Infrastructure

Before running the pipeline, initialize the CDC infrastructure in SAP HANA:

```bash
python init_cdc.py --init-all --tables CUSTOMERS,ORDERS,PRODUCTS
```

This command will:
- Generate Moose data models from SAP HANA schemas
- Create CDC capture tables for each specified table
- Set up triggers for change tracking
- Configure initial synchronization

## Usage

### Starting the Pipeline

Start the CDC pipeline in development mode:

```bash
moose dev
```

The pipeline will:
1. Connect to SAP HANA and ClickHouse
2. Sync any new tables to ClickHouse
3. Begin processing CDC changes in real-time
4. Run the pruning workflow daily at midnight

### Monitoring

Check the pipeline status and logs:

```bash
# View pipeline logs
moose logs

# Check workflow status
curl http://localhost:4000/workflows
```

### Manual Operations

#### Generate Models for New Tables

```bash
python init_cdc.py --generate-models --tables NEW_TABLE1,NEW_TABLE2
```

#### Recreate CDC Tables

If you need to reset CDC tracking for specific tables:

```bash
python init_cdc.py --recreate-cdc-tables --tables TABLE1,TABLE2
```

#### Reinitialize CDC

To completely reinitialize CDC for tables:

```bash
python init_cdc.py --init-all --tables TABLE1,TABLE2
```

## Workflows

### CDC Workflow (`cdc`)

- **Schedule**: Continuous (runs indefinitely)
- **Purpose**: Syncs changes from SAP HANA to ClickHouse
- **Operations**:
  - Discovers and syncs new tables
  - Processes CDC change records
  - Updates client status
  - Generates models for new tables

### Pruning Workflow (`prune_database`)

- **Schedule**: Daily at midnight (`@daily`)
- **Purpose**: Maintains database performance
- **Operations**:
  - Removes CDC entries older than retention period
  - Configurable via `SAP_HANA_CDC_RETENTION_DAYS`
  - Comprehensive logging and error handling

## Configuration

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SAP_HANA_HOST` | Yes | - | SAP HANA host address |
| `SAP_HANA_PORT` | Yes | - | SAP HANA port number |
| `SAP_HANA_USERNAME` | Yes | - | Database username |
| `SAP_HANA_PASSWORD` | Yes | - | Database password |
| `SAP_HANA_SOURCE_SCHEMA` | Yes | - | Source schema containing tables |
| `SAP_HANA_CDC_SCHEMA` | Yes | - | CDC schema for change tracking |
| `SAP_HANA_TABLES` | Yes | - | Comma-separated list of tables |
| `SAP_HANA_CLIENT_ID` | Yes | - | Unique client identifier |
| `SAP_HANA_CDC_RETENTION_DAYS` | No | 7 | Days to retain CDC records |

### Tables Configuration

Create a `tables.txt` file in the pipeline directory to manage table lists:

```
CUSTOMERS
ORDERS
PRODUCTS
INVENTORY
```

## Troubleshooting

### Pipeline Not Starting

- Verify all environment variables are set correctly
- Check SAP HANA connectivity: `ping $SAP_HANA_HOST`
- Ensure CDC tables exist in SAP HANA
- Review logs: `moose logs`

### Tables Not Syncing

- Verify tables exist in `SAP_HANA_SOURCE_SCHEMA`
- Check CDC triggers are enabled on source tables
- Ensure ClickHouse is accessible
- Run initialization: `python init_cdc.py --init-all --tables TABLE_NAME`

### Data Not Appearing in ClickHouse

- Check if CDC changes are being captured in SAP HANA
- Verify Moose models are generated correctly
- Review workflow logs for errors
- Ensure ClickHouse database and tables exist

### High CDC Table Size

- Reduce `SAP_HANA_CDC_RETENTION_DAYS` value
- Manually trigger pruning workflow
- Check pruning workflow logs for errors

## Support & Resources

- [Moose Documentation](https://docs.fiveonefour.com/moose)
- [Moose Community Slack](https://join.slack.com/t/moose-community/shared_invite/zt-2fjh5n3wz-cnOmM9Xe9DYAgQrNu8xKxg)
- [GitHub Issues](https://github.com/514-labs/registry/issues)

## Deployment

### Deploy on Boreal

The easiest way to deploy this pipeline in production is using [Boreal](https://www.fiveonefour.com/boreal) from 514 Labs.

[Sign up for Boreal](https://www.boreal.cloud/sign-up)

## License

MIT licensed.
