# SAP HANA CDC to ClickHouse

> Maintained by 514-labs

Production-ready pipeline for real-time Change Data Capture from SAP HANA to ClickHouse.

## Overview

This Moose-based pipeline provides:
- **Real-time CDC** from SAP HANA tables and views
- **Automatic synchronization** of new tables
- **Data pruning** with configurable retention policies
- **Model generation** from SAP HANA schemas
- **Production-grade** error handling and monitoring

## Quick Start

```bash
# Install dependencies
pip install moose-cli
pip install -r requirements.txt

# Configure environment
export SAP_HANA_HOST=your-host
export SAP_HANA_USERNAME=user
export SAP_HANA_PASSWORD=pass
export SAP_HANA_SOURCE_SCHEMA=schema
export SAP_HANA_CDC_SCHEMA=cdc_schema
export SAP_HANA_TABLES=TABLE1,TABLE2
export SAP_HANA_CLIENT_ID=client

# Initialize CDC
python init_cdc.py --init-all --tables TABLE1,TABLE2

# Start pipeline
moose dev
```

## Documentation

See the [full documentation](../../../v1/_meta/README.md) for detailed installation, configuration, and usage instructions.

## Available Implementations

- **Python** (default) - Production-ready implementation with full CDC support

## Support

- [Moose Documentation](https://docs.fiveonefour.com/moose)
- [Community Slack](https://join.slack.com/t/moose-community/shared_invite/zt-2fjh5n3wz-cnOmM9Xe9DYAgQrNu8xKxg)
- [Report Issues](https://github.com/514-labs/registry/issues)
