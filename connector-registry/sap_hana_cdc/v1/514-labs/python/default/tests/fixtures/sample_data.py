"""Sample test data for SAP HANA CDC tests."""
from datetime import datetime
from typing import List, Dict, Any
import json

from sap_hana_cdc import ChangeEvent, BatchChange, TriggerType


def sample_change_event(
    event_id: str = "1",
    table_name: str = "TEST_TABLE",
    trigger_type: TriggerType = TriggerType.INSERT,
    old_values: Dict[str, Any] = None,
    new_values: Dict[str, Any] = None,
) -> ChangeEvent:
    """Create a sample ChangeEvent for testing."""
    return ChangeEvent(
        event_id=event_id,
        event_timestamp=datetime.now(),
        trigger_type=trigger_type,
        transaction_id="txn_123",
        schema_name="SAPHANADB",
        table_name=table_name,
        full_table_name=f"SAPHANADB.{table_name}",
        old_values=old_values,
        new_values=new_values,
    )


def sample_insert_event() -> ChangeEvent:
    """Create a sample INSERT event."""
    return sample_change_event(
        event_id="1",
        trigger_type=TriggerType.INSERT,
        new_values={"id": 1, "name": "Test Record", "value": 100},
    )


def sample_update_event() -> ChangeEvent:
    """Create a sample UPDATE event."""
    return sample_change_event(
        event_id="2",
        trigger_type=TriggerType.UPDATE,
        old_values={"id": 1, "name": "Test Record", "value": 100},
        new_values={"id": 1, "name": "Updated Record", "value": 200},
    )


def sample_delete_event() -> ChangeEvent:
    """Create a sample DELETE event."""
    return sample_change_event(
        event_id="3",
        trigger_type=TriggerType.DELETE,
        old_values={"id": 1, "name": "Updated Record", "value": 200},
    )


def sample_batch_change(num_events: int = 5) -> BatchChange:
    """Create a sample BatchChange with multiple events."""
    changes = []
    for i in range(num_events):
        event = sample_change_event(
            event_id=str(i + 1),
            trigger_type=TriggerType.INSERT,
            new_values={"id": i + 1, "name": f"Record {i + 1}", "value": (i + 1) * 10},
        )
        changes.append(event)
    return BatchChange(changes=changes)


def sample_table_rows(num_rows: int = 10) -> List[Dict[str, Any]]:
    """Create sample table rows for initial load testing."""
    return [
        {"id": i, "name": f"Row {i}", "value": i * 100, "created_at": datetime.now()}
        for i in range(1, num_rows + 1)
    ]


def sample_cdc_table_row(change_id: int = 1) -> tuple:
    """Create a sample CDC table row (as returned from database)."""
    return (
        change_id,  # CHANGE_ID
        "SAPHANADB",  # TABLE_SCHEMA
        "TEST_TABLE",  # TABLE_NAME
        "INSERT",  # TRIGGER_TYPE
        datetime.now(),  # CHANGE_TIMESTAMP
        "txn_123",  # TRANSACTION_ID
        None,  # OLD_VALUES
        json.dumps({"id": 1, "name": "Test", "value": 100}),  # NEW_VALUES
    )


def sample_client_status_row() -> tuple:
    """Create a sample client status row (as returned from database)."""
    return (
        "SAPHANADB",  # SCHEMA_NAME
        "TEST_TABLE",  # TABLE_NAME
        "ACTIVE",  # STATUS
    )
