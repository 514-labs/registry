import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from ast import Dict
import time
from typing import Any, List
from moose_lib import Task, TaskConfig, Workflow, WorkflowConfig, OlapTable, InsertOptions, Key, TaskContext
from app.ingest import cdc as cdc_module
from dotenv import load_dotenv

from sap_hana_cdc import SAPHanaCDCConnector
from sap_hana_cdc import SAPHanaCDCConfig

load_dotenv()
sap_config = SAPHanaCDCConfig.from_env(prefix="SAP_HANA_")

def to_snake_case(name: str) -> str:
    """Convert string to snake_case."""
    import re
    # Insert underscore before uppercase letters that follow lowercase letters
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    # Insert underscore before uppercase letters that follow digits or other uppercase letters
    s2 = re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1)
    return s2.lower()

def get_connector() -> SAPHanaCDCConnector:
    return SAPHanaCDCConnector.build_from_config(sap_config)

# It's important to synchronize the new tables first, otherwise the destination tables will be incomplete
def sync_new_tables() -> None:
    connector = get_connector()
    for table in connector.infrastructure.get_newly_added_tables():
        print(f"Syncing new table: {table}")
        insert_table_data(table, connector.get_all_table_rows(table))
        connector.infrastructure.update_table_status_active(table)

def sync_new_tables_task(ctx: TaskContext[None]) -> None:
    sync_new_tables()

def sync_changes(connector: SAPHanaCDCConnector = get_connector()) -> None:
    batch = connector.get_changes(auto_update_client_status=False)
    if batch:
        for change in batch:
            model = getattr(cdc_module, to_snake_case(change.table_name))
            model.insert(change.new_values)
            connector.update_client_status(change)
        return True

                
            
def sync_changes_task(ctx: TaskContext[None]) -> None:
    connector = get_connector()
    while True:
        if not sync_changes(connector):
            # Loop quickly when no changes are found
            time.sleep(1)
        else:
            print("FOUND CHANGES")

# cdc_task_instance = Task[None, None](
#     name="cdc",
#     config=TaskConfig(run=cdc_task)
# )

# sync_new_tables_task_instance = Task[None, None](
#     name="sync_new_tables",
#     config=TaskConfig(
#         run=sync_new_tables_task,
#         on_complete=[cdc_task_instance]
#     )
# )

# ingest_workflow = Workflow(
#     name="cdc",
#     config=WorkflowConfig(
#         starting_task=sync_new_tables_task_instance,
#         retries=3,
#         timeout="30s",
#         # uncomment if you want to run it automatically on a schedule
#         # schedule="@every 5s",
#     )
# )

sync_new_tables()
sync_changes_task(None)