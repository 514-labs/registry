"""Tests for SAP HANA CDC data reader."""

import json
import pytest
from unittest.mock import Mock
from datetime import datetime, timedelta

from sap_hana_cdc.reader import SAPHanaCDCReader
from sap_hana_cdc.models import (
    BatchChange,
    ChangeEvent,
    TriggerType,
    TableStatus,
    ClientTableStatus,
)
from sap_hana_cdc.config import SAPHanaCDCConfig


class TestSAPHanaCDCReader:
    """Test suite for SAPHanaCDCReader."""

    def test_initialization(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test reader initialization."""
        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)

        assert reader.connection == mock_connection
        assert reader.config == sample_config

    def test_get_changes_with_results(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test getting changes when results exist."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        timestamp = datetime(2024, 1, 1, 12, 0, 0)

        cursor.fetchall.return_value = [
            (
                1,
                "TEST_SCHEMA",
                "TABLE1",
                "INSERT",
                timestamp,
                "txn_1",
                None,
                json.dumps([{"id": 1, "name": "test"}]),
            ),
        ]

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        batch = reader.get_changes(limit=100)

        assert len(batch.changes) == 1
        assert batch.changes[0].event_id == "1"
        assert batch.changes[0].trigger_type == TriggerType.INSERT
        assert batch.changes[0].table_name == "TABLE1"

    def test_get_changes_empty_results(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test getting changes when no results exist."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchall.return_value = []

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        batch = reader.get_changes(limit=100)

        assert len(batch.changes) == 0
        assert batch.is_empty()

    def test_get_changes_respects_limit(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test that get_changes respects the limit parameter."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchall.return_value = []

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        reader.get_changes(limit=50)

        call_args = cursor.execute.call_args
        assert call_args[0][1][2] == 50

    def test_get_client_status(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test getting client status."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchall.return_value = [
            ("TEST_SCHEMA", "TABLE1", "ACTIVE"),
            ("TEST_SCHEMA", "TABLE2", "NEW"),
        ]

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        statuses = reader.get_client_status()

        assert len(statuses) == 2
        assert statuses[0].table_name == "TABLE1"
        assert statuses[0].status == TableStatus.ACTIVE
        assert statuses[1].table_name == "TABLE2"
        assert statuses[1].status == TableStatus.NEW

    def test_update_client_status(
        self,
        simple_mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        sample_batch: BatchChange,
    ) -> None:
        """Test updating client status."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        reader.update_client_status(sample_batch)

        assert cursor.execute.called
        assert mock_connection.commit.called

    def test_update_client_status_with_multiple_tables(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test updating client status for multiple tables."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value

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
            table_name="TABLE2",
            full_table_name="TEST_SCHEMA.TABLE2",
            old_values=[{"id": 1}],
            new_values=[{"id": 1, "name": "updated"}],
        )

        batch = BatchChange(changes=[event1, event2])

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        reader.update_client_status(batch)

        assert cursor.execute.call_count >= 2
        assert mock_connection.commit.called

    def test_get_all_table_rows(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test getting all table rows."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchall.side_effect = [
            [("id", "INTEGER"), ("name", "VARCHAR")],
            [(1, "test1"), (2, "test2")],
        ]

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        rows = reader.get_all_table_rows("TABLE1", page_size=100, offset=0)

        assert len(rows) == 2
        assert rows[0] == {"id": 1, "name": "test1"}
        assert rows[1] == {"id": 2, "name": "test2"}

    def test_get_all_table_rows_empty_table(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test getting rows from empty table."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchall.side_effect = [
            [("id", "INTEGER"), ("name", "VARCHAR")],
            [],
        ]

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        rows = reader.get_all_table_rows("TABLE1", page_size=100, offset=0)

        assert len(rows) == 0

    def test_get_all_table_rows_with_pagination(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test getting table rows with pagination."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchall.side_effect = [
            [("id", "INTEGER"), ("name", "VARCHAR")],
            [(11, "test11"), (12, "test12")],
        ]

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        rows = reader.get_all_table_rows("TABLE1", page_size=2, offset=10)

        assert len(rows) == 2
        assert cursor.execute.call_args_list[1][0][1] == (2, 10)

    def test_parse_json_valid(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test parsing valid JSON."""
        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        result = reader._parse_json('{"id": 1, "name": "test"}')

        assert result == {"id": 1, "name": "test"}

    def test_parse_json_invalid(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test parsing invalid JSON returns empty dict."""
        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        result = reader._parse_json("invalid json")

        assert result == {}

    def test_parse_json_empty_string(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test parsing empty string returns empty dict."""
        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        result = reader._parse_json("")

        assert result == {}

    def test_get_status(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test getting CDC status."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        max_timestamp = datetime(2024, 1, 1, 12, 0, 0)
        last_update = datetime(2024, 1, 1, 11, 59, 0)

        cursor.fetchone.side_effect = [
            (100,),
            (max_timestamp,),
            (last_update,),
        ]

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        status = reader.get_status("test_client")

        assert status["total_entries"] == 100
        assert status["max_timestamp"] == max_timestamp.isoformat()
        assert status["last_client_update"] == last_update.isoformat()
        assert isinstance(status["lag_seconds"], int)

    def test_get_status_no_changes(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test getting status when no changes exist."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchone.side_effect = [
            (0,),
            (None,),
            (None,),
        ]

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        status = reader.get_status("test_client")

        assert status["total_entries"] == 0
        assert status["max_timestamp"] is None
        assert status["last_client_update"] is None
        assert status["lag_seconds"] == 0

    def test_prune(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test pruning old entries."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.rowcount = 50

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        result = reader.prune(older_than_days=7)

        assert result.entries_deleted == 50
        assert cursor.execute.called
        delete_call_found = False
        for call_args in cursor.execute.call_args_list:
            sql = call_args[0][0]
            if "DELETE FROM" in sql and "CDC_CHANGES" in sql:
                delete_call_found = True
                break

        assert delete_call_found

    def test_prune_custom_retention(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test pruning with custom retention period."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.rowcount = 25

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        result = reader.prune(older_than_days=30)

        assert result.entries_deleted == 25
        assert cursor.execute.called

    def test_get_current_monitored_tables(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test getting currently monitored tables."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchall.return_value = [
            ("TABLE1", "TABLE1_INSERT_CDC_TRIGGER"),
            ("TABLE1", "TABLE1_UPDATE_CDC_TRIGGER"),
            ("TABLE2", "TABLE2_INSERT_CDC_TRIGGER"),
        ]

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        monitored = reader.get_current_monitored_tables()

        assert "TABLE1" in monitored
        assert "TABLE2" in monitored
        assert "INSERT" in monitored["TABLE1"]
        assert "UPDATE" in monitored["TABLE1"]
        assert "INSERT" in monitored["TABLE2"]
        assert len(monitored["TABLE2"]) == 1

    def test_get_current_monitored_tables_empty(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test getting monitored tables when none exist."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchall.return_value = []

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        monitored = reader.get_current_monitored_tables()

        assert len(monitored) == 0

    def test_get_change_table_name(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test getting change table name."""
        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        table_name = reader._get_change_table_name()

        assert table_name == f"{sample_config.cdc_schema}.CDC_CHANGES"

    def test_get_client_status_table_name(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test getting client status table name."""
        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        table_name = reader._get_client_status_table_name()

        assert table_name == f"{sample_config.cdc_schema}.CDC_CLIENT_STATUS"


class TestReaderFailures:
    """Test suite for reader failure scenarios."""

    def test_get_changes_with_db_error(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test get_changes handles database errors."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.execute.side_effect = Exception("Database connection lost")

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)

        with pytest.raises(Exception) as exc_info:
            reader.get_changes(limit=100)

        assert "Database connection lost" in str(exc_info.value)

    def test_get_changes_with_malformed_json(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test get_changes handles malformed JSON gracefully."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        timestamp = datetime(2024, 1, 1, 12, 0, 0)

        cursor.fetchall.return_value = [
            (
                1,
                "TEST_SCHEMA",
                "TABLE1",
                "INSERT",
                timestamp,
                "txn_1",
                None,
                "not valid json {[}",
            ),
        ]

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        batch = reader.get_changes(limit=100)

        assert len(batch.changes) == 1
        assert batch.changes[0].new_values == {}

    def test_get_client_status_with_db_error(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test get_client_status handles database errors."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.execute.side_effect = Exception("Query timeout")

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)

        with pytest.raises(Exception) as exc_info:
            reader.get_client_status()

        assert "Query timeout" in str(exc_info.value)

    def test_update_client_status_with_db_error(
        self,
        simple_mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        sample_batch: BatchChange,
    ) -> None:
        """Test update_client_status handles database errors."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.execute.side_effect = Exception("Update failed")

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)

        with pytest.raises(Exception) as exc_info:
            reader.update_client_status(sample_batch)

        assert "Update failed" in str(exc_info.value)

    def test_get_all_table_rows_with_nonexistent_table(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test get_all_table_rows with nonexistent table."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchall.return_value = []

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)
        rows = reader.get_all_table_rows("NONEXISTENT_TABLE", page_size=100, offset=0)

        assert len(rows) == 0

    def test_get_all_table_rows_with_db_error(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test get_all_table_rows handles database errors."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchall.side_effect = Exception("Table access denied")

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)

        with pytest.raises(Exception) as exc_info:
            reader.get_all_table_rows("TABLE1", page_size=100, offset=0)

        assert "Table access denied" in str(exc_info.value)

    def test_get_status_with_db_error(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test get_status handles database errors."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.execute.side_effect = Exception("Status query failed")

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)

        with pytest.raises(Exception) as exc_info:
            reader.get_status("test_client")

        assert "Status query failed" in str(exc_info.value)

    def test_prune_with_db_error(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test prune handles database errors."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.execute.side_effect = Exception("Delete operation failed")

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)

        with pytest.raises(Exception) as exc_info:
            reader.prune(older_than_days=7)

        assert "Delete operation failed" in str(exc_info.value)

    def test_get_current_monitored_tables_with_db_error(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test get_current_monitored_tables handles database errors."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.execute.side_effect = Exception("Trigger query failed")

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)

        with pytest.raises(Exception) as exc_info:
            reader.get_current_monitored_tables()

        assert "Trigger query failed" in str(exc_info.value)

    def test_get_changes_with_invalid_trigger_type(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test get_changes handles invalid trigger type."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        timestamp = datetime(2024, 1, 1, 12, 0, 0)

        cursor.fetchall.return_value = [
            (
                1,
                "TEST_SCHEMA",
                "TABLE1",
                "INVALID_TYPE",
                timestamp,
                "txn_1",
                None,
                json.dumps([{"id": 1}]),
            ),
        ]

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)

        with pytest.raises(KeyError):
            reader.get_changes(limit=100)

    def test_get_client_status_with_invalid_status(
        self, simple_mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test get_client_status handles invalid status values."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchall.return_value = [
            ("TEST_SCHEMA", "TABLE1", "INVALID_STATUS"),
        ]

        reader = SAPHanaCDCReader(simple_mock_connection, sample_config)

        with pytest.raises(KeyError):
            reader.get_client_status()
