# QVD-to-ClickHouse Pipeline - Getting Started

Get the pipeline running in 5 minutes.

## Prerequisites

- Python 3.12+
- Access to QVD files (local or S3)
- Moose CLI installed
- pip or uv package manager

## Step 1: Install Dependencies

Using pip:

```bash
cd pipeline-registry/qvd_to_clickhouse/v1/514-labs/python/default
pip install -r requirements.txt
```

## Step 2: Configure Source

Create a `.env` file in the pipeline directory with your configuration:

**For local files:**
```bash
QVD_SOURCE=/path/to/your/qvd/files
```

**For S3:**
```bash
QVD_SOURCE=s3://your-bucket/qvd-files
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

**Additional options (add to `.env` as needed):**

Filtering options:
```bash
QVD_FILE_PATTERN=*.qvd
```
```bash
QVD_INCLUDE_FILES=Item,PO,Reception
```
```bash
QVD_EXCLUDE_FILES=Archive,Temp
```

Processing options:
```bash
QVD_BATCH_SIZE=10000
```
```bash
QVD_SCHEDULE=@daily
```

## Step 3: List Available Files

```bash
python init_qvd.py --list-files --source $QVD_SOURCE
```

Expected output:
```
Found 5 QVD files:

  - Item
  - PurchaseOrder
  - Reception
  - Supplier
  - Warehouse
```

## Step 4: Generate Models

**Generate all models:**
```bash
python init_qvd.py --generate-models --source $QVD_SOURCE
```

**Or generate specific models only:**
```bash
python init_qvd.py --generate-models --source $QVD_SOURCE --files Item,PurchaseOrder
```

**Or exclude certain files:**
```bash
python init_qvd.py --generate-models --source $QVD_SOURCE --exclude Archive,Temp
```

Expected output:
```
Introspecting QVD files...
Found 2 files to process

  Item
    → Class: Item
    → Table: QvdItem
    → Fields: 45
    → Rows: 10,234

  PurchaseOrder
    → Class: PurchaseOrder
    → Table: QvdPurchaseOrder
    → Fields: 67
    → Rows: 5,678

Generating models to: app/ingest/qvd.py
Generated 2 models in app/ingest/qvd.py

✓ Model generation complete!
```

## Step 5: Run the Pipeline

### Option A: Via Moose (Recommended)

```bash
moose dev
```

Then open:
- Temporal UI: http://localhost:8081
- Check workflow execution

### Option B: Manual Test

```bash
python -c "from app.workflows.qvd_sync import sync_qvd_files_task; sync_qvd_files_task(None)"
```

Expected output:
```
Starting QVD sync task...
Source: /path/to/qvd
Pattern: *.qvd
Listing QVD files...
Found 2 total files
After filtering: 2 files
Files to process: 2

[1/2] Processing: Item
  Table: QvdItem
  Reading file...
  Rows: 10234
  Inserting into ClickHouse...
  ✓ Successfully synced 10234 rows

[2/2] Processing: PurchaseOrder
  Table: QvdPurchaseOrder
  Reading file...
  Rows: 5678
  Inserting into ClickHouse...
  ✓ Successfully synced 5678 rows

============================================================
Sync Summary:
  processed: 2
============================================================
```

## Step 6: Verify Data

Connect to ClickHouse:

```bash
clickhouse-client --host localhost --port 9000
```

Query the data:

```sql
-- List tables
SHOW TABLES FROM local;

-- Check data
SELECT count(*) FROM local.QvdItem;
SELECT * FROM local.QvdItem LIMIT 5;
```

## Step 7: Monitor Pipeline Status

Use the API endpoint to monitor the pipeline:

```bash
# Get overall status and file list
curl http://localhost:4000/consumption/qvd_status

# Check for failures
curl "http://localhost:4000/consumption/qvd_status?status=failed"

# View specific file status
curl "http://localhost:4000/consumption/qvd_status?file_name=Item&include_history=true"
```

Expected output:
```json
{
  "summary": {
    "total_files": 2,
    "total_syncs_all_time": 2,
    "syncs_today": 2,
    "total_rows_processed": 15912,
    "current_failures": 0,
    "currently_processing": 0,
    "last_sync_at": "2025-01-29 17:30:45"
  },
  "files": [...],
  "failures": []
}
```

## Troubleshooting

### Issue: Dependencies not found

```bash
pip install -r requirements.txt
```

### Issue: Models not generated

**Check if file exists:**
```bash
ls -lh app/ingest/qvd.py
```

**Regenerate models:**
```bash
python init_qvd.py --generate-models --source $QVD_SOURCE --overwrite
```

### Issue: Files not processing

**Reset state:**
```bash
python init_qvd.py --reset-state --force
```

**Run again:**
```bash
python -c "from app.workflows.qvd_sync import sync_qvd_files_task; sync_qvd_files_task(None)"
```

### Issue: S3 access denied

**Test AWS credentials:**
```bash
aws s3 ls s3://your-bucket/
```

**Or use profile:**
```bash
export AWS_PROFILE=your-profile
```

## Next Steps

1. **Schedule**: The workflow runs daily by default. Check Temporal UI.
2. **Filter**: Use `QVD_INCLUDE_FILES` or `QVD_EXCLUDE_FILES` in `.env`
3. **Tune**: Adjust `QVD_BATCH_SIZE` for performance
4. **Monitor**: Use the API endpoint (`/consumption/qvd_status`) or check `.qvd_state.json`

## Common Commands

**List files:**
```bash
python init_qvd.py --list-files --source $QVD_SOURCE --verbose
```

**Generate models:**
```bash
python init_qvd.py --generate-models --source $QVD_SOURCE
```

**Reset state:**
```bash
python init_qvd.py --reset-state
```

**Run sync:**
```bash
moose dev
```

**Check status via API:**
```bash
curl http://localhost:4000/consumption/qvd_status
```

**Check state file:**
```bash
cat .qvd_state.json | python -m json.tool
```

## Support

If you encounter issues:

1. Check error messages in console output
2. Review `.qvd_state.json` for file-specific errors
3. Check Temporal UI for workflow failures
4. Verify QVD files are accessible

For more help:
- [Moose Documentation](https://docs.fiveonefour.com/moose)
- [Community Slack](https://join.slack.com/t/moose-community/shared_invite/zt-2fjh5n3wz-cnOmM9Xe9DYAgQrNu8xKxg)
- [GitHub Issues](https://github.com/514-labs/registry/issues)
