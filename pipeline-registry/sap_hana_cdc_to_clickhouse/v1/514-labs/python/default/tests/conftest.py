"""Pytest configuration and fixtures for pipeline tests."""
import pytest
import sys
from pathlib import Path
from unittest.mock import Mock, MagicMock
from typing import List, Dict, Any
from datetime import datetime

# Add bundled sap-hana-cdc connector to Python path
_connector_path = Path(__file__).parent.parent / "app" / "sap-hana-cdc" / "src"
if str(_connector_path) not in sys.path:
    sys.path.insert(0, str(_connector_path))

from sap_hana_cdc import ChangeEvent, BatchChange, TriggerType


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
