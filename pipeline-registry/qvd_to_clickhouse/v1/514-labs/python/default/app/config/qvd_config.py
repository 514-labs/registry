import os
from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class QvdConfig:
    """Configuration for QVD to ClickHouse pipeline."""

    qvd_source: str                      # Supports: /local/path, s3://bucket/path, https://..., ftp://...
    qvd_file_pattern: str = "*.qvd"      # Glob pattern
    include_files: Optional[List[str]] = None  # Whitelist (without .qvd extension)
    exclude_files: Optional[List[str]] = None  # Blacklist (without .qvd extension)
    batch_size: int = 10000              # Rows per insert
    schedule: str = "@daily"             # Workflow schedule
    table_prefix: str = "Qvd"            # Table name prefix (e.g., "Qvd" for QvdItem, "" for Item)

    # S3 credentials (optional, can also use AWS profile or IAM role)
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    aws_region: Optional[str] = None

    @staticmethod
    def from_env(prefix: str = "QVD_") -> "QvdConfig":
        """
        Load configuration from environment variables.

        Args:
            prefix: Environment variable prefix (default: "QVD_")

        Returns:
            QvdConfig instance

        Raises:
            ValueError: If required QVD_SOURCE is not set
        """
        qvd_source = os.getenv(f"{prefix}SOURCE")
        if not qvd_source:
            raise ValueError(f"{prefix}SOURCE environment variable is required")

        # Parse include/exclude lists
        include_files = None
        if include_str := os.getenv(f"{prefix}INCLUDE_FILES"):
            include_files = [f.strip() for f in include_str.split(",")]

        exclude_files = None
        if exclude_str := os.getenv(f"{prefix}EXCLUDE_FILES"):
            exclude_files = [f.strip() for f in exclude_str.split(",")]

        return QvdConfig(
            qvd_source=qvd_source,
            qvd_file_pattern=os.getenv(f"{prefix}FILE_PATTERN", "*.qvd"),
            include_files=include_files,
            exclude_files=exclude_files,
            batch_size=int(os.getenv(f"{prefix}BATCH_SIZE", "10000")),
            schedule=os.getenv(f"{prefix}SCHEDULE", "@daily"),
            table_prefix=os.getenv(f"{prefix}TABLE_PREFIX", "Qvd"),
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            aws_region=os.getenv("AWS_DEFAULT_REGION"),
        )
