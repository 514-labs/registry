"""Tests for SAP HANA CDC data models."""

import pytest
from datetime import datetime

from sap_hana_cdc.models import (
    ChangeEvent,
    BatchChange,
    TriggerType,
    TableStatus,
    ClientTableStatus,
    PruneResult,
)


class TestTriggerType:
    """Test suite for TriggerType enum."""

    def test_trigger_types(self) -> None:
        """Test trigger type values."""
        assert TriggerType.INSERT.value == "insert"
        assert TriggerType.UPDATE.value == "update"
        assert TriggerType.DELETE.value == "delete"


class TestTableStatus:
    """Test suite for TableStatus enum."""

    def test_table_status_values(self) -> None:
        """Test table status values."""
        assert TableStatus.NEW.value == "new"
        assert TableStatus.ACTIVE.value == "active"


class TestClientTableStatus:
    """Test suite for ClientTableStatus."""

    def test_client_table_status_creation(self) -> None:
        """Test creation of ClientTableStatus."""
        status = ClientTableStatus(
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            status=TableStatus.ACTIVE,
        )

        assert status.schema_name == "TEST_SCHEMA"
        assert status.table_name == "TABLE1"
        assert status.status == TableStatus.ACTIVE


class TestChangeEvent:
    """Test suite for ChangeEvent."""

    def test_insert_event_creation(self) -> None:
        """Test creation of an INSERT change event."""
        event = ChangeEvent(
            event_id="1",
            event_timestamp=datetime(2024, 1, 1, 12, 0, 0),
            trigger_type=TriggerType.INSERT,
            transaction_id="txn_1",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            old_values=None,
            new_values=[{"id": 1, "name": "test"}],
        )

        assert event.event_id == "1"
        assert event.trigger_type == TriggerType.INSERT
        assert event.old_values is None
        assert event.new_values == [{"id": 1, "name": "test"}]

    def test_update_event_creation(self) -> None:
        """Test creation of an UPDATE change event."""
        event = ChangeEvent(
            event_id="2",
            event_timestamp=datetime(2024, 1, 1, 12, 0, 0),
            trigger_type=TriggerType.UPDATE,
            transaction_id="txn_2",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            old_values=[{"id": 1, "name": "old"}],
            new_values=[{"id": 1, "name": "new"}],
        )

        assert event.event_id == "2"
        assert event.trigger_type == TriggerType.UPDATE
        assert event.old_values == [{"id": 1, "name": "old"}]
        assert event.new_values == [{"id": 1, "name": "new"}]

    def test_delete_event_creation(self) -> None:
        """Test creation of a DELETE change event."""
        event = ChangeEvent(
            event_id="3",
            event_timestamp=datetime(2024, 1, 1, 12, 0, 0),
            trigger_type=TriggerType.DELETE,
            transaction_id="txn_3",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            old_values=[{"id": 1, "name": "deleted"}],
            new_values=None,
        )

        assert event.event_id == "3"
        assert event.trigger_type == TriggerType.DELETE
        assert event.old_values == [{"id": 1, "name": "deleted"}]
        assert event.new_values is None

    def test_to_dict(self) -> None:
        """Test conversion of ChangeEvent to dictionary."""
        timestamp = datetime(2024, 1, 1, 12, 0, 0)
        event = ChangeEvent(
            event_id="1",
            event_timestamp=timestamp,
            trigger_type=TriggerType.INSERT,
            transaction_id="txn_1",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            old_values=None,
            new_values=[{"id": 1, "name": "test"}],
        )

        result = event.to_dict()

        assert result["event_id"] == "1"
        assert result["event_timestamp"] == timestamp.isoformat()
        assert result["trigger_type"] == "insert"
        assert result["transaction_id"] == "txn_1"
        assert result["schema_name"] == "TEST_SCHEMA"
        assert result["table_name"] == "TABLE1"
        assert result["full_table_name"] == "TEST_SCHEMA.TABLE1"
        assert result["old_values"] is None
        assert result["new_values"] == [{"id": 1, "name": "test"}]

    def test_diff_values_insert(self) -> None:
        """Test diff_values for INSERT event."""
        event = ChangeEvent(
            event_id="1",
            event_timestamp=datetime(2024, 1, 1, 12, 0, 0),
            trigger_type=TriggerType.INSERT,
            transaction_id="txn_1",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            old_values=None,
            new_values=[{"id": 1, "name": "test"}],
        )

        diff = event.diff_values()

        assert len(diff) == 2
        assert {"key": "id", "old": None, "new": 1} in diff
        assert {"key": "name", "old": None, "new": "test"} in diff

    def test_diff_values_update(self) -> None:
        """Test diff_values for UPDATE event."""
        event = ChangeEvent(
            event_id="2",
            event_timestamp=datetime(2024, 1, 1, 12, 0, 0),
            trigger_type=TriggerType.UPDATE,
            transaction_id="txn_2",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            old_values=[{"id": 1, "name": "old", "status": "active"}],
            new_values=[{"id": 1, "name": "new", "status": "active"}],
        )

        diff = event.diff_values()

        assert len(diff) == 1
        assert {"key": "name", "old": "old", "new": "new"} in diff

    def test_diff_values_delete(self) -> None:
        """Test diff_values for DELETE event."""
        event = ChangeEvent(
            event_id="3",
            event_timestamp=datetime(2024, 1, 1, 12, 0, 0),
            trigger_type=TriggerType.DELETE,
            transaction_id="txn_3",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            old_values=[{"id": 1, "name": "deleted"}],
            new_values=None,
        )

        diff = event.diff_values()

        assert len(diff) == 2
        assert {"key": "id", "old": 1, "new": None} in diff
        assert {"key": "name", "old": "deleted", "new": None} in diff


class TestBatchChange:
    """Test suite for BatchChange."""

    def test_empty_batch(self) -> None:
        """Test creation of empty batch."""
        batch = BatchChange(changes=[])

        assert len(batch) == 0
        assert batch.is_empty()
        assert batch.get_total_changes() == 0

    def test_batch_with_changes(self) -> None:
        """Test batch with multiple changes."""
        event1 = ChangeEvent(
            event_id="1",
            event_timestamp=datetime(2024, 1, 1, 12, 0, 0),
            trigger_type=TriggerType.INSERT,
            transaction_id="txn_1",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            new_values=[{"id": 1}],
        )
        event2 = ChangeEvent(
            event_id="2",
            event_timestamp=datetime(2024, 1, 1, 12, 0, 1),
            trigger_type=TriggerType.UPDATE,
            transaction_id="txn_2",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            old_values=[{"id": 1}],
            new_values=[{"id": 1, "name": "updated"}],
        )

        batch = BatchChange(changes=[event1, event2])

        assert len(batch) == 2
        assert not batch.is_empty()
        assert batch.get_total_changes() == 2

    def test_add_change(self) -> None:
        """Test adding change to batch."""
        batch = BatchChange(changes=[])
        event = ChangeEvent(
            event_id="1",
            event_timestamp=datetime(2024, 1, 1, 12, 0, 0),
            trigger_type=TriggerType.INSERT,
            transaction_id="txn_1",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            new_values=[{"id": 1}],
        )

        batch.add_change(event)

        assert len(batch) == 1
        assert not batch.is_empty()

    def test_get_max_event_id(self) -> None:
        """Test getting maximum event ID from batch."""
        event1 = ChangeEvent(
            event_id="5",
            event_timestamp=datetime(2024, 1, 1, 12, 0, 0),
            trigger_type=TriggerType.INSERT,
            transaction_id="txn_1",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            new_values=[{"id": 1}],
        )
        event2 = ChangeEvent(
            event_id="10",
            event_timestamp=datetime(2024, 1, 1, 12, 0, 1),
            trigger_type=TriggerType.UPDATE,
            transaction_id="txn_2",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            old_values=[{"id": 1}],
            new_values=[{"id": 1, "name": "updated"}],
        )

        batch = BatchChange(changes=[event1, event2])

        assert batch.get_max_event_id() == 10

    def test_get_newest_change_timestamp(self) -> None:
        """Test getting newest change timestamp from batch."""
        timestamp1 = datetime(2024, 1, 1, 12, 0, 0)
        timestamp2 = datetime(2024, 1, 1, 12, 0, 1)
        event1 = ChangeEvent(
            event_id="1",
            event_timestamp=timestamp1,
            trigger_type=TriggerType.INSERT,
            transaction_id="txn_1",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            new_values=[{"id": 1}],
        )
        event2 = ChangeEvent(
            event_id="2",
            event_timestamp=timestamp2,
            trigger_type=TriggerType.UPDATE,
            transaction_id="txn_2",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            old_values=[{"id": 1}],
            new_values=[{"id": 1, "name": "updated"}],
        )

        batch = BatchChange(changes=[event1, event2])

        assert batch.get_newest_change_timestamp() == timestamp2

    def test_batch_iteration(self) -> None:
        """Test iterating over batch changes."""
        event1 = ChangeEvent(
            event_id="1",
            event_timestamp=datetime(2024, 1, 1, 12, 0, 0),
            trigger_type=TriggerType.INSERT,
            transaction_id="txn_1",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            new_values=[{"id": 1}],
        )
        event2 = ChangeEvent(
            event_id="2",
            event_timestamp=datetime(2024, 1, 1, 12, 0, 1),
            trigger_type=TriggerType.UPDATE,
            transaction_id="txn_2",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            old_values=[{"id": 1}],
            new_values=[{"id": 1, "name": "updated"}],
        )

        batch = BatchChange(changes=[event1, event2])
        changes_list = list(batch)

        assert len(changes_list) == 2
        assert changes_list[0] == event1
        assert changes_list[1] == event2

    def test_batch_str(self) -> None:
        """Test string representation of batch."""
        batch = BatchChange(changes=[])
        batch_str = str(batch)

        assert "BatchChange" in batch_str
        assert "changes=0" in batch_str


class TestPruneResult:
    """Test suite for PruneResult."""

    def test_prune_result_creation(self) -> None:
        """Test creation of PruneResult."""
        result = PruneResult(
            entries_deleted=100,
            cutoff_timestamp="2024-01-01T00:00:00",
        )

        assert result.entries_deleted == 100
        assert result.cutoff_timestamp == "2024-01-01T00:00:00"

    def test_prune_result_str(self) -> None:
        """Test string representation of PruneResult."""
        result = PruneResult(
            entries_deleted=50,
            cutoff_timestamp="2024-01-01T00:00:00",
        )
        result_str = str(result)

        assert "PruneResult" in result_str
        assert "entries_deleted=50" in result_str
        assert "cutoff_timestamp=2024-01-01T00:00:00" in result_str


class TestChangeEventFailures:
    """Test suite for ChangeEvent failure scenarios."""

    def test_diff_values_with_none_new_values_insert(self) -> None:
        """Test diff_values with None new_values for INSERT."""
        event = ChangeEvent(
            event_id="1",
            event_timestamp=datetime(2024, 1, 1, 12, 0, 0),
            trigger_type=TriggerType.INSERT,
            transaction_id="txn_1",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            old_values=None,
            new_values=None,
        )

        diff = event.diff_values()
        assert diff == []

    def test_diff_values_with_none_old_values_delete(self) -> None:
        """Test diff_values with None old_values for DELETE."""
        event = ChangeEvent(
            event_id="3",
            event_timestamp=datetime(2024, 1, 1, 12, 0, 0),
            trigger_type=TriggerType.DELETE,
            transaction_id="txn_3",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            old_values=None,
            new_values=None,
        )

        diff = event.diff_values()
        assert diff == []

    def test_diff_values_update_with_missing_values(self) -> None:
        """Test diff_values for UPDATE with None values."""
        event = ChangeEvent(
            event_id="2",
            event_timestamp=datetime(2024, 1, 1, 12, 0, 0),
            trigger_type=TriggerType.UPDATE,
            transaction_id="txn_2",
            schema_name="TEST_SCHEMA",
            table_name="TABLE1",
            full_table_name="TEST_SCHEMA.TABLE1",
            old_values=None,
            new_values=None,
        )

        diff = event.diff_values()
        assert diff is None or diff == []


class TestBatchChangeFailures:
    """Test suite for BatchChange failure scenarios."""

    def test_get_max_event_id_empty_batch(self) -> None:
        """Test getting max event ID from empty batch raises error."""
        batch = BatchChange(changes=[])

        with pytest.raises(ValueError):
            batch.get_max_event_id()

    def test_get_newest_change_timestamp_empty_batch(self) -> None:
        """Test getting newest timestamp from empty batch raises error."""
        batch = BatchChange(changes=[])

        with pytest.raises(ValueError):
            batch.get_newest_change_timestamp()
