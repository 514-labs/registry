"""Pytest configuration and fixtures for pipeline tests."""
import pytest
from unittest.mock import Mock, MagicMock
from typing import List, Dict, Any

from sap_hana_cdc import ChangeEvent, BatchChange, TriggerType
from datetime import datetime


@pytest.fixture
def mock_olap_table():
    """Create a mock OlapTable for testing."""
    table = MagicMock()
    table.insert = Mock()
    return table


@pytest.fixture
def sample_pipeline_change_events() -> List[ChangeEvent]:
    """Create sample change events for pipeline testing."""
    return [
        ChangeEvent(
            event_id="1",
            event_timestamp=datetime.now(),
            trigger_type=TriggerType.INSERT,
            transaction_id="txn_1",
            schema_name="SAPHANADB",
            table_name="EKKO",
            full_table_name="SAPHANADB.EKKO",
            old_values=None,
            new_values={"EBELN": "1000000001", "BUKRS": "1000", "LIFNR": "VENDOR1"},
        ),
        ChangeEvent(
            event_id="2",
            event_timestamp=datetime.now(),
            trigger_type=TriggerType.UPDATE,
            transaction_id="txn_2",
            schema_name="SAPHANADB",
            table_name="EKKO",
            full_table_name="SAPHANADB.EKKO",
            old_values={"EBELN": "1000000001", "BUKRS": "1000", "LIFNR": "VENDOR1"},
            new_values={"EBELN": "1000000001", "BUKRS": "1000", "LIFNR": "VENDOR2"},
        ),
    ]


@pytest.fixture
def sample_table_rows() -> List[Dict[str, Any]]:
    """Create sample table rows for initial load testing."""
    return [
        {"EBELN": f"100000000{i}", "BUKRS": "1000", "LIFNR": f"VENDOR{i}"}
        for i in range(1, 11)
    ]
