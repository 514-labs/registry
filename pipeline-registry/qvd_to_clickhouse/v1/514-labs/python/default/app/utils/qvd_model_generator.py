from typing import List, Set
from pathlib import Path
from .qvd_introspection import QvdFileMetadata, QvdFieldMetadata


class QvdModelGenerator:
    """Generate Pydantic models from QVD metadata."""

    def generate_models(
        self,
        metadata_list: List[QvdFileMetadata],
        output_path: str,
        overwrite: bool = False
    ):
        """
        Generate Pydantic models from QVD metadata.

        Args:
            metadata_list: List of QVD file metadata
            output_path: Path to write generated models
            overwrite: If True, overwrite existing file
        """
        output_file = Path(output_path)

        if output_file.exists() and not overwrite:
            raise FileExistsError(
                f"{output_file} already exists. Use overwrite=True to replace."
            )

        # Generate code
        code_lines = self._generate_header()

        for metadata in metadata_list:
            code_lines.extend(self._generate_model(metadata))
            code_lines.append("")  # Empty line between models

        # Write to file
        output_file.parent.mkdir(parents=True, exist_ok=True)
        output_file.write_text("\n".join(code_lines))

        print(f"Generated {len(metadata_list)} models in {output_file}")

    def _generate_header(self) -> List[str]:
        """Generate import statements."""
        return [
            "# Auto-generated QVD models",
            "",
            "from moose_lib import OlapTable, OlapConfig, ReplacingMergeTreeEngine",
            "from pydantic import BaseModel, Field, field_validator",
            "from typing import Optional",
            "",
        ]

    def _generate_model(self, metadata: QvdFileMetadata) -> List[str]:
        """
        Generate Pydantic model code for a single QVD file.

        Args:
            metadata: QVD file metadata

        Returns:
            List of code lines
        """
        lines = []

        # Add comment with source file
        lines.append(f"# Auto-generated from {metadata.file_name}")
        lines.append("")

        # Class definition
        lines.append(f"class {metadata.class_name}(BaseModel):")

        # Fields
        for field in metadata.fields:
            field_def = self._generate_field(field)
            lines.append(f"    {field_def}")

        # Add validators for optional numeric fields
        optional_fields = self._get_optional_numeric_fields(metadata.fields)
        if optional_fields:
            lines.append("")
            lines.extend(self._generate_validators(optional_fields))

        # Empty line before table definition
        lines.append("")
        lines.append("")

        # OlapTable definition
        # Use first field as order_by (or first field with alias if available)
        order_by_field = metadata.fields[0].name if metadata.fields else "id"
        lines.append(
            f"{metadata.table_name}Model = OlapTable[{metadata.class_name}]("
            f'"{metadata.table_name}", OlapConfig('
        )
        lines.append(f'    order_by_fields=["{order_by_field}"],')
        lines.append("    engine=ReplacingMergeTreeEngine()")
        lines.append("))")

        return lines

    def _generate_field(self, field: QvdFieldMetadata) -> str:
        """
        Generate field definition line.

        Args:
            field: Field metadata

        Returns:
            Field definition string
        """
        # Determine if field is optional
        is_optional = field.python_type.startswith("Optional[")

        # Build field definition
        if field.needs_alias:
            if is_optional:
                return (
                    f'{field.python_name}: {field.python_type} = '
                    f'Field(alias="{field.name}", default=None)'
                )
            else:
                return (
                    f'{field.python_name}: {field.python_type} = '
                    f'Field(alias="{field.name}")'
                )
        else:
            if is_optional:
                return f"{field.python_name}: {field.python_type} = None"
            else:
                return f"{field.python_name}: {field.python_type}"

    def _get_optional_numeric_fields(
        self, fields: List[QvdFieldMetadata]
    ) -> List[str]:
        """
        Get list of optional numeric field names for validators.

        Args:
            fields: List of field metadata

        Returns:
            List of field names that need validators
        """
        optional_numeric = []
        for field in fields:
            if (
                field.python_type in ("Optional[int]", "Optional[float]")
                and not field.python_name.endswith("_")
            ):
                optional_numeric.append(field.python_name)
        return optional_numeric

    def _generate_validators(self, field_names: List[str]) -> List[str]:
        """
        Generate field validators for optional numeric fields.

        Args:
            field_names: List of field names

        Returns:
            List of code lines
        """
        lines = []

        # Group fields for readability (max 5 per line)
        field_groups = [field_names[i:i+5] for i in range(0, len(field_names), 5)]

        lines.append("    @field_validator(")
        for i, group in enumerate(field_groups):
            fields_str = ", ".join(f"'{name}'" for name in group)
            if i < len(field_groups) - 1:
                lines.append(f"        {fields_str},")
            else:
                lines.append(f"        {fields_str},")
        lines.append("        mode='before'")
        lines.append("    )")
        lines.append("    @classmethod")
        lines.append("    def convert_empty_string_to_none(cls, v):")
        lines.append('        """Convert empty strings and whitespace to None for optional numeric fields."""')
        lines.append("        if v is None:")
        lines.append("            return None")
        lines.append("        if isinstance(v, str):")
        lines.append("            if v.strip() == '':")
        lines.append("                return None")
        lines.append("        return v")

        return lines
