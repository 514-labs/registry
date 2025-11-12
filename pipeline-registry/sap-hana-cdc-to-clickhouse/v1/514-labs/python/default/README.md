# SAP HANA CDC to ClickHouse Pipeline

This is a Python-based Moose pipeline that provides real-time Change Data Capture (CDC) from SAP HANA to ClickHouse.

## Workflows

### CDC Workflow (`cdc`)
- **Purpose**: Continuously syncs changes from SAP HANA to ClickHouse
- **Schedule**: Continuous (runs indefinitely)
- **Features**: 
  - Syncs new tables automatically
  - Processes CDC changes in real-time
  - Updates client status for tracking
  - Handles model generation for new tables

### Pruning Workflow (`prune_database`)
- **Purpose**: Maintains database performance by removing old CDC entries
- **Schedule**: Daily at midnight (`@daily`)
- **Features**:
  - Configurable retention period via `SAP_HANA_CDC_RETENTION_DAYS` (default: 7 days)
  - Comprehensive logging
  - Error handling with retries
  - Automatic cleanup of old change records

[![PyPI Version](https://img.shields.io/pypi/v/moose-cli?logo=python)](https://pypi.org/project/moose-cli/)
[![Moose Community](https://img.shields.io/badge/slack-moose_community-purple.svg?logo=slack)](https://join.slack.com/t/moose-community/shared_invite/zt-2fjh5n3wz-cnOmM9Xe9DYAgQrNu8xKxg)
[![Docs](https://img.shields.io/badge/quick_start-docs-blue.svg)](https://docs.fiveonefour.com/moose/getting-started/quickstart)
[![MIT license](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

## Getting Started

### Prerequisites

* [Python](https://www.python.org/downloads/) (version 3.8+)
* SAP HANA database access
* ClickHouse database access
* [Moose CLI](https://docs.fiveonefour.com/moose/getting-started/quickstart)

### Installation

1. Install Moose CLI: `pip install moose-cli`
2. Install dependencies: `pip install -r requirements.txt`

### Configuration

1. Set up environment variables:
   ```bash
   # SAP HANA Configuration
   export SAP_HANA_HOST=your-hana-host
   export SAP_HANA_PORT=30015
   export SAP_HANA_USERNAME=your-username
   export SAP_HANA_PASSWORD=your-password
   export SAP_HANA_SOURCE_SCHEMA=your-schema
   export SAP_HANA_CDC_SCHEMA=your-schema
   export SAP_HANA_TABLES=TABLE1,TABLE2,TABLE3
   export SAP_HANA_CLIENT_ID=my_client
   
   # Optional: CDC Retention (default: 7 days)
   export SAP_HANA_CDC_RETENTION_DAYS=7
   ```

2. Initialize CDC infrastructure:
   ```bash
   python init_cdc.py --init-cdc --tables TABLE1,TABLE2,TABLE3
   ```

### Running the Pipeline

1. Start the CDC workflow: `moose dev`
2. The pipeline will automatically:
   - Sync new tables to ClickHouse
   - Process CDC changes in real-time
   - Clean up old entries daily

### Manual Operations

- **Generate Moose models**: `python init_cdc.py --recreate-moose-models --tables TABLE1,TABLE2`
- **Recreate CDC tables**: `python init_cdc.py --recreate-cdc-tables --tables TABLE1,TABLE2`
- **Initialize CDC**: `python init_cdc.py --init-cdc --tables TABLE1,TABLE2`

## Learn More

To learn more about Moose, take a look at the following resources:

- [Moose Documentation](https://docs.fiveonefour.com/moose) - learn about Moose.
- [Sloan Documentation](https://docs.fiveonefour.com/sloan) - learn about Sloan, the MCP interface for data engineering.

## Community

You can join the Moose community [on Slack](https://join.slack.com/t/moose-community/shared_invite/zt-2fjh5n3wz-cnOmM9Xe9DYAgQrNu8xKxg). Check out the [MooseStack repo on GitHub](https://github.com/514-labs/moosestack).

## Deploy on Boreal

The easiest way to deploy your MooseStack Applications is to use [Boreal](https://www.fiveonefour.com/boreal) from 514 Labs, the creators of Moose.

[Sign up](https://www.boreal.cloud/sign-up).

## License

This template is MIT licensed.

