"""
ClickHouse view generator for SAP HANA views.

This module generates ClickHouse view SQL from SAP HANA view definitions.
"""

import logging
from typing import List
from pathlib import Path

from .sap_hana_introspection import TableMetadata
from .sql_transformer import SQLTransformer

logger = logging.getLogger(__name__)


def generate_clickhouse_views(
    tables: List[TableMetadata],
    output_path: str,
    source_schema: str,
    target_schema: str = "default"
) -> List[str]:
    """
    Generate ClickHouse view SQL file from SAP HANA views.

    Args:
        tables: List of TableMetadata objects (including views)
        output_path: Path to write the generated SQL file
        source_schema: SAP HANA source schema
        target_schema: ClickHouse target schema/database

    Returns:
        List of view names that were generated
    """
    transformer = SQLTransformer(source_schema, target_schema)

    # Filter only views
    views = [t for t in tables if t.object_type == 'VIEW']

    if not views:
        logger.info("No views found to generate")
        return []

    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)

    # Generate SQL statements
    sql_statements = []
    generated_views = []

    sql_statements.append("-- ClickHouse View Definitions")
    sql_statements.append("-- Generated from SAP HANA views")
    sql_statements.append("-- This file contains CREATE VIEW statements for ClickHouse")
    sql_statements.append("")

    for view in views:
        logger.info(f"Generating ClickHouse view SQL for: {view.table_name}")

        if not view.view_definition:
            logger.warning(f"No view definition found for {view.table_name}, skipping")
            continue

        try:
            clickhouse_sql = transformer.transform_view_definition(
                view.view_definition,
                view.table_name
            )

            if clickhouse_sql:
                sql_statements.append(f"-- View: {view.table_name}")
                sql_statements.append(clickhouse_sql + ";")
                sql_statements.append("")
                generated_views.append(view.table_name)
                logger.info(f"Successfully generated ClickHouse SQL for view: {view.table_name}")
            else:
                logger.warning(f"Failed to transform view definition for {view.table_name}")

        except Exception as e:
            logger.error(f"Error generating view SQL for {view.table_name}: {e}")
            continue

    # Write to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))

    logger.info(f"Generated ClickHouse view SQL for {len(generated_views)} views at {output_path}")
    return generated_views
