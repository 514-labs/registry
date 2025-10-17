import re
import sys
import os
from moose_lib import Task, TaskConfig, Workflow, WorkflowConfig, OlapTable, InsertOptions, Key, TaskContext
from dotenv import load_dotenv

# Add the current directory to Python path to resolve app imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.ingest import cdc as cdc_module
from sap_hana_cdc import SAPHanaCDCConnector, SAPHanaCDCConfig
from app.workflows.lib.changes_inserter import BatchChangeInserter
from app.workflows.lib.data_converter import convert_row_data

load_dotenv()
sap_config = SAPHanaCDCConfig.from_env(prefix="SAP_HANA_")

def get_connector() -> SAPHanaCDCConnector:
    return SAPHanaCDCConnector.build_from_config(sap_config)

# It's important to synchronize the new tables first, otherwise the destination tables will be incomplete
def initial_load_task(ctx: TaskContext[None]) -> None:
    connector = get_connector()
    inserter = BatchChangeInserter()
    client_status = connector.get_client_status()
    for table_name, table_status in client_status.items():
        print(f"Initial loading table: {table_name}")
        chunk_size = 100000
        rows_iterator = connector.get_all_table_rows(table_name, page_size=chunk_size)
        while True:
            chunk = []
            try:
                for _ in range(chunk_size):
                    chunk.append(next(rows_iterator))
            except StopIteration:
                pass
            if not chunk:
                break
            result = inserter.insert_table_data(table_name, chunk)
            print(f"Insert result (chunk): {result}")
        print(f"Insert result: {result}")


def sync_changes_task(ctx: TaskContext[None]) -> None:
    connector = get_connector()
    batch = connector.get_changes()
    
    if batch:
        inserter = BatchChangeInserter()
        inserter.insert(batch.changes)
        connector.update_client_status(batch)
        return True

sync_changes_task_instance = Task[None, None](
    name="sync_changes",
    config=TaskConfig(run=sync_changes_task)
)

initial_load_task_instance = Task[None, None](
    name="initial_load",
    config=TaskConfig(
        run=initial_load_task,
        on_complete=[sync_changes_task_instance]
    )
)

cdc_workflow = Workflow(
    name="cdc",
    config=WorkflowConfig(
        starting_task=initial_load_task_instance,
        retries=0,
        timeout=None,
        schedule="@every 60s"  # Run every 60 seconds
    )
)

if __name__ == "__main__":
    initial_load_task(None)
    sync_changes_task(None)