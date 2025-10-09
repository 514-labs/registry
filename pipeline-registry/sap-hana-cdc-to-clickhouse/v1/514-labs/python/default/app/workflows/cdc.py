import re

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
    # Insert underscore before uppercase letters that follow lowercase letters
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    # Insert underscore before uppercase letters that follow digits or other uppercase letters
    s2 = re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1)
    return s2.lower()

def get_connector() -> SAPHanaCDCConnector:
    return SAPHanaCDCConnector.build_from_config(sap_config)

def insert_table_data(table_name: str, rows: List[Any]) -> None:
    try:
        model = getattr(cdc_module, to_snake_case(table_name))
        model.insert(rows)
    except AttributeError:
        print(f"Error: Model for table '{table_name}' not found in cdc_module.")
        return

# It's important to synchronize the new tables first, otherwise the destination tables will be incomplete
def sync_new_tables() -> None:
    connector = get_connector()
    for table in connector.infrastructure.get_newly_added_tables():
        print(f"Syncing new table: {table}")
        insert_table_data(table, connector.get_all_table_rows(table))
        connector.infrastructure.update_table_status_active(table)

def sync_new_tables_task(ctx: TaskContext[None]) -> None:
    sync_new_tables()

def sync_changes(connector: SAPHanaCDCConnector = get_connector()) -> bool:
    batch = connector.get_changes(auto_update_client_status=False)
    if batch:
        for change in batch:
            insert_table_data(change.table_name, list(change.new_values))
            connector.update_client_status(change)
        return True
    return False
            
def sync_changes_task(ctx: TaskContext[None]) -> None:
    connector = get_connector()
    while True:
        if not sync_changes(connector):
            # Loop quickly when no changes are found
            time.sleep(1)

sync_changes_task_instance = Task[None, None](
    name="sync_changes",
    config=TaskConfig(run=sync_changes_task)
)

sync_new_tables_task_instance = Task[None, None](
    name="sync_new_tables",
    config=TaskConfig(
        run=sync_new_tables_task,
        on_complete=[sync_changes_task_instance]
    )
)

cdc_workflow = Workflow(
    name="cdc",
    config=WorkflowConfig(
        starting_task=sync_new_tables_task_instance,
        retries=3,
        timeout=None,
    )
)