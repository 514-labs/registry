"""Unit tests for BatchChangeInserter."""
import pytest
from unittest.mock import Mock, MagicMock, patch
from datetime import datetime

from app.workflows.lib.changes_inserter import BatchChangeInserter
from sap_hana_cdc import ChangeEvent, TriggerType


@pytest.mark.unit
class TestBatchChangeInserter:
    """Test BatchChangeInserter functionality."""

    def test_inserter_creation(self):
        """Test creating a BatchChangeInserter."""
        inserter = BatchChangeInserter()
        assert inserter is not None
        assert inserter._olap_table_cache == {}

    def test_normalize_table_name(self):
        """Test table name normalization."""
        inserter = BatchChangeInserter()

        # SAP HANA uses uppercase
        assert inserter._normalize_table_name("EKKO") == "ekko"
        assert inserter._normalize_table_name("T001W") == "t001w"
        assert inserter._normalize_table_name("MARA") == "mara"

        # Preserve underscores
        assert inserter._normalize_table_name("TEST_TABLE") == "test_table"

    def test_insert_table_data_with_empty_rows(self):
        """Test insert_table_data with empty rows list."""
        inserter = BatchChangeInserter()
        # Should not raise an error
        inserter.insert_table_data("EKKO", [])

    @patch("app.ingest.cdc")
    def test_insert_table_data_success(self, mock_cdc_module):
        """Test successful table data insertion."""
        # Setup mock OlapTable
        mock_table = MagicMock()
        mock_model_class = Mock()
        mock_model_instance = Mock()
        mock_model_class.return_value = mock_model_instance

        # Setup type hints for OlapTable
        mock_table.__class__.__orig_bases__ = [Mock()]
        mock_table.__class__.__orig_bases__[0].__args__ = [mock_model_class]

        mock_cdc_module.ekko = mock_table

        inserter = BatchChangeInserter()
        rows = [
            {"EBELN": "1000000001", "BUKRS": "1000"},
            {"EBELN": "1000000002", "BUKRS": "1000"},
        ]

        with patch.object(inserter, "_get_olap_table", return_value=mock_table):
            inserter.insert_table_data("EKKO", rows)

        # Verify insert was called
        assert mock_table.insert.called

    def test_insert_empty_changes(self):
        """Test insert with empty changes list."""
        inserter = BatchChangeInserter()
        # Should not raise an error
        inserter.insert([])

    @patch("app.ingest.cdc")
    def test_insert_groups_by_table(self, mock_cdc_module):
        """Test that insert groups changes by table."""
        mock_table1 = MagicMock()
        mock_table2 = MagicMock()

        # Setup model classes
        mock_model_class1 = Mock()
        mock_model_class2 = Mock()
        mock_table1.__class__.__orig_bases__ = [Mock()]
        mock_table1.__class__.__orig_bases__[0].__args__ = [mock_model_class1]
        mock_table2.__class__.__orig_bases__ = [Mock()]
        mock_table2.__class__.__orig_bases__[0].__args__ = [mock_model_class2]

        inserter = BatchChangeInserter()

        changes = [
            ChangeEvent(
                event_id="1",
                event_timestamp=datetime.now(),
                trigger_type=TriggerType.INSERT,
                transaction_id="txn_1",
                schema_name="SAPHANADB",
                table_name="EKKO",
                full_table_name="SAPHANADB.EKKO",
                new_values={"EBELN": "1000000001"},
            ),
            ChangeEvent(
                event_id="2",
                event_timestamp=datetime.now(),
                trigger_type=TriggerType.INSERT,
                transaction_id="txn_2",
                schema_name="SAPHANADB",
                table_name="EKPO",
                full_table_name="SAPHANADB.EKPO",
                new_values={"EBELN": "1000000001", "EBELP": "00010"},
            ),
            ChangeEvent(
                event_id="3",
                event_timestamp=datetime.now(),
                trigger_type=TriggerType.INSERT,
                transaction_id="txn_3",
                schema_name="SAPHANADB",
                table_name="EKKO",
                full_table_name="SAPHANADB.EKKO",
                new_values={"EBELN": "1000000002"},
            ),
        ]

        def get_table_mock(table_name):
            if table_name == "ekko":
                return mock_table1
            elif table_name == "ekpo":
                return mock_table2
            return None

        with patch.object(inserter, "_get_olap_table", side_effect=get_table_mock):
            inserter.insert(changes)

        # Both tables should have received inserts
        assert mock_table1.insert.called
        assert mock_table2.insert.called

    def test_insert_handles_insert_event(self):
        """Test that INSERT events use new_values."""
        inserter = BatchChangeInserter()
        mock_table = MagicMock()
        mock_model_class = Mock()
        mock_model_instance = Mock()
        mock_model_class.return_value = mock_model_instance

        mock_table.__class__.__orig_bases__ = [Mock()]
        mock_table.__class__.__orig_bases__[0].__args__ = [mock_model_class]

        changes = [
            ChangeEvent(
                event_id="1",
                event_timestamp=datetime.now(),
                trigger_type=TriggerType.INSERT,
                transaction_id="txn_1",
                schema_name="SAPHANADB",
                table_name="EKKO",
                full_table_name="SAPHANADB.EKKO",
                new_values={"EBELN": "1000000001", "BUKRS": "1000"},
            )
        ]

        with patch.object(inserter, "_get_olap_table", return_value=mock_table):
            inserter.insert(changes)

        # Verify model was created with new_values
        mock_model_class.assert_called_once_with(EBELN="1000000001", BUKRS="1000")

    def test_insert_handles_update_event(self):
        """Test that UPDATE events use new_values."""
        inserter = BatchChangeInserter()
        mock_table = MagicMock()
        mock_model_class = Mock()
        mock_model_instance = Mock()
        mock_model_class.return_value = mock_model_instance

        mock_table.__class__.__orig_bases__ = [Mock()]
        mock_table.__class__.__orig_bases__[0].__args__ = [mock_model_class]

        changes = [
            ChangeEvent(
                event_id="1",
                event_timestamp=datetime.now(),
                trigger_type=TriggerType.UPDATE,
                transaction_id="txn_1",
                schema_name="SAPHANADB",
                table_name="EKKO",
                full_table_name="SAPHANADB.EKKO",
                old_values={"EBELN": "1000000001", "BUKRS": "1000"},
                new_values={"EBELN": "1000000001", "BUKRS": "2000"},
            )
        ]

        with patch.object(inserter, "_get_olap_table", return_value=mock_table):
            inserter.insert(changes)

        # Verify model was created with new_values (not old_values)
        mock_model_class.assert_called_once_with(EBELN="1000000001", BUKRS="2000")

    def test_insert_handles_delete_event(self):
        """Test that DELETE events use old_values."""
        inserter = BatchChangeInserter()
        mock_table = MagicMock()
        mock_model_class = Mock()
        mock_model_instance = Mock()
        mock_model_class.return_value = mock_model_instance

        mock_table.__class__.__orig_bases__ = [Mock()]
        mock_table.__class__.__orig_bases__[0].__args__ = [mock_model_class]

        changes = [
            ChangeEvent(
                event_id="1",
                event_timestamp=datetime.now(),
                trigger_type=TriggerType.DELETE,
                transaction_id="txn_1",
                schema_name="SAPHANADB",
                table_name="EKKO",
                full_table_name="SAPHANADB.EKKO",
                old_values={"EBELN": "1000000001", "BUKRS": "1000"},
            )
        ]

        with patch.object(inserter, "_get_olap_table", return_value=mock_table):
            inserter.insert(changes)

        # Verify model was created with old_values
        mock_model_class.assert_called_once_with(EBELN="1000000001", BUKRS="1000")

    def test_get_olap_table_caches_result(self):
        """Test that _get_olap_table caches results."""
        with patch("app.ingest.cdc") as mock_module:
            mock_table = Mock()
            mock_module.ekko = mock_table

            inserter = BatchChangeInserter()

            # First call should access module
            table1 = inserter._get_olap_table("ekko")
            assert table1 is mock_table

            # Second call should use cache
            table2 = inserter._get_olap_table("ekko")
            assert table2 is mock_table
            assert table1 is table2

            # Cache should have one entry
            assert "ekko" in inserter._olap_table_cache

    def test_get_olap_table_returns_none_for_missing(self):
        """Test that _get_olap_table returns None for missing tables."""
        # Create a mock with spec=[] so it has no attributes
        # This ensures hasattr() returns False for any attribute
        mock_module = Mock(spec=[])

        with patch("app.ingest.cdc", mock_module):
            inserter = BatchChangeInserter()
            table = inserter._get_olap_table("missing_table")
            assert table is None

    def test_insert_with_retry_success_on_first_attempt(self):
        """Test _insert_with_retry succeeds on first attempt."""
        mock_table = MagicMock()
        inserter = BatchChangeInserter()

        models = [Mock()]
        inserter._insert_with_retry(mock_table, models)

        mock_table.insert.assert_called_once()

    def test_insert_with_retry_retries_on_failure(self):
        """Test _insert_with_retry retries on failure."""
        mock_table = MagicMock()
        # Fail twice, succeed on third attempt
        mock_table.insert.side_effect = [
            Exception("Failure 1"),
            Exception("Failure 2"),
            None,  # Success
        ]

        inserter = BatchChangeInserter()
        models = [Mock()]

        # Should succeed after retries
        inserter._insert_with_retry(mock_table, models)

        # Should have been called 3 times
        assert mock_table.insert.call_count == 3
