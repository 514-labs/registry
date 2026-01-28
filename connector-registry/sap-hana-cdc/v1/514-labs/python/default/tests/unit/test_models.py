"""Unit tests for SAP HANA CDC models."""
import pytest
from datetime import datetime
from sap_hana_cdc import ChangeEvent, BatchChange, TriggerType, TableStatus, ClientTableStatus


@pytest.mark.unit
class TestChangeEvent:
    """Test ChangeEvent model."""

    def test_create_change_event(self):
        """Test creating a ChangeEvent."""
        event = ChangeEvent(
            event_id="123",
            event_timestamp=datetime(2025, 1, 28, 10, 0, 0),
            trigger_type=TriggerType.INSERT,
            transaction_id="txn_456",
            schema_name="SAPHANADB",
            table_name="TEST_TABLE",
            full_table_name="SAPHANADB.TEST_TABLE",
            old_values=None,
            new_values={"id": 1, "name": "Test"},
        )
        assert event.event_id == "123"
        assert event.trigger_type == TriggerType.INSERT
        assert event.table_name == "TEST_TABLE"
        assert event.new_values == {"id": 1, "name": "Test"}
        assert event.old_values is None

    def test_change_event_insert_type(self):
        """Test INSERT event has new_values."""
        event = ChangeEvent(
            event_id="1",
            event_timestamp=datetime.now(),
            trigger_type=TriggerType.INSERT,
            transaction_id="txn_1",
            schema_name="SAPHANADB",
            table_name="TEST",
            full_table_name="SAPHANADB.TEST",
            new_values={"id": 1, "value": 100},
        )
        assert event.trigger_type == TriggerType.INSERT
        assert event.new_values is not None
        assert event.old_values is None

    def test_change_event_update_type(self):
        """Test UPDATE event has both old and new values."""
        event = ChangeEvent(
            event_id="2",
            event_timestamp=datetime.now(),
            trigger_type=TriggerType.UPDATE,
            transaction_id="txn_2",
            schema_name="SAPHANADB",
            table_name="TEST",
            full_table_name="SAPHANADB.TEST",
            old_values={"id": 1, "value": 100},
            new_values={"id": 1, "value": 200},
        )
        assert event.trigger_type == TriggerType.UPDATE
        assert event.old_values == {"id": 1, "value": 100}
        assert event.new_values == {"id": 1, "value": 200}

    def test_change_event_delete_type(self):
        """Test DELETE event has old_values."""
        event = ChangeEvent(
            event_id="3",
            event_timestamp=datetime.now(),
            trigger_type=TriggerType.DELETE,
            transaction_id="txn_3",
            schema_name="SAPHANADB",
            table_name="TEST",
            full_table_name="SAPHANADB.TEST",
            old_values={"id": 1, "value": 200},
        )
        assert event.trigger_type == TriggerType.DELETE
        assert event.old_values is not None
        assert event.new_values is None

    def test_change_event_diff_values(self):
        """Test diff_values returns changed fields."""
        event = ChangeEvent(
            event_id="1",
            event_timestamp=datetime.now(),
            trigger_type=TriggerType.UPDATE,
            transaction_id="txn_1",
            schema_name="SAPHANADB",
            table_name="TEST",
            full_table_name="SAPHANADB.TEST",
            old_values={"id": 1, "name": "Old", "value": 100},
            new_values={"id": 1, "name": "New", "value": 200},
        )
        diff = event.diff_values()
        assert diff["name"] == "New"
        assert diff["value"] == 200
        assert "id" not in diff  # Unchanged


@pytest.mark.unit
class TestBatchChange:
    """Test BatchChange model."""

    def test_create_empty_batch(self):
        """Test creating an empty batch."""
        batch = BatchChange(changes=[])
        assert len(batch.changes) == 0
        assert batch.is_empty() is True

    def test_create_batch_with_changes(self, sample_change_events):
        """Test creating a batch with changes."""
        batch = BatchChange(changes=sample_change_events)
        assert len(batch.changes) == len(sample_change_events)
        assert batch.is_empty() is False

    def test_batch_iteration(self, sample_change_events):
        """Test iterating over batch changes."""
        batch = BatchChange(changes=sample_change_events)
        count = 0
        for change in batch:
            assert isinstance(change, ChangeEvent)
            count += 1
        assert count == len(sample_change_events)

    def test_batch_count(self, sample_batch):
        """Test batch count property."""
        assert sample_batch.count() == 10

    def test_batch_add_change(self):
        """Test adding changes to a batch."""
        batch = BatchChange(changes=[])
        event = ChangeEvent(
            event_id="1",
            event_timestamp=datetime.now(),
            trigger_type=TriggerType.INSERT,
            transaction_id="txn_1",
            schema_name="SAPHANADB",
            table_name="TEST",
            full_table_name="SAPHANADB.TEST",
            new_values={"id": 1},
        )
        batch.changes.append(event)
        assert batch.count() == 1

    def test_batch_bool_conversion(self):
        """Test batch truthiness."""
        empty_batch = BatchChange(changes=[])
        assert not empty_batch  # Empty batch is falsy

        non_empty_batch = BatchChange(
            changes=[
                ChangeEvent(
                    event_id="1",
                    event_timestamp=datetime.now(),
                    trigger_type=TriggerType.INSERT,
                    transaction_id="txn_1",
                    schema_name="SAPHANADB",
                    table_name="TEST",
                    full_table_name="SAPHANADB.TEST",
                    new_values={"id": 1},
                )
            ]
        )
        assert non_empty_batch  # Non-empty batch is truthy


@pytest.mark.unit
class TestTableStatus:
    """Test TableStatus enum."""

    def test_table_status_values(self):
        """Test TableStatus enum values."""
        assert TableStatus.NEW.value == "new"
        assert TableStatus.ACTIVE.value == "active"

    def test_table_status_from_string(self):
        """Test creating TableStatus from string."""
        status = TableStatus["NEW"]
        assert status == TableStatus.NEW

        status = TableStatus["ACTIVE"]
        assert status == TableStatus.ACTIVE


@pytest.mark.unit
class TestClientTableStatus:
    """Test ClientTableStatus model."""

    def test_create_client_table_status(self):
        """Test creating ClientTableStatus."""
        status = ClientTableStatus(
            schema_name="SAPHANADB", table_name="TEST_TABLE", status=TableStatus.NEW
        )
        assert status.schema_name == "SAPHANADB"
        assert status.table_name == "TEST_TABLE"
        assert status.status == TableStatus.NEW

    def test_client_table_status_active(self):
        """Test ClientTableStatus with ACTIVE status."""
        status = ClientTableStatus(
            schema_name="SAPHANADB", table_name="TEST_TABLE", status=TableStatus.ACTIVE
        )
        assert status.status == TableStatus.ACTIVE
