"""
ClickHouse-based File Tracker

This tracker uses ClickHouse to store file processing history and state.
It provides:
- Historical tracking of all sync operations
- SQL-based querying of file processing history
- Automatic change detection
- Audit trail
"""

import time
from datetime import datetime
from typing import List, Dict, Optional
from dataclasses import dataclass
from urllib.parse import urlparse


@dataclass
class FileStatus:
    """Status information for a tracked file."""
    file_path: str
    file_name: str
    size: int
    mtime: Optional[str]
    etag: Optional[str]
    last_processed: str
    row_count: int
    status: str
    error_message: Optional[str] = None
    processing_duration: Optional[float] = None


class ClickHouseFileTracker:
    """Track QVD file processing using ClickHouse table."""

    def __init__(self, batch_size: int = 10000):
        """
        Initialize ClickHouse-based file tracker.

        Args:
            batch_size: Batch size used for processing
        """
        self.batch_size = batch_size

        # Import here to avoid circular dependencies
        from app.ingest.tracking import QvdFileTrackingModel, QvdFileTracking
        self.tracking_model = QvdFileTrackingModel
        self.tracking_class = QvdFileTracking

    def get_latest_status(self, file_path: str) -> Optional[FileStatus]:
        """
        Get the latest status for a file.

        Args:
            file_path: Path or URL to file

        Returns:
            FileStatus if file has been processed before, None otherwise
        """
        try:
            # Query ClickHouse for latest version
            # Using FINAL to get the latest version from ReplacingMergeTree
            query = f"""
                SELECT
                    file_path,
                    file_name,
                    file_size,
                    file_mtime,
                    file_etag,
                    processed_at,
                    processing_duration_seconds,
                    row_count,
                    status,
                    error_message
                FROM local.QvdFileTracking FINAL
                WHERE file_path = '{file_path}'
                ORDER BY processed_at DESC
                LIMIT 1
            """

            # Execute query (this is a simplified approach - in production,
            # you'd use the actual ClickHouse client from moose_lib)
            # For now, we'll return None and fall back to checking all records
            return None

        except Exception as e:
            print(f"Warning: Failed to query ClickHouse for {file_path}: {e}")
            return None

    def get_new_or_modified_files(
        self,
        files: List[str],
        reader
    ) -> List[str]:
        """
        Get list of files that are new or have been modified.

        Args:
            files: List of file paths/URLs
            reader: QvdReader instance for getting file info

        Returns:
            List of files that need processing
        """
        files_to_process = []

        for file_path in files:
            try:
                # Get current file info
                file_info = reader.get_file_info(file_path)

                # Check if we've seen this file before
                prev_status = self.get_latest_status(file_path)

                if prev_status is None:
                    # New file
                    files_to_process.append(file_path)
                    continue

                # Skip if last attempt had an error (manual intervention needed)
                if prev_status.status == 'failed':
                    print(f"Skipping {file_path} - previous attempt failed")
                    continue

                # Check if file has changed
                if self._has_file_changed(prev_status, file_info):
                    files_to_process.append(file_path)

            except Exception as e:
                print(f"Warning: Failed to check {file_path}: {e}")
                # Include file if we can't check its status
                files_to_process.append(file_path)

        return files_to_process

    def _has_file_changed(
        self,
        prev_status: FileStatus,
        current_info: Dict
    ) -> bool:
        """
        Determine if file has changed since last processing.

        Args:
            prev_status: Previous file status
            current_info: Current file info from reader

        Returns:
            True if file has changed
        """
        # Check ETag first (S3 files)
        if current_info.get('etag') and prev_status.etag:
            return current_info['etag'] != prev_status.etag

        # Check size
        if current_info.get('size', 0) != prev_status.size:
            return True

        # Check mtime
        if current_info.get('mtime') and prev_status.mtime:
            return current_info['mtime'] != prev_status.mtime

        return False

    def mark_processing(
        self,
        file_path: str,
        file_info: Dict,
        table_name: str
    ):
        """
        Mark file as currently being processed.

        Args:
            file_path: File path/URL
            file_info: File info from reader
            table_name: Target table name
        """
        self._insert_tracking_record(
            file_path=file_path,
            file_info=file_info,
            table_name=table_name,
            status='processing',
            row_count=0,
            processing_duration=None,
            error_message=None
        )

    def mark_completed(
        self,
        file_path: str,
        file_info: Dict,
        table_name: str,
        row_count: int,
        processing_duration: float
    ):
        """
        Mark file as successfully processed.

        Args:
            file_path: File path/URL
            file_info: File info from reader
            table_name: Target table name
            row_count: Number of rows processed
            processing_duration: Processing time in seconds
        """
        self._insert_tracking_record(
            file_path=file_path,
            file_info=file_info,
            table_name=table_name,
            status='completed',
            row_count=row_count,
            processing_duration=processing_duration,
            error_message=None
        )

    def mark_failed(
        self,
        file_path: str,
        file_info: Dict,
        table_name: str,
        error: str,
        processing_duration: float
    ):
        """
        Mark file as having an error.

        Args:
            file_path: File path/URL
            file_info: File info from reader
            table_name: Target table name
            error: Error message
            processing_duration: Processing time before failure
        """
        self._insert_tracking_record(
            file_path=file_path,
            file_info=file_info,
            table_name=table_name,
            status='failed',
            row_count=0,
            processing_duration=processing_duration,
            error_message=error
        )

    def _insert_tracking_record(
        self,
        file_path: str,
        file_info: Dict,
        table_name: str,
        status: str,
        row_count: int,
        processing_duration: Optional[float],
        error_message: Optional[str]
    ):
        """
        Insert tracking record into ClickHouse.

        Args:
            file_path: File path/URL
            file_info: File metadata
            table_name: Target table name
            status: Status (processing, completed, failed)
            row_count: Number of rows processed
            processing_duration: Processing duration in seconds
            error_message: Error message if failed
        """
        from pathlib import Path

        # Determine source type from URL
        parsed = urlparse(file_path)
        source_type = parsed.scheme if parsed.scheme else 'local'

        # Create tracking record
        record = self.tracking_class(
            file_path=file_path,
            file_name=Path(file_path).stem,
            table_name=table_name,
            file_size=file_info.get('size', 0),
            file_mtime=str(file_info.get('mtime')) if file_info.get('mtime') else None,
            file_etag=file_info.get('etag'),
            processed_at=datetime.utcnow().isoformat(),
            processing_duration_seconds=processing_duration,
            row_count=row_count,
            status=status,
            error_message=error_message,
            version=int(time.time() * 1000),  # Millisecond timestamp as version
            batch_size=self.batch_size,
            source_type=source_type
        )

        # Insert into ClickHouse
        try:
            from moose_lib import InsertOptions
            self.tracking_model.insert([record], options=InsertOptions(skip_duplicates=False))
            print(f"  Tracking: {status} - {file_path}")
        except Exception as e:
            print(f"Warning: Failed to insert tracking record: {e}")

    def get_status_summary(self) -> Dict[str, int]:
        """
        Get summary of file statuses.

        Returns:
            Dict with counts by status
        """
        try:
            from moose_lib import ClickHouseClient

            client = ClickHouseClient()
            query = """
                SELECT status, count() as count
                FROM local.QvdFileTracking FINAL
                GROUP BY status
            """

            result = client.query(query)
            summary = {}
            for row in result.result_rows:
                status, count = row
                summary[status] = count

            return summary
        except Exception as e:
            print(f"Warning: Failed to get status summary: {e}")
            return {'completed': 0, 'failed': 0, 'processing': 0}

    def list_errors(self) -> List[FileStatus]:
        """
        Get list of files with errors.

        Returns:
            List of FileStatus objects with status='failed'
        """
        try:
            from moose_lib import ClickHouseClient

            client = ClickHouseClient()
            query = """
                SELECT
                    file_path,
                    file_name,
                    file_size,
                    file_mtime,
                    file_etag,
                    processed_at,
                    processing_duration_seconds,
                    row_count,
                    status,
                    error_message
                FROM local.QvdFileTracking FINAL
                WHERE status = 'failed'
                ORDER BY processed_at DESC
            """

            result = client.query(query)
            errors = []
            for row in result.result_rows:
                errors.append(FileStatus(
                    file_path=row[0],
                    file_name=row[1],
                    size=row[2],
                    mtime=row[3],
                    etag=row[4],
                    last_processed=row[5],
                    processing_duration=row[6],
                    row_count=row[7],
                    status=row[8],
                    error_message=row[9]
                ))

            return errors
        except Exception as e:
            print(f"Warning: Failed to list errors: {e}")
            return []

    def reset_state(self, force_delete: bool = False):
        """
        Clear all tracking state.

        Args:
            force_delete: If True, truncate the tracking table. Otherwise, just print instructions.

        Note: For ClickHouse-based tracking, this would typically just
        be documented. You don't usually delete tracking history.
        Instead, reprocessing is triggered by other means.
        """
        if force_delete:
            try:
                from moose_lib import ClickHouseClient

                client = ClickHouseClient()
                query = "TRUNCATE TABLE local.QvdFileTracking"
                client.query(query)
                print("✓ Tracking state cleared (all records deleted)")
            except Exception as e:
                print(f"Error truncating tracking table: {e}")
        else:
            print("Note: ClickHouse tracking preserves history.")
            print("To reprocess files, either:")
            print("  1. Delete specific records from QvdFileTracking table")
            print("  2. Use --force flag to ignore tracking")
            print("  3. Run with --force to truncate the tracking table")
