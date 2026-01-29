"""
QVD File Tracking Model

This model tracks the processing history of QVD files in ClickHouse.
It provides historical tracking and audit trail of all sync operations.
"""

from datetime import datetime
from moose_lib import OlapTable, OlapConfig, ReplacingMergeTreeEngine
from pydantic import BaseModel, Field
from typing import Optional


class QvdFileTracking(BaseModel):
    """Track QVD file processing history in ClickHouse."""

    # File identification
    file_path: str = Field(description="Full path or URL to QVD file")
    file_name: str = Field(description="Base filename without extension")
    table_name: str = Field(description="Target ClickHouse table name")

    # File metadata (for change detection)
    file_size: int = Field(description="File size in bytes")
    file_mtime: Optional[str] = Field(default=None, description="File modification time (ISO format)")
    file_etag: Optional[str] = Field(default=None, description="S3 ETag or content hash")

    # Processing metadata
    processed_at: str = Field(description="When file was processed (ISO format)")
    processing_duration_seconds: Optional[float] = Field(default=None, description="Processing time in seconds")
    row_count: int = Field(description="Number of rows processed")

    # Status tracking
    status: str = Field(description="Status: processing, completed, failed")
    error_message: Optional[str] = Field(default=None, description="Error message if status=failed")

    # Version for ReplacingMergeTree
    version: int = Field(default=1, description="Version number for updates")

    # Additional metadata
    batch_size: int = Field(default=10000, description="Batch size used for processing")
    source_type: str = Field(description="Source type: local, s3, http, ftp, etc.")


# Create OlapTable with ReplacingMergeTree to keep latest version
# This allows us to track history while easily querying current state
QvdFileTrackingModel = OlapTable[QvdFileTracking](
    "QvdFileTracking",
    OlapConfig(
        order_by_fields=["file_path", "processed_at"],
        engine=ReplacingMergeTreeEngine(ver="version")
    )
)
