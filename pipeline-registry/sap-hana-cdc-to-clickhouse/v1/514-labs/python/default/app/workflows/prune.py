"""
SAP HANA CDC Database Pruning Workflow.

This workflow prunes old entries from the CDC change table to prevent it from growing indefinitely.
It runs once a day to maintain optimal database performance.
"""

import logging
import os
from moose_lib import Task, TaskConfig, Workflow, WorkflowConfig, TaskContext
from dotenv import load_dotenv

from sap_hana_cdc import SAPHanaCDCConnector, SAPHanaCDCConfig, PruneResult

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

load_dotenv()
sap_config = SAPHanaCDCConfig.from_env(prefix="SAP_HANA_")

def get_connector() -> SAPHanaCDCConnector:
    """Get SAP HANA CDC connector instance."""
    return SAPHanaCDCConnector.build_from_config(sap_config)

def prune_database(older_than_days: int = 7) -> PruneResult:
    """
    Prune old entries from the CDC change table.
    
    Args:
        older_than_days: Number of days to keep (entries older than this will be deleted)
        
    Returns:
        PruneResult containing the pruning operation results
    """
    connector = get_connector()
    
    try:
        logger.info(f"Starting database pruning (keeping {older_than_days} days of data)")
        
        # Perform the pruning operation
        result = connector.prune(older_than_days=older_than_days)
        
        logger.info(f"Pruning completed successfully:")
        logger.info(f"  - Entries deleted: {result.entries_deleted}")
        logger.info(f"  - Cutoff timestamp: {result.cutoff_timestamp}")
        
        return result
        
    except Exception as e:
        logger.error(f"Error during database pruning: {e}")
        raise

def prune_database_task(ctx: TaskContext[None]) -> None:
    """Task wrapper for database pruning."""
    # Get retention days from environment or use default
    retention_days = int(os.getenv("SAP_HANA_CDC_RETENTION_DAYS", "7"))
    
    prune_database(older_than_days=retention_days)

# Create the pruning task
prune_task_instance = Task[None, None](
    name="prune_database",
    config=TaskConfig(
        run=prune_database_task,
        retries=2,
        timeout="5m"
    )
)

# Create the pruning workflow that runs once a day
prune_workflow = Workflow(
    name="prune_database",
    config=WorkflowConfig(
        starting_task=prune_task_instance,
        retries=1,
        timeout="10m",
        schedule="@daily"  # Run once a day at midnight
    )
)

if __name__ == "__main__":
    prune_database_task(None)