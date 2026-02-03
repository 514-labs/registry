# QVD to ClickHouse Pipeline (v1)

A universal data pipeline that reads QVD (QlikView Data) files from any source and imports them into ClickHouse using Moose. Supports local files, S3, HTTP, and any filesystem supported by fsspec.

## Features

- **Universal File System Support**: Read QVD files from any source:
  - Local filesystem: `file:///path/to/files`
  - AWS S3: `s3://bucket/path`
  - HTTP/HTTPS: `https://example.com/files`
  - FTP/SFTP, Azure Blob, Google Cloud Storage, and more
- **Auto-Generated Models**: Introspect QVD schemas and generate Pydantic models automatically
- **Incremental Updates**: Track processed files and only sync new or modified files
- **Batch Processing**: Efficient batch insertion with configurable batch size
- **Scheduled Execution**: Run on a schedule (daily, hourly, etc.) via Moose workflows
- **Change Detection**: Smart tracking based on file metadata (mtime, ETag, size)

## Prerequisites

Before installing this pipeline, ensure you have:

- **Python 3.12+** installed
- **Moose CLI** ([Installation Guide](https://docs.fiveonefour.com/moose/getting-started/quickstart))
- **Access to QVD files** (local or cloud storage)
- **ClickHouse Database** access

## Installation

### 1. Install Pipeline from Registry

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

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the pipeline directory:

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

### 4. Generate Models

Before running the pipeline, generate Pydantic models from your QVD files:

```bash
# List available QVD files
python init_qvd.py --list-files --source /path/to/qvd

# Generate models for all QVD files
python init_qvd.py --generate-models --source /path/to/qvd

# Generate for specific files only
python init_qvd.py --generate-models --source s3://bucket/path --files Item,PO,Reception

# Exclude certain files
python init_qvd.py --generate-models --source /path --exclude Archive,Temp
```

## Usage

### Starting the Pipeline

Start the pipeline in development mode:

```bash
moose dev
```

The pipeline will:
1. List all QVD files from the configured source
2. Filter files based on include/exclude patterns
3. Check tracking state to identify new or modified files
4. Generate models if needed
5. Read QVD files and batch insert into ClickHouse
6. Update tracking state for incremental processing

### Monitoring

Check the pipeline status and logs:

```bash
# View pipeline logs
moose logs

# Check workflow status via Temporal UI
open http://localhost:8081

# View tracking state via API
curl http://localhost:4000/consumption/qvd_status
```

#### QVD Status API Endpoint

The pipeline provides an HTTP API endpoint for real-time status monitoring:

```bash
# Get overall status and file list
curl http://localhost:4000/consumption/qvd_status

# Filter by file name
curl "http://localhost:4000/consumption/qvd_status?file_name=Item"

# Filter by status (completed, failed, processing)
curl "http://localhost:4000/consumption/qvd_status?status=failed"

# Include processing history
curl "http://localhost:4000/consumption/qvd_status?include_history=true"

# Limit results
curl "http://localhost:4000/consumption/qvd_status?limit=10"
```

**Response includes:**
- **Summary**: Total files, syncs today, rows processed, current failures
- **Files**: List of processed files with status, row count, processing duration
- **Failures**: Recent failed files with error messages
- **History**: Optional processing history for each file

### Manual Execution

For testing or manual runs:

```bash
python -c "from app.workflows.qvd_sync import sync_qvd_files_task; sync_qvd_files_task(None)"
```

### Verify Data in ClickHouse

```sql
-- List QVD tables
SHOW TABLES FROM local WHERE name LIKE 'Qvd%';

-- Check data
SELECT count(*) FROM local.QvdItem;
SELECT * FROM local.QvdItem LIMIT 10;
```

## CLI Tool

The `init_qvd.py` tool provides utilities for pipeline management:

### List Files

```bash
# List all QVD files
python init_qvd.py --list-files --source /path/to/qvd

# Verbose output with details
python init_qvd.py --list-files --source s3://bucket/path --verbose
```

### Generate Models

```bash
# Generate models for all files
python init_qvd.py --generate-models --source /path/to/qvd

# Include only specific files
python init_qvd.py --generate-models --source /path --files ITEM,PO

# Exclude specific files
python init_qvd.py --generate-models --source /path --exclude ARCHIVE,TEMP

# Specify output file
python init_qvd.py --generate-models --source /path --output app/ingest/custom.py

# Overwrite existing file
python init_qvd.py --generate-models --source /path --overwrite
```

### Reset State

```bash
# Reset tracking state to reprocess all files
python init_qvd.py --reset-state --force
```

### S3 Options

```bash
# Use explicit AWS credentials
python init_qvd.py --list-files --source s3://bucket/path \
  --aws-key YOUR_KEY \
  --aws-secret YOUR_SECRET
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

- **QvdReader**: Universal file reader using `fsspec` for any storage backend
- **QvdIntrospector**: Extract schema metadata from QVD files
- **QvdModelGenerator**: Generate Pydantic models from QVD schemas
- **ClickHouseFileTracker**: Track processed files in ClickHouse for incremental updates
- **QvdBatchInserter**: Efficient batch insertion into ClickHouse
- **qvd_sync_workflow**: Moose workflow for scheduled execution

## Configuration

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `QVD_SOURCE` | Yes | - | Source path or fsspec URL |
| `QVD_FILE_PATTERN` | No | `*.qvd` | Glob pattern for file matching |
| `QVD_INCLUDE_FILES` | No | - | Comma-separated file whitelist |
| `QVD_EXCLUDE_FILES` | No | - | Comma-separated file blacklist |
| `QVD_BATCH_SIZE` | No | `10000` | Rows per insert batch |
| `QVD_SCHEDULE` | No | `@daily` | Workflow schedule (cron or shorthand) |

### AWS Configuration

For S3 sources, credentials can be provided via:

1. **Environment variables**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`
2. **AWS CLI profile**: `AWS_PROFILE=your-profile`
3. **IAM role**: Automatic for EC2/ECS/Lambda instances

### File Filtering

Control which files are processed:

```bash
# Include only specific files (comma-separated, case-insensitive)
QVD_INCLUDE_FILES=Item,PurchaseOrder,Reception

# Exclude specific files (comma-separated, case-insensitive)
QVD_EXCLUDE_FILES=Archive,Temp,Test

# Custom pattern
QVD_FILE_PATTERN=prod_*.qvd
```

## Change Detection

The pipeline tracks processed files in ClickHouse and only processes new or modified files:

- **Local files**: Compare modification time (`mtime`) + file size
- **S3 files**: Compare ETag (content hash)
- **HTTP files**: Compare `Last-Modified` header or `Content-Length`

Tracking state is stored in the `QvdFileTracking` ClickHouse table and includes:
- Last processed timestamp
- File metadata (mtime, size, ETag)
- Processing status and error messages
- Processing duration and row counts

## Troubleshooting

### Pipeline Not Starting

- Verify `QVD_SOURCE` is set correctly
- Check file system access (permissions, credentials)
- Ensure Moose is running: `moose dev`
- Review logs: `moose logs`

### Models Not Found

If you see errors about missing models:

```bash
# Generate models for all QVD files
python init_qvd.py --generate-models --source /path/to/qvd

# Check if models were created
ls -lh app/ingest/qvd.py
```

### Files Not Processing

Check tracking state and reset if needed:

```bash
# View current state via API
curl http://localhost:4000/consumption/qvd_status

# Query tracking table directly
clickhouse-client --query "SELECT * FROM local.QvdFileTracking FINAL ORDER BY processed_at DESC"

# Reset state to reprocess all files
python init_qvd.py --reset-state --force

# Run sync manually to test
python -c "from app.workflows.qvd_sync import sync_qvd_files_task; sync_qvd_files_task(None)"
```

### S3 Access Denied

Verify credentials and permissions:

```bash
# Test with AWS CLI
aws s3 ls s3://your-bucket/path/

# Check environment variables
echo $AWS_ACCESS_KEY_ID
echo $AWS_PROFILE

# Verify bucket policy allows ListBucket and GetObject
```

### Import Errors

Ensure you're running from the correct directory:

```bash
cd pipeline-registry/qvd_to_clickhouse/v1/514-labs/python/default
python -c "from app.config.qvd_config import QvdConfig; print('OK')"
```

### Data Not Appearing in ClickHouse

- Verify models were generated correctly
- Check ClickHouse connection in `moose.config.toml`
- Review workflow logs in Temporal UI
- Ensure ClickHouse database exists: `SELECT * FROM system.databases WHERE name = 'local'`

## Advanced Usage

### Custom Model Generation

Override the model generator for custom output:

```python
from app.utils.qvd_model_generator import QvdModelGenerator

class CustomGenerator(QvdModelGenerator):
    def _generate_model(self, metadata):
        # Custom logic here
        return super()._generate_model(metadata)
```

### Adding New File Systems

The pipeline supports any filesystem that `fsspec` supports:

1. Install the appropriate `fsspec` plugin:
   ```bash
   pip install gcsfs  # For Google Cloud Storage
   pip install adlfs  # For Azure Data Lake
   ```

2. Use the appropriate URL scheme:
   ```bash
   QVD_SOURCE=gs://bucket/path  # Google Cloud Storage
   QVD_SOURCE=abfs://container/path  # Azure Blob Storage
   ```

### Running Tests

```bash
pytest tests/
```

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
