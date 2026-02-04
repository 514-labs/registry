# QVD to ClickHouse

> Maintained by 514-labs

Universal data pipeline for QVD (QlikView Data) files to ClickHouse with incremental tracking.

## Overview

This Moose-based pipeline provides:
- **Universal file system support** via fsspec (local, S3, HTTP, FTP, Azure, GCS)
- **Automatic model generation** from QVD schemas
- **Incremental processing** with smart change detection
- **Batch insertion** for efficient data loading
- **Scheduled execution** via Moose workflows

## Installation

Install using the 514 registry:

```bash
bash -i <(curl https://registry.514.ai/install.sh) --type pipeline qvd_to_clickhouse v1 514-labs python default
cd qvd_to_clickhouse
pip install -r requirements.txt
```

## Quick Start

```bash
# Configure environment
export QVD_SOURCE=/path/to/qvd/files
# or
export QVD_SOURCE=s3://bucket/path

# Generate models
python init_qvd.py --generate-models --source $QVD_SOURCE

# Start pipeline
moose dev

# Check status via API
curl http://localhost:4000/consumption/qvd_status
```

## Supported File Systems

- **Local**: `file:///path/to/files` or `/path/to/files`
- **S3**: `s3://bucket/path`
- **HTTP**: `https://example.com/files`
- **FTP**: `ftp://server/path`
- **Azure**: `abfs://container/path`
- **GCS**: `gs://bucket/path`

## Documentation

See the [full documentation](../../_meta/README.md) for detailed installation, configuration, and usage instructions.

## Available Implementations

- **Python** (default) - Production-ready implementation with universal file system support

## Support

- [Moose Documentation](https://docs.fiveonefour.com/moose)
- [Community Slack](https://join.slack.com/t/moose-community/shared_invite/zt-2fjh5n3wz-cnOmM9Xe9DYAgQrNu8xKxg)
- [Report Issues](https://github.com/514-labs/registry/issues)
