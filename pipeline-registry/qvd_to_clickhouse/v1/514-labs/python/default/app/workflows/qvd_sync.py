from pathlib import Path
from moose_lib import Task, TaskConfig, Workflow, WorkflowConfig, TaskContext
from ..config.qvd_config import QvdConfig
from .lib.qvd_reader import QvdReader
from .lib.batch_inserter import QvdBatchInserter
from ..utils.file_tracker import FileTracker


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


def sync_qvd_files_task(ctx: TaskContext[None]) -> None:
    """
    Sync QVD files to ClickHouse.

    This task:
    1. Lists QVD files from configured source
    2. Identifies new or modified files
    3. Reads QVD data
    4. Inserts into ClickHouse via OlapTable
    5. Tracks processing state
    """
    print("Starting QVD sync task...")

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

    # Initialize components
    reader = QvdReader(storage_options=storage_options)
    tracker = FileTracker(config.state_file)
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
        return

    # Process each file
    for idx, file_path in enumerate(files_to_process, 1):
        file_name = Path(file_path).stem
        print(f"\n[{idx}/{len(files_to_process)}] Processing: {file_name}")

        try:
            # Derive table name
            table_name = derive_table_name(file_path)
            print(f"  Table: {table_name}")

            # Read QVD file
            print(f"  Reading file...")
            df = reader.read_file(file_path)
            print(f"  Rows: {len(df)}")

            # Insert into ClickHouse
            print(f"  Inserting into ClickHouse...")
            inserter.insert_dataframe(table_name, df)

            # Mark as processed
            file_info = reader.get_file_info(file_path)
            tracker.mark_processed(file_path, file_info, len(df))
            print(f"  ✓ Successfully synced {len(df)} rows")

        except Exception as e:
            print(f"  ✗ Error processing {file_name}: {e}")
            tracker.mark_error(file_path, str(e))

    # Print summary
    print("\n" + "="*60)
    print("Sync Summary:")
    summary = tracker.get_status_summary()
    for status, count in summary.items():
        print(f"  {status}: {count}")

    # List any errors
    errors = tracker.list_errors()
    if errors:
        print("\nFiles with errors:")
        for error in errors:
            print(f"  - {Path(error.file_path).name}: {error.error_message}")

    print("="*60)


# Define the sync task
sync_task = Task[None, None](
    name="sync_qvd_files",
    config=TaskConfig(
        run=sync_qvd_files_task,
        retries=2,
        timeout=300
    )
)

# Define the workflow
qvd_sync_workflow = Workflow(
    name="qvd_sync",
    config=WorkflowConfig(
        starting_task=sync_task,
        retries=3,
        timeout=600,
        schedule="@daily"  # Run daily by default (can be overridden via env)
    )
)
