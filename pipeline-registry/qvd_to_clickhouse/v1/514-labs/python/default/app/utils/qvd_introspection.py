import re
from dataclasses import dataclass
from typing import List, Dict, Optional, TYPE_CHECKING
from pathlib import Path

if TYPE_CHECKING:
    from pyqvd import QvdTable


@dataclass
class QvdFieldMetadata:
    """Metadata for a single QVD field."""
    name: str           # Original column name (e.g., "%KEY_Item")
    python_name: str    # Sanitized name (e.g., "key_item")
    python_type: str    # "str", "int", "float", "Optional[str]"
    needs_alias: bool   # True if name has special chars


@dataclass
class QvdFileMetadata:
    """Metadata for a complete QVD file."""
    file_path: str      # Full path/URL
    file_name: str      # Just the filename
    table_name: str     # For ClickHouse (e.g., "QlikItem")
    class_name: str     # PascalCase for Pydantic (e.g., "QlikItem")
    fields: List[QvdFieldMetadata]
    row_count: int
    file_info: Dict     # From fsspec (size, mtime, etag)


class QvdIntrospector:
    """Extract schema metadata from QVD files."""

    def __init__(self, reader, table_prefix: str = "Qvd"):
        """
        Initialize introspector.

        Args:
            reader: QvdReader instance for file operations
            table_prefix: Prefix for table names (default: "Qvd", use "" for no prefix)
        """
        self.reader = reader
        self.table_prefix = table_prefix

    def introspect_file(self, file_path: str) -> QvdFileMetadata:
        """
        Extract metadata from a single QVD file.

        Args:
            file_path: Path or URL to QVD file

        Returns:
            QvdFileMetadata with schema information
        """
        # Read QVD metadata
        qvd_table = self.reader.read_metadata(file_path)

        # Extract file name and derive table/class names
        file_name = Path(file_path).stem  # Remove .qvd extension
        class_name = self._to_pascal_case(file_name)
        table_name = f"{self.table_prefix}{class_name}" if self.table_prefix else class_name

        # Get row count before sampling
        row_count = qvd_table.shape[0]

        # Convert only a sample to pandas for type inference (reduces memory usage)
        sample_size = min(1000, row_count) if row_count > 0 else 0
        if sample_size > 0:
            # Sample first N rows for type inference
            df_sample = qvd_table.to_pandas().head(sample_size)
        else:
            # Empty file - still need column info
            df_sample = qvd_table.to_pandas()

        # Process fields using sampled data
        fields = []
        for field_name in qvd_table.columns:
            python_name = self._sanitize_field_name(field_name)
            # Get pandas dtype from sample
            pandas_dtype = df_sample[field_name].dtype
            python_type = self._map_pandas_type(pandas_dtype)
            needs_alias = field_name != python_name

            fields.append(QvdFieldMetadata(
                name=field_name,
                python_name=python_name,
                python_type=python_type,
                needs_alias=needs_alias
            ))

        # Get file info
        file_info = self.reader.get_file_info(file_path)

        return QvdFileMetadata(
            file_path=file_path,
            file_name=file_name,
            table_name=table_name,
            class_name=class_name,
            fields=fields,
            row_count=row_count,
            file_info=file_info
        )

    def introspect_directory(
        self,
        source: str,
        pattern: str = "*.qvd",
        include_files: Optional[List[str]] = None,
        exclude_files: Optional[List[str]] = None
    ) -> List[QvdFileMetadata]:
        """
        Extract metadata from all QVD files in a directory.

        Args:
            source: Source path or URL
            pattern: Glob pattern for files
            include_files: Whitelist of file names (without .qvd)
            exclude_files: Blacklist of file names (without .qvd)

        Returns:
            List of QvdFileMetadata for each file
        """
        # List all QVD files
        all_files = self.reader.list_files(source, pattern)

        # Apply filters
        filtered_files = []
        for file_path in all_files:
            file_name = Path(file_path).stem

            # Check include list
            if include_files and file_name not in include_files:
                continue

            # Check exclude list
            if exclude_files and file_name in exclude_files:
                continue

            filtered_files.append(file_path)

        # Introspect each file
        metadata_list = []
        for file_path in filtered_files:
            try:
                metadata = self.introspect_file(file_path)
                metadata_list.append(metadata)
            except Exception as e:
                print(f"Warning: Failed to introspect {file_path}: {e}")

        return metadata_list

    @staticmethod
    def _sanitize_field_name(field_name: str) -> str:
        """
        Convert field name to valid Python identifier.

        Examples:
            "%KEY_Item" -> "key_item"
            "Item Description" -> "item_description"
            "Item (Y/N)" -> "item_y_n"
        """
        # Remove leading %
        name = field_name.lstrip('%')

        # Replace special characters with underscore
        name = re.sub(r'[^\w\s]', '_', name)

        # Replace spaces with underscore
        name = name.replace(' ', '_')

        # Remove consecutive underscores
        name = re.sub(r'_+', '_', name)

        # Remove trailing underscores
        name = name.strip('_')

        # Convert to lowercase
        name = name.lower()

        # Handle Python keywords
        if name in {'class', 'def', 'return', 'if', 'else', 'for', 'while', 'import', 'from'}:
            name = f"{name}_"

        return name

    @staticmethod
    def _to_pascal_case(name: str) -> str:
        """
        Convert name to PascalCase for class names.

        Examples:
            "item" -> "Item"
            "purchase_order" -> "PurchaseOrder"
        """
        # Split by underscores or spaces
        parts = re.split(r'[_\s]+', name)
        # Capitalize each part
        return ''.join(part.capitalize() for part in parts if part)

    def _map_pandas_type(self, pandas_dtype) -> str:
        """
        Map pandas dtype to Python type.

        Args:
            pandas_dtype: Pandas dtype object

        Returns:
            Python type string (e.g., "str", "Optional[float]")
        """
        dtype_str = str(pandas_dtype)

        # Map pandas dtypes to Python types
        if dtype_str.startswith('int'):
            return 'Optional[int]'
        elif dtype_str.startswith('float'):
            return 'Optional[float]'
        elif dtype_str == 'object' or dtype_str.startswith('str'):
            return 'str'
        elif dtype_str == 'bool':
            return 'Optional[bool]'
        elif dtype_str.startswith('datetime'):
            return 'str'
        else:
            # Default to string for unknown types
            return 'str'
