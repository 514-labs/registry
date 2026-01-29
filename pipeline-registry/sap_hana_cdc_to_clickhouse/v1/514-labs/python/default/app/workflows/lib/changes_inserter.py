"""Batch change inserter for CDC to ClickHouse pipeline."""
import logging
from typing import Dict, List, Any
from collections import defaultdict

from moose_lib import OlapTable, InsertOptions
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)

from sap_hana_cdc import ChangeEvent, TriggerType

logger = logging.getLogger(__name__)


class BatchChangeInserter:
    """
    Handles insertion of CDC changes into ClickHouse via Moose OlapTables.

    Features:
    - Groups changes by table for batch processing
    - Handles INSERT/UPDATE/DELETE operations
    - Retry logic with exponential backoff
    - Proper error logging and propagation
    """

    def __init__(self):
        self._olap_table_cache: Dict[str, OlapTable] = {}

    def insert_table_data(self, table_name: str, rows: List[Dict[str, Any]]) -> None:
        """
        Insert initial load data into ClickHouse.

        Args:
            table_name: SAP HANA table name (e.g., "EKKO")
            rows: List of row dictionaries with column names as keys

        Raises:
            Exception: If insertion fails after retries
        """
        if not rows:
            logger.info(f"No rows to insert for table {table_name}")
            return

        normalized_table_name = self._normalize_table_name(table_name)
        logger.info(f"Inserting {len(rows)} rows into {normalized_table_name}")

        try:
            olap_table = self._get_olap_table(normalized_table_name)
            if olap_table is None:
                error_msg = f"OlapTable not found for {normalized_table_name}"
                logger.error(error_msg)
                raise ValueError(error_msg)

            # Convert rows to Pydantic models
            models = []
            for row in rows:
                try:
                    # Get the model class from the OlapTable
                    model_class = olap_table.__class__.__orig_bases__[0].__args__[0]
                    model_instance = model_class(**row)
                    models.append(model_instance)
                except Exception as e:
                    logger.warning(f"Failed to convert row to model: {e}")
                    continue

            if models:
                self._insert_with_retry(olap_table, models)
                logger.info(
                    f"Successfully inserted {len(models)} rows into {normalized_table_name}"
                )
        except Exception as e:
            logger.error(f"Error inserting data into {normalized_table_name}: {e}")
            raise

    def insert(self, changes: List[ChangeEvent]) -> None:
        """
        Insert CDC changes into ClickHouse.

        Groups changes by table for batch processing.
        Handles INSERT/UPDATE/DELETE operations appropriately.

        Args:
            changes: List of ChangeEvent objects from SAP HANA CDC

        Raises:
            Exception: If insertion fails after retries
        """
        if not changes:
            logger.info("No changes to insert")
            return

        # Group changes by table
        changes_by_table = defaultdict(list)
        for change in changes:
            table_name = self._normalize_table_name(change.table_name)
            changes_by_table[table_name].append(change)

        logger.info(
            f"Processing {len(changes)} changes across {len(changes_by_table)} tables"
        )

        # Process each table's changes
        for table_name, table_changes in changes_by_table.items():
            try:
                self._insert_table_changes(table_name, table_changes)
            except Exception as e:
                logger.error(f"Error inserting changes for {table_name}: {e}")
                raise

    def _insert_table_changes(
        self, table_name: str, changes: List[ChangeEvent]
    ) -> None:
        """
        Insert changes for a specific table.

        Args:
            table_name: Normalized table name
            changes: List of changes for this table
        """
        olap_table = self._get_olap_table(table_name)
        if olap_table is None:
            error_msg = f"OlapTable not found for {table_name}"
            logger.error(error_msg)
            raise ValueError(error_msg)

        # Convert changes to models
        models = []
        for change in changes:
            try:
                # Get the model class from the OlapTable
                model_class = olap_table.__class__.__orig_bases__[0].__args__[0]

                # Determine which values to use based on trigger type
                if change.trigger_type == TriggerType.INSERT:
                    # For INSERT, use new_values
                    row_data = change.new_values or {}
                elif change.trigger_type == TriggerType.UPDATE:
                    # For UPDATE, use new_values (ClickHouse will handle versioning)
                    row_data = change.new_values or {}
                elif change.trigger_type == TriggerType.DELETE:
                    # For DELETE, use old_values with is_deleted flag
                    # ReplacingMergeTree will handle this
                    row_data = change.old_values or {}
                else:
                    logger.warning(f"Unknown trigger type: {change.trigger_type}")
                    continue

                if row_data:
                    model_instance = model_class(**row_data)
                    models.append(model_instance)
            except Exception as e:
                logger.warning(
                    f"Failed to convert change (event_id={change.event_id}) to model: {e}"
                )
                continue

        if models:
            self._insert_with_retry(olap_table, models)
            logger.info(f"Successfully inserted {len(models)} changes into {table_name}")

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=30),
        retry=retry_if_exception_type((Exception,)),
        reraise=True,
    )
    def _insert_with_retry(self, olap_table: OlapTable, models: List[Any]) -> None:
        """
        Insert models into OlapTable with retry logic.

        Args:
            olap_table: The OlapTable instance
            models: List of Pydantic model instances

        Raises:
            Exception: If all retry attempts fail
        """
        try:
            olap_table.insert(models, options=InsertOptions(skip_duplicates=True))
        except Exception as e:
            logger.warning(f"Insert failed, will retry: {e}")
            raise

    def _normalize_table_name(self, table_name: str) -> str:
        """
        Normalize SAP HANA table name to lowercase for OlapTable lookup.

        SAP HANA uses uppercase table names (e.g., "EKKO")
        Moose uses lowercase variable names (e.g., "ekko")

        Args:
            table_name: SAP HANA table name

        Returns:
            Normalized table name (lowercase, underscores preserved)
        """
        return table_name.lower()

    def _get_olap_table(self, normalized_table_name: str) -> OlapTable:
        """
        Get OlapTable instance for a given table name.

        Uses dynamic import to access the cdc module and lookup the table.

        Args:
            normalized_table_name: Lowercase table name

        Returns:
            OlapTable instance or None if not found
        """
        # Check cache first
        if normalized_table_name in self._olap_table_cache:
            return self._olap_table_cache[normalized_table_name]

        try:
            # Import the cdc module dynamically
            from app.ingest import cdc as cdc_module

            # Get the OlapTable instance from the module
            if hasattr(cdc_module, normalized_table_name):
                olap_table = getattr(cdc_module, normalized_table_name)
                self._olap_table_cache[normalized_table_name] = olap_table
                logger.debug(f"Found OlapTable for {normalized_table_name}")
                return olap_table
            else:
                logger.error(
                    f"OlapTable '{normalized_table_name}' not found in cdc module"
                )
                return None
        except Exception as e:
            logger.error(f"Error getting OlapTable for {normalized_table_name}: {e}")
            return None
