"""Pytest fixtures and configuration for SAP HANA CDC tests."""

import pytest
from unittest.mock import Mock, MagicMock
from datetime import datetime

from sap_hana_cdc.config import SAPHanaCDCConfig
from sap_hana_cdc.models import (
    ChangeEvent,
    BatchChange,
    TriggerType,
    TableStatus,
    ClientTableStatus,
)


@pytest.fixture
def mock_connection() -> Mock:
    """Create a mock database connection."""
    connection = Mock()
    cursor = MagicMock()
    cursor.__enter__ = Mock(return_value=cursor)
    cursor.__exit__ = Mock(return_value=False)
    cursor.fetchall = Mock(return_value=[])
    cursor.fetchone = Mock(return_value=None)
    cursor.execute = Mock()
    cursor.rowcount = 0
    connection.cursor = Mock(return_value=cursor)
    connection.commit = Mock()
    return connection


@pytest.fixture
def sample_config() -> SAPHanaCDCConfig:
    """Create a sample configuration for testing."""
    return SAPHanaCDCConfig(
        host="test-host",
        port=30015,
        user="testuser",
        password="testpass",
        client_id="test_client",
        tables=["TABLE1", "TABLE2"],
        source_schema="TEST_SCHEMA",
        cdc_schema="CDC_SCHEMA",
    )


@pytest.fixture
def sample_change_event() -> ChangeEvent:
    """Create a sample change event for testing."""
    return ChangeEvent(
        event_id="123",
        event_timestamp=datetime(2024, 1, 1, 12, 0, 0),
        trigger_type=TriggerType.INSERT,
        transaction_id="txn_123",
        schema_name="TEST_SCHEMA",
        table_name="TABLE1",
        full_table_name="TEST_SCHEMA.TABLE1",
        old_values=None,
        new_values=[{"id": 1, "name": "test"}],
    )


@pytest.fixture
def sample_batch_change(sample_change_event: ChangeEvent) -> BatchChange:
    """Create a sample batch change for testing."""
    return BatchChange(changes=[sample_change_event])


@pytest.fixture
def sample_client_status() -> ClientTableStatus:
    """Create a sample client table status for testing."""
    return ClientTableStatus(
        schema_name="TEST_SCHEMA",
        table_name="TABLE1",
        status=TableStatus.ACTIVE,
    )
