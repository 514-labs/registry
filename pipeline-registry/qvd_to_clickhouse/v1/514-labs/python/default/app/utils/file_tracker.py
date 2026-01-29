import json
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import List, Dict, Optional
from pathlib import Path


@dataclass
class FileStatus:
    """Status information for a tracked file."""
    file_path: str
    size: int
    mtime: Optional[str]
    etag: Optional[str]      # S3 ETag for change detection
    last_processed: str      # ISO format datetime
    row_count: int
    status: str              # 'processed', 'pending', 'error'
    error_message: Optional[str] = None


class FileTracker:
    """Track processed files for incremental updates."""

    def __init__(self, state_file: str = ".qvd_state.json"):
        """
        Initialize file tracker.

        Args:
            state_file: Path to state file for tracking
        """
        self.state_file = Path(state_file)
        self.state: Dict[str, FileStatus] = {}
        self._load_state()

    def _load_state(self):
        """Load state from file."""
        if self.state_file.exists():
            try:
                with open(self.state_file, 'r') as f:
                    data = json.load(f)
                    self.state = {
                        path: FileStatus(**status)
                        for path, status in data.items()
                    }
            except Exception as e:
                print(f"Warning: Failed to load state file: {e}")
                self.state = {}

    def _save_state(self):
        """Save state to file."""
        try:
            with open(self.state_file, 'w') as f:
                data = {
                    path: asdict(status)
                    for path, status in self.state.items()
                }
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Warning: Failed to save state file: {e}")

    def get_new_or_modified_files(
        self,
        files: List[str],
        reader
    ) -> List[str]:
        """
        Get list of files that are new or have been modified.

        Change detection strategy:
        - Local files: Compare mtime + size
        - S3: Compare ETag (content hash)
        - HTTP: Compare Last-Modified header or Content-Length

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
                if file_path not in self.state:
                    # New file
                    files_to_process.append(file_path)
                    continue

                # Get previous status
                prev_status = self.state[file_path]

                # Skip if last attempt had an error (manual intervention needed)
                if prev_status.status == 'error':
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

        # If we can't determine, assume it hasn't changed
        return False

    def mark_processed(
        self,
        file_path: str,
        file_info: Dict,
        row_count: int
    ):
        """
        Mark file as successfully processed.

        Args:
            file_path: File path/URL
            file_info: File info from reader
            row_count: Number of rows processed
        """
        self.state[file_path] = FileStatus(
            file_path=file_path,
            size=file_info.get('size', 0),
            mtime=file_info.get('mtime'),
            etag=file_info.get('etag'),
            last_processed=datetime.utcnow().isoformat(),
            row_count=row_count,
            status='processed',
            error_message=None
        )
        self._save_state()

    def mark_error(
        self,
        file_path: str,
        error: str
    ):
        """
        Mark file as having an error.

        Args:
            file_path: File path/URL
            error: Error message
        """
        # Get existing state or create new one
        if file_path in self.state:
            status = self.state[file_path]
            status.status = 'error'
            status.error_message = error
            status.last_processed = datetime.utcnow().isoformat()
        else:
            self.state[file_path] = FileStatus(
                file_path=file_path,
                size=0,
                mtime=None,
                etag=None,
                last_processed=datetime.utcnow().isoformat(),
                row_count=0,
                status='error',
                error_message=error
            )
        self._save_state()

    def reset_state(self):
        """Clear all tracking state."""
        self.state = {}
        self._save_state()
        print(f"Reset state file: {self.state_file}")

    def get_status_summary(self) -> Dict[str, int]:
        """
        Get summary of file statuses.

        Returns:
            Dict with counts by status
        """
        summary = {'processed': 0, 'error': 0, 'pending': 0}
        for status in self.state.values():
            summary[status.status] = summary.get(status.status, 0) + 1
        return summary

    def list_errors(self) -> List[FileStatus]:
        """
        Get list of files with errors.

        Returns:
            List of FileStatus objects with status='error'
        """
        return [
            status for status in self.state.values()
            if status.status == 'error'
        ]
