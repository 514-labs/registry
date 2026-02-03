# QVD to ClickHouse Pipeline

A universal data pipeline that reads QVD (QlikView Data) files from any source and imports them into ClickHouse using Moose.

## Features

- **Universal File System Support**: Read QVD files from any source via `fsspec`:
  - Local filesystem: `/path/to/files`
  - AWS S3: `s3://bucket/path`
  - HTTP/HTTPS: `https://example.com/files`
  - FTP/SFTP: `ftp://server/path`
  - Azure Blob: `abfs://container/path`
  - Google Cloud Storage: `gs://bucket/path`

- **Auto-Generated Models**: Introspect QVD schema and generate Pydantic models automatically

- **Incremental Updates**: Track processed files and only sync new or modified files

- **Batch Processing**: Efficient batch insertion with configurable batch size

- **Scheduled Execution**: Run on a schedule (daily, hourly, etc.) via Moose workflows

## Prerequisites

- Python 3.12 or higher
- Moose CLI installed
- Access to QVD files (local or cloud storage)

## Quick Start

### 1. Installation

Install using the 514 registry:

```bash
bash -i <(curl https://registry.514.ai/install.sh) --type pipeline qvd_to_clickhouse v1 514-labs python default
cd qvd_to_clickhouse
```

Or with a custom destination:

```bash
bash -i <(curl https://registry.514.ai/install.sh) --type pipeline --dest my-qvd-pipeline qvd_to_clickhouse v1 514-labs python default
cd my-qvd-pipeline
```

Then install dependencies:

```bash
pip install -r requirements.txt
```

### 2. Generate Models

List available QVD files:

```bash
# Local files
python init_qvd.py --list-files --source /path/to/qvd

# S3 files
python init_qvd.py --list-files --source s3://my-bucket/qvd-exports
```

Generate Pydantic models:

```bash
# Generate models for all QVD files
python init_qvd.py --generate-models --source /path/to/qvd

# Generate for specific files only
python init_qvd.py --generate-models --source s3://bucket/path --files Item,PO,Reception

# Exclude certain files
python init_qvd.py --generate-models --source /path --exclude Archive,Temp
```

### 3. Configure Environment

Create a `.env` file:

```bash
# Required - supports local path or any fsspec URL
QVD_SOURCE=/path/to/qvd/files
# or
QVD_SOURCE=s3://my-bucket/qvd-exports

# Optional - filtering
QVD_FILE_PATTERN=*.qvd
QVD_INCLUDE_FILES=Item,PO,Reception
QVD_EXCLUDE_FILES=Archive,Temp

# Optional - processing
QVD_BATCH_SIZE=10000
QVD_SCHEDULE=@daily

# Optional - S3 credentials (can also use AWS_PROFILE or IAM role)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_DEFAULT_REGION=us-east-1
```

### 4. Run the Pipeline

Start Moose development server:

```bash
moose dev
```

Or run manually for testing:

```bash
python -c "from app.workflows.qvd_sync import sync_qvd_files_task; sync_qvd_files_task(None)"
```

### 5. Verify Data

Query ClickHouse:

```sql
SELECT count(*) FROM local.QvdItem;
SELECT * FROM local.QvdItem LIMIT 10;
```

### 6. Monitor Status

Use the HTTP API endpoint to check pipeline status:

```bash
# Get overall status
curl http://localhost:4000/consumption/qvd_status

# Filter by file name
curl "http://localhost:4000/consumption/qvd_status?file_name=Item"

# Show only failures
curl "http://localhost:4000/consumption/qvd_status?status=failed"

# Include processing history
curl "http://localhost:4000/consumption/qvd_status?include_history=true"
```

The API returns:
- **Summary**: Total files, syncs, rows processed, failures
- **Files**: Status, row count, processing time for each file
- **Failures**: Recent errors with details

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `QVD_SOURCE` | Yes | - | Source path or URL |
| `QVD_FILE_PATTERN` | No | `*.qvd` | Glob pattern for files |
| `QVD_INCLUDE_FILES` | No | - | Comma-separated whitelist |
| `QVD_EXCLUDE_FILES` | No | - | Comma-separated blacklist |
| `QVD_BATCH_SIZE` | No | `10000` | Rows per insert batch |
| `QVD_SCHEDULE` | No | `@daily` | Workflow schedule |

### AWS Configuration

For S3 sources, credentials can be provided via:

1. Environment variables: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`
2. AWS CLI profile: `AWS_PROFILE`
3. IAM role (for EC2/ECS)

## CLI Tool

The `init_qvd.py` tool provides utilities for pipeline management:

```bash
# List files
python init_qvd.py --list-files --source <path> [--verbose]

# Generate models
python init_qvd.py --generate-models --source <path> [options]
  --files ITEM,PO          # Include only these files
  --exclude ARCHIVE,TEMP   # Exclude these files
  --output app/ingest/qvd.py
  --overwrite              # Overwrite existing file

# Reset tracking state
python init_qvd.py --reset-state [--force]

# S3 options
python init_qvd.py ... --aws-key KEY --aws-secret SECRET
```

## Architecture

```
QVD Files (any source)
  ↓
QvdReader (fsspec)
  ↓
QvdIntrospector (pyqvd)
  ↓
QvdModelGenerator
  ↓
Pydantic Models
  ↓
QvdBatchInserter
  ↓
ClickHouse (via OlapTable)
```

### Key Components

- **QvdReader**: Universal file reader using `fsspec`
- **QvdIntrospector**: Extract schema from QVD files
- **QvdModelGenerator**: Generate Pydantic models
- **ClickHouseFileTracker**: Track processed files in ClickHouse for incremental updates
- **QvdBatchInserter**: Batch insert into ClickHouse
- **qvd_sync_workflow**: Moose workflow for scheduled execution

## Change Detection

The pipeline tracks processed files in ClickHouse and only processes new or modified files:

- **Local files**: Compare `mtime` + `size`
- **S3 files**: Compare `ETag` (content hash)
- **HTTP files**: Compare `Last-Modified` header or `Content-Length`

Tracking state is stored in the `QvdFileTracking` ClickHouse table.

## Troubleshooting

### Models Not Found

If you see `Model 'QvdItemModel' not found`:

```bash
python init_qvd.py --generate-models --source /path/to/qvd
```

### Files Not Processing

Check tracking state:

```bash
# View status via API
curl http://localhost:4000/consumption/qvd_status

# Query tracking table directly
clickhouse-client --query "SELECT * FROM local.QvdFileTracking FINAL ORDER BY processed_at DESC"

# Reset state to reprocess all files
python init_qvd.py --reset-state --force
```

### S3 Access Denied

Verify credentials and bucket permissions:

```bash
# Test with AWS CLI
aws s3 ls s3://your-bucket/path/

# Check credentials
echo $AWS_ACCESS_KEY_ID
echo $AWS_PROFILE
```

### Import Errors

Ensure you're running from the pipeline directory:

```bash
python -c "from app.config.qvd_config import QvdConfig; print('OK')"
```

## Development

### Running Tests

```bash
pytest tests/
```

### Adding New Sources

The pipeline supports any filesystem that `fsspec` supports. To add a new source:

1. Install the appropriate `fsspec` plugin (e.g., `pip install gcsfs` for GCS)
2. Configure credentials if needed
3. Use the source URL (e.g., `gs://bucket/path`)

### Custom Model Generation

Override the model generator to customize output:

```python
from app.utils.qvd_model_generator import QvdModelGenerator

class CustomGenerator(QvdModelGenerator):
    def _generate_model(self, metadata):
        # Custom logic here
        return super()._generate_model(metadata)
```

## Documentation

- [Getting Started Guide](docs/getting-started.md) - Detailed setup guide
- [Architecture Overview](docs/architecture.md) - Technical details

## License

MIT licensed. See [LICENSE](../../_meta/LICENSE) for details.
