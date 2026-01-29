import tempfile
from typing import List, Dict, Optional
import fsspec
from pyqvd import QvdTable
import pandas as pd


class QvdReader:
    """
    Read QVD files from any source supported by fsspec.

    Supported protocols:
    - Local: /path/to/file.qvd
    - S3: s3://bucket/path/file.qvd
    - HTTP/HTTPS: https://example.com/file.qvd
    - FTP: ftp://server/path/file.qvd
    - SFTP: sftp://server/path/file.qvd
    - Azure: abfs://container/path/file.qvd
    - GCS: gs://bucket/path/file.qvd
    """

    def __init__(self, storage_options: Optional[Dict] = None):
        """
        Initialize QVD reader.

        Args:
            storage_options: Dict of options for fsspec (e.g., S3 credentials)
                Example: {"key": "aws_key", "secret": "aws_secret"}
        """
        self.storage_options = storage_options or {}

    def list_files(self, source: str, pattern: str = "*.qvd") -> List[str]:
        """
        List QVD files at the given source path.

        Args:
            source: Source path (local or URL)
            pattern: Glob pattern for filtering files

        Returns:
            List of file paths/URLs
        """
        fs, path = fsspec.core.url_to_fs(source, **self.storage_options)

        # Handle glob pattern
        if "*" in pattern:
            files = fs.glob(f"{path.rstrip('/')}/{pattern}")
        else:
            files = fs.ls(path)

        # Return full URLs
        protocol = fs.protocol if isinstance(fs.protocol, str) else fs.protocol[0]
        if protocol == "file":
            return [f for f in files if f.endswith(".qvd")]
        return [f"{protocol}://{f}" for f in files if f.endswith(".qvd")]

    def read_file(self, file_path: str) -> pd.DataFrame:
        """
        Read a QVD file from any supported source.

        For remote files, downloads to a temp file first since pyqvd
        requires a local file path.

        Args:
            file_path: Path or URL to QVD file

        Returns:
            DataFrame with QVD contents
        """
        fs, path = fsspec.core.url_to_fs(file_path, **self.storage_options)

        # Check if local file
        protocol = fs.protocol if isinstance(fs.protocol, str) else fs.protocol[0]
        if protocol == "file":
            # Direct local read
            tbl = QvdTable.from_qvd(path)
            return tbl.to_pandas()

        # Remote file - download to temp
        with tempfile.NamedTemporaryFile(suffix=".qvd", delete=True) as tmp:
            fs.get(path, tmp.name)
            tbl = QvdTable.from_qvd(tmp.name)
            return tbl.to_pandas()

    def get_file_info(self, file_path: str) -> Dict:
        """
        Get file metadata (size, mtime) for change detection.

        Args:
            file_path: Path or URL to file

        Returns:
            Dict with file metadata (size, mtime, etag)
        """
        fs, path = fsspec.core.url_to_fs(file_path, **self.storage_options)
        info = fs.info(path)
        return {
            "size": info.get("size", 0),
            "mtime": info.get("mtime") or info.get("LastModified"),
            "etag": info.get("ETag"),  # S3-specific
        }

    def read_metadata(self, file_path: str) -> QvdTable:
        """
        Read QVD metadata without loading full data.

        Args:
            file_path: Path or URL to QVD file

        Returns:
            QvdTable instance (use .fields for schema info)
        """
        fs, path = fsspec.core.url_to_fs(file_path, **self.storage_options)

        # Check if local file
        protocol = fs.protocol if isinstance(fs.protocol, str) else fs.protocol[0]
        if protocol == "file":
            return QvdTable.from_qvd(path)

        # Remote file - download to temp
        with tempfile.NamedTemporaryFile(suffix=".qvd", delete=True) as tmp:
            fs.get(path, tmp.name)
            return QvdTable.from_qvd(tmp.name)
