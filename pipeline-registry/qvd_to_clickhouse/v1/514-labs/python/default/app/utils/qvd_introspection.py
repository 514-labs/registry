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

    # QVD type to Python type mapping
    TYPE_MAPPING = {
        'DATE': 'str',
        'TIME': 'str',
        'TIMESTAMP': 'str',
        'INTEGER': 'int',
        'REAL': 'float',
        'MONEY': 'float',
        'ASCII': 'str',
        'UNKNOWN': 'str',
    }

    def __init__(self, reader):
        """
        Initialize introspector.

        Args:
            reader: QvdReader instance for file operations
        """
        self.reader = reader

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
        table_name = f"Qvd{class_name}"

        # Process fields
        fields = []
        for field in qvd_table.fields:
            field_name = field.field_name
            python_name = self._sanitize_field_name(field_name)
            python_type = self._map_qvd_type(field)
            needs_alias = field_name != python_name

            fields.append(QvdFieldMetadata(
                name=field_name,
                python_name=python_name,
                python_type=python_type,
                needs_alias=needs_alias
            ))

        # Get file info
        file_info = self.reader.get_file_info(file_path)

        # Get row count
        row_count = qvd_table.number_of_records

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

    def _map_qvd_type(self, field) -> str:
        """
        Map QVD field type to Python type.

        Args:
            field: QVD field object

        Returns:
            Python type string (e.g., "str", "Optional[float]")
        """
        # Get base type from QVD field
        qvd_type = getattr(field, 'field_type', 'UNKNOWN').upper()
        base_type = self.TYPE_MAPPING.get(qvd_type, 'str')

        # Check if field can be null (in QVD, most fields are nullable)
        # We'll make numeric fields optional by default, and string fields required
        # unless we detect they have nulls in the data
        if base_type in ('int', 'float'):
            return f"Optional[{base_type}]"

        return base_type
