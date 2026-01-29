"""
Enhanced QVD Sync Workflow with ClickHouse Tracking

This version uses ClickHouse for tracking file processing history.
"""

import time
from pathlib import Path
from moose_lib import Task, TaskConfig, Workflow, WorkflowConfig, TaskContext
from ..config.qvd_config import QvdConfig
from .lib.qvd_reader import QvdReader
from .lib.batch_inserter import QvdBatchInserter
from ..utils.clickhouse_file_tracker import ClickHouseFileTracker


def derive_table_name(file_path: str) -> str:
    """
    Derive table name from file path.

    Args:
        file_path: Path or URL to QVD file

    Returns:
        Table name (e.g., "QvdItem" for "Item.qvd")
    """
    file_name = Path(file_path).stem  # Remove .qvd extension

    # Convert to PascalCase
    parts = file_name.replace('_', ' ').split()
    class_name = ''.join(part.capitalize() for part in parts if part)

    return f"Qvd{class_name}"


def sync_qvd_files_with_tracking_task(ctx: TaskContext[None]) -> None:
    """
    Sync QVD files to ClickHouse with historical tracking.

    This task:
    1. Lists QVD files from configured source
    2. Identifies new or modified files (using ClickHouse tracking)
    3. Reads QVD data
    4. Inserts into ClickHouse via OlapTable
    5. Tracks processing state in ClickHouse (with timing and history)
    """
    print("Starting QVD sync task with ClickHouse tracking...")
    sync_start_time = time.time()

    # Load configuration
    config = QvdConfig.from_env()
    print(f"Source: {config.qvd_source}")
    print(f"Pattern: {config.qvd_file_pattern}")

    # Build storage options for cloud storage (S3, etc.)
    storage_options = {}
    if config.aws_access_key_id:
        storage_options["key"] = config.aws_access_key_id
        storage_options["secret"] = config.aws_secret_access_key
        if config.aws_region:
            storage_options["client_kwargs"] = {"region_name": config.aws_region}

    # Initialize components with ClickHouse tracker
    reader = QvdReader(storage_options=storage_options)
    tracker = ClickHouseFileTracker(batch_size=config.batch_size)
    inserter = QvdBatchInserter(batch_size=config.batch_size)

    # List all QVD files
    print("Listing QVD files...")
    all_files = reader.list_files(config.qvd_source, config.qvd_file_pattern)
    print(f"Found {len(all_files)} total files")

    # Apply include/exclude filters
    filtered_files = []
    for file_path in all_files:
        file_name = Path(file_path).stem

        # Check include list
        if config.include_files and file_name not in config.include_files:
            continue

        # Check exclude list
        if config.exclude_files and file_name in config.exclude_files:
            continue

        filtered_files.append(file_path)

    print(f"After filtering: {len(filtered_files)} files")

    # Get files that need processing
    files_to_process = tracker.get_new_or_modified_files(filtered_files, reader)
    print(f"Files to process: {len(files_to_process)}")

    if not files_to_process:
        print("No new or modified files to process")
        total_duration = time.time() - sync_start_time
        print(f"\nTotal sync duration: {total_duration:.2f}s")
        return

    # Process each file with detailed tracking
    successful = 0
    failed = 0

    for idx, file_path in enumerate(files_to_process, 1):
        file_name = Path(file_path).stem
        print(f"\n[{idx}/{len(files_to_process)}] Processing: {file_name}")

        # Derive table name
        table_name = derive_table_name(file_path)
        print(f"  Table: {table_name}")

        # Get file info for tracking
        try:
            file_info = reader.get_file_info(file_path)
        except Exception as e:
            print(f"  ✗ Error getting file info: {e}")
            continue

        # Mark as processing
        tracker.mark_processing(file_path, file_info, table_name)

        # Start processing timer
        process_start_time = time.time()

        try:
            # Read QVD file
            print(f"  Reading file...")
            read_start = time.time()
            df = reader.read_file(file_path)
            read_duration = time.time() - read_start
            print(f"  Read {len(df):,} rows in {read_duration:.2f}s")

            # Insert into ClickHouse
            print(f"  Inserting into ClickHouse...")
            insert_start = time.time()
            inserter.insert_dataframe(table_name, df)
            insert_duration = time.time() - insert_start
            print(f"  Inserted in {insert_duration:.2f}s")

            # Calculate total processing duration
            process_duration = time.time() - process_start_time

            # Mark as completed
            tracker.mark_completed(
                file_path=file_path,
                file_info=file_info,
                table_name=table_name,
                row_count=len(df),
                processing_duration=process_duration
            )

            print(f"  ✓ Successfully synced {len(df):,} rows in {process_duration:.2f}s")
            print(f"    ({len(df)/process_duration:.0f} rows/sec)")
            successful += 1

        except Exception as e:
            process_duration = time.time() - process_start_time
            error_msg = str(e)

            print(f"  ✗ Error processing {file_name}: {error_msg}")

            # Mark as failed
            tracker.mark_failed(
                file_path=file_path,
                file_info=file_info,
                table_name=table_name,
                error=error_msg,
                processing_duration=process_duration
            )
            failed += 1

    # Print summary
    total_duration = time.time() - sync_start_time
    print("\n" + "="*60)
    print("Sync Summary:")
    print(f"  Total files: {len(files_to_process)}")
    print(f"  Successful: {successful}")
    print(f"  Failed: {failed}")
    print(f"  Total duration: {total_duration:.2f}s")
    print(f"  Average per file: {total_duration/len(files_to_process):.2f}s" if files_to_process else "")
    print("="*60)

    # Note about tracking
    print("\n📊 Tracking data stored in ClickHouse table: local.QvdFileTracking")
    print("   Query with: SELECT * FROM local.QvdFileTracking FINAL ORDER BY processed_at DESC")


# Define the sync task with ClickHouse tracking
sync_with_tracking_task = Task[None, None](
    name="sync_qvd_files_with_tracking",
    config=TaskConfig(
        run=sync_qvd_files_with_tracking_task,
        retries=2,
        timeout=300
    )
)

# Define the workflow
qvd_sync_with_tracking_workflow = Workflow(
    name="qvd_sync_with_tracking",
    config=WorkflowConfig(
        starting_task=sync_with_tracking_task,
        retries=3,
        timeout=600,
        schedule="@daily"  # Run daily by default (can be overridden via env)
    )
)
