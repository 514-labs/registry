"""
SQL Transformation utilities for converting SAP HANA SQL to ClickHouse SQL.

This module provides functionality to transform SAP HANA view definitions
into ClickHouse-compatible view definitions.
"""

import re
import logging
from typing import Optional, Dict

logger = logging.getLogger(__name__)


class SQLTransformer:
    """Transforms SAP HANA SQL to ClickHouse SQL."""

    def __init__(self, source_schema: str, target_schema: str = "default"):
        """
        Initialize the SQL transformer.

        Args:
            source_schema: The SAP HANA source schema name
            target_schema: The target ClickHouse schema/database name
        """
        self.source_schema = source_schema
        self.target_schema = target_schema

    def transform_view_definition(self, view_definition: str, view_name: str) -> Optional[str]:
        """
        Transform a SAP HANA view definition to ClickHouse view definition.

        Args:
            view_definition: The SAP HANA view SQL definition
            view_name: The name of the view

        Returns:
            Transformed ClickHouse view definition or None if transformation fails
        """
        if not view_definition:
            logger.warning(f"Empty view definition for {view_name}")
            return None

        try:
            # Extract the SELECT statement from CREATE VIEW
            select_statement = self._extract_select_statement(view_definition)
            if not select_statement:
                logger.warning(f"Could not extract SELECT statement from view definition for {view_name}")
                return None

            # Transform the SQL
            transformed_sql = select_statement

            # Replace schema references
            transformed_sql = self._replace_schema_references(transformed_sql)

            # Transform SAP HANA specific syntax to ClickHouse
            transformed_sql = self._transform_syntax(transformed_sql)

            # Build ClickHouse CREATE VIEW statement
            clickhouse_view = f"CREATE VIEW IF NOT EXISTS {self.target_schema}.{view_name} AS\n{transformed_sql}"

            logger.info(f"Successfully transformed view definition for {view_name}")
            return clickhouse_view

        except Exception as e:
            logger.error(f"Failed to transform view definition for {view_name}: {e}")
            return None

    def _extract_select_statement(self, view_definition: str) -> Optional[str]:
        """
        Extract the SELECT statement from a CREATE VIEW definition.

        Args:
            view_definition: Full CREATE VIEW statement

        Returns:
            The SELECT portion or None if not found
        """
        # Remove CREATE VIEW ... AS prefix
        # Pattern: CREATE VIEW ... AS <select_statement>
        match = re.search(r'CREATE\s+VIEW.*?AS\s+(SELECT.*)', view_definition, re.IGNORECASE | re.DOTALL)
        if match:
            return match.group(1).strip()

        # If already just a SELECT statement
        if view_definition.strip().upper().startswith('SELECT'):
            return view_definition.strip()

        return None

    def _replace_schema_references(self, sql: str) -> str:
        """
        Replace schema references in the SQL.

        Args:
            sql: SQL statement

        Returns:
            SQL with replaced schema references
        """
        # Replace "SCHEMA"."TABLE" with target_schema.TABLE
        # Also handle unquoted schema.table references

        # Pattern 1: "SCHEMA"."TABLE"
        pattern1 = rf'"{self.source_schema}"\.?"([^"]+)"?'
        sql = re.sub(pattern1, rf'{self.target_schema}.\1', sql, flags=re.IGNORECASE)

        # Pattern 2: SCHEMA.TABLE (unquoted)
        pattern2 = rf'\b{self.source_schema}\.(\w+)\b'
        sql = re.sub(pattern2, rf'{self.target_schema}.\1', sql, flags=re.IGNORECASE)

        return sql

    def _transform_syntax(self, sql: str) -> str:
        """
        Transform SAP HANA specific syntax to ClickHouse syntax.

        Args:
            sql: SQL statement

        Returns:
            Transformed SQL
        """
        # Common transformations:

        # 1. CONCAT function - SAP HANA uses || or CONCAT, ClickHouse uses concat()
        # Keep as is since both support CONCAT

        # 2. String concatenation operator || - ClickHouse also supports this

        # 3. IFNULL -> ifNull (ClickHouse prefers ifNull but accepts IFNULL)
        sql = re.sub(r'\bIFNULL\s*\(', 'ifNull(', sql, flags=re.IGNORECASE)

        # 4. CURRENT_TIMESTAMP -> now()
        sql = re.sub(r'\bCURRENT_TIMESTAMP\b', 'now()', sql, flags=re.IGNORECASE)

        # 5. Remove DUMMY table references (SAP HANA specific)
        sql = re.sub(r'\s+FROM\s+DUMMY\b', '', sql, flags=re.IGNORECASE)

        # 6. DAYS_BETWEEN -> dateDiff('day', ...)
        # This is more complex and may need more sophisticated parsing

        # 7. TO_DATE -> toDate or parseDateTime
        sql = re.sub(r'\bTO_DATE\s*\((.*?),\s*[\'"]([^\'\"]+)[\'"]\)', r"parseDateTimeBestEffort('\1')", sql, flags=re.IGNORECASE)

        # 8. NVL -> ifNull
        sql = re.sub(r'\bNVL\s*\(', 'ifNull(', sql, flags=re.IGNORECASE)

        return sql

    def get_view_sql_for_clickhouse(self, table_metadata) -> Optional[str]:
        """
        Generate ClickHouse view SQL from TableMetadata.

        Args:
            table_metadata: TableMetadata object with view_definition

        Returns:
            ClickHouse view SQL or None
        """
        if table_metadata.object_type != 'VIEW':
            return None

        if not table_metadata.view_definition:
            logger.warning(f"No view definition found for {table_metadata.table_name}")
            return None

        return self.transform_view_definition(
            table_metadata.view_definition,
            table_metadata.table_name
        )
