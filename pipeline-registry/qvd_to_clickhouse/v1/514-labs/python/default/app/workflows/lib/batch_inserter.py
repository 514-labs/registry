from typing import Dict, List, Any
import pandas as pd
from moose_lib import OlapTable, InsertOptions
from tenacity import retry, stop_after_attempt, wait_exponential
import importlib


class QvdBatchInserter:
    """Batch insert QVD data into ClickHouse via OlapTable."""

    def __init__(self, batch_size: int = 10000):
        """
        Initialize batch inserter.

        Args:
            batch_size: Number of rows to insert in each batch
        """
        self.batch_size = batch_size
        self._olap_table_cache: Dict[str, Any] = {}

    def insert_dataframe(self, table_name: str, df: pd.DataFrame):
        """
        Insert DataFrame into ClickHouse table.

        Args:
            table_name: Name of the OlapTable model (e.g., "QvdItem")
            df: DataFrame with data to insert
        """
        olap_table = self._get_olap_table(table_name)

        # Get the Pydantic model class
        model_class = self._get_model_class(olap_table)

        # Batch insert
        models = []
        for idx, row in df.iterrows():
            try:
                # Convert row to dict and create model instance
                row_dict = row.to_dict()
                models.append(model_class(**row_dict))

                # Insert batch when size reached
                if len(models) >= self.batch_size:
                    self._insert_with_retry(olap_table, models)
                    models = []

            except Exception as e:
                print(f"Warning: Failed to create model for row {idx}: {e}")
                continue

        # Insert remaining models
        if models:
            self._insert_with_retry(olap_table, models)

    def _get_olap_table(self, table_name: str) -> Any:
        """
        Get or create OlapTable instance.

        Args:
            table_name: Name of the OlapTable model

        Returns:
            OlapTable instance
        """
        if table_name in self._olap_table_cache:
            return self._olap_table_cache[table_name]

        # Import the model from app.ingest.qvd
        try:
            models_module = importlib.import_module("app.ingest.qvd")
            model_attr = f"{table_name}Model"

            if not hasattr(models_module, model_attr):
                raise AttributeError(
                    f"Model '{model_attr}' not found in app.ingest.qvd. "
                    f"Run init_qvd.py --generate-models first."
                )

            olap_table = getattr(models_module, model_attr)
            self._olap_table_cache[table_name] = olap_table
            return olap_table

        except ImportError as e:
            raise ImportError(
                f"Failed to import models from app.ingest.qvd: {e}. "
                f"Ensure models are generated and the module exists."
            )

    def _get_model_class(self, olap_table: Any) -> Any:
        """
        Extract Pydantic model class from OlapTable.

        Args:
            olap_table: OlapTable instance

        Returns:
            Pydantic BaseModel class
        """
        # OlapTable is a generic type OlapTable[ModelClass]
        # Access the model class from the type annotation
        if hasattr(olap_table, '__orig_class__'):
            return olap_table.__orig_class__.__args__[0]
        elif hasattr(olap_table.__class__, '__orig_bases__'):
            return olap_table.__class__.__orig_bases__[0].__args__[0]
        else:
            raise TypeError(f"Cannot extract model class from {olap_table}")

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=30)
    )
    def _insert_with_retry(self, olap_table: Any, models: List[Any]):
        """
        Insert batch of models with retry logic.

        Args:
            olap_table: OlapTable instance
            models: List of Pydantic model instances
        """
        try:
            olap_table.insert(
                models,
                options=InsertOptions(skip_duplicates=True)
            )
            print(f"Inserted batch of {len(models)} rows")
        except Exception as e:
            print(f"Error inserting batch: {e}")
            raise
