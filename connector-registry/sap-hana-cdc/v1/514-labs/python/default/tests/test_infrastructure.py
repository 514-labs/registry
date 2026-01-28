"""Tests for SAP HANA CDC infrastructure management."""

import pytest
from unittest.mock import Mock, MagicMock, call

from sap_hana_cdc.infrastructure import SAPHanaCDCInfrastructure
from sap_hana_cdc.models import TriggerType, TableStatus
from sap_hana_cdc.config import SAPHanaCDCConfig


class TestSAPHanaCDCInfrastructure:
    """Test suite for SAPHanaCDCInfrastructure."""

    def test_initialization(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test infrastructure initialization."""
        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)

        assert infra.connection == mock_connection
        assert infra.config == sample_config
        assert (
            infra.full_changes_table_name
            == f"{sample_config.cdc_schema}.CDC_CHANGES"
        )
        assert (
            infra.full_client_status_table_name
            == f"{sample_config.cdc_schema}.CDC_CLIENT_STATUS"
        )

    def test_create_change_table_creates_if_not_exists(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test that change table is created if it doesn't exist."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchone.return_value = (0,)

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        infra.create_change_table()

        assert cursor.execute.call_count >= 1
        create_table_call = None
        for call_args in cursor.execute.call_args_list:
            sql = call_args[0][0]
            if "CREATE TABLE" in sql and "CDC_CHANGES" in sql:
                create_table_call = sql
                break

        assert create_table_call is not None
        assert "CHANGE_ID" in create_table_call
        assert "TABLE_SCHEMA" in create_table_call
        assert "TABLE_NAME" in create_table_call
        assert "TRIGGER_TYPE" in create_table_call

    def test_create_change_table_skips_if_exists(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test that change table creation is skipped if it exists."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchone.return_value = (1,)

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        infra.create_change_table()

        create_table_calls = [
            call_args
            for call_args in cursor.execute.call_args_list
            if "CREATE TABLE" in str(call_args)
            and "CDC_CHANGES" in str(call_args)
        ]
        assert len(create_table_calls) == 0

    def test_create_client_status_table(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test client status table creation."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchone.return_value = (0,)

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        infra.create_client_status_table()

        assert cursor.execute.call_count >= 1
        create_table_call = None
        for call_args in cursor.execute.call_args_list:
            sql = call_args[0][0]
            if "CREATE TABLE" in sql and "CDC_CLIENT_STATUS" in sql:
                create_table_call = sql
                break

        assert create_table_call is not None
        assert "CLIENT_ID" in create_table_call
        assert "SCHEMA_NAME" in create_table_call
        assert "TABLE_NAME" in create_table_call
        assert "LAST_PROCESSED_CHANGE_ID" in create_table_call

    def test_get_monitored_tables(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test getting list of monitored tables."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchall.return_value = [
            ("TABLE1",),
            ("TABLE2",),
        ]

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        monitored = infra.get_monitored_tables()

        assert monitored == ["TABLE1", "TABLE2"]
        assert cursor.execute.called

    def test_get_trigger_name(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test trigger name generation."""
        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)

        insert_trigger = infra._get_trigger_name("TABLE1", TriggerType.INSERT)
        update_trigger = infra._get_trigger_name("TABLE1", TriggerType.UPDATE)
        delete_trigger = infra._get_trigger_name("TABLE1", TriggerType.DELETE)

        assert insert_trigger == "TABLE1_INSERT_CDC_TRIGGER"
        assert update_trigger == "TABLE1_UPDATE_CDC_TRIGGER"
        assert delete_trigger == "TABLE1_DELETE_CDC_TRIGGER"

    def test_get_trigger_name_sanitizes_table_name(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test trigger name sanitization for special characters."""
        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)

        trigger_name = infra._get_trigger_name(
            "TABLE-WITH.SPECIAL$CHARS", TriggerType.INSERT
        )

        assert trigger_name == "TABLE_WITH_SPECIAL_CHARS_INSERT_CDC_TRIGGER"

    def test_check_trigger_exists_returns_true(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test checking if trigger exists returns true."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchone.return_value = (1,)

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        exists = infra._check_trigger_exists(cursor, "TABLE1", TriggerType.INSERT)

        assert exists is True

    def test_check_trigger_exists_returns_false(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test checking if trigger exists returns false."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchone.return_value = (0,)

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        exists = infra._check_trigger_exists(cursor, "TABLE1", TriggerType.INSERT)

        assert exists is False

    def test_table_exists_returns_true(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test table existence check returns true."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchone.return_value = (1,)

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        exists = infra._table_exists("SCHEMA", "TABLE1")

        assert exists is True

    def test_table_exists_returns_false(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test table existence check returns false."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchone.return_value = (0,)

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        exists = infra._table_exists("SCHEMA", "TABLE1")

        assert exists is False

    def test_is_view_returns_true(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test view check returns true for views."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchone.return_value = (1,)

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        is_view = infra._is_view("VIEW1")

        assert is_view is True

    def test_is_view_returns_false(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test view check returns false for tables."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchone.return_value = (0,)

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        is_view = infra._is_view("TABLE1")

        assert is_view is False

    def test_filter_tables_only(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test filtering to include only tables, not views."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchone.side_effect = [(0,), (1,), (0,)]

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        tables = infra._filter_tables_only(["TABLE1", "VIEW1", "TABLE2"])

        assert tables == ["TABLE1", "TABLE2"]

    def test_create_select_stmt(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test creation of SELECT statement for triggers."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchall.return_value = [("id",), ("name",), ("created_at",)]

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        select_stmt = infra._create_select_stmt("TABLE1", "new_row", "new_json")

        assert ":new_row" in select_stmt
        assert "new_json" in select_stmt
        assert "FOR JSON" in select_stmt

    def test_reset_cdc_status(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test resetting CDC status."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchone.return_value = (0,)

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        infra.reset_cdc_status()

        delete_call_found = False
        for call_args in cursor.execute.call_args_list:
            sql = call_args[0][0]
            if "DELETE FROM" in sql and "CDC_CLIENT_STATUS" in sql:
                delete_call_found = True
                break

        assert delete_call_found
        assert mock_connection.commit.called

    def test_setup_cdc_infrastructure_calls_all_methods(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig, mocker
    ) -> None:
        """Test that setup_cdc_infrastructure calls all required methods."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchone.return_value = (0,)
        cursor.fetchall.return_value = []

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)

        mocker.patch.object(infra, "create_change_table")
        mocker.patch.object(infra, "create_client_status_table")
        mocker.patch.object(infra, "initialize_client_status_table")
        mocker.patch.object(infra, "setup_table_triggers")

        infra.setup_cdc_infrastructure()

        infra.create_change_table.assert_called_once()
        infra.create_client_status_table.assert_called_once()
        infra.initialize_client_status_table.assert_called_once()
        infra.setup_table_triggers.assert_called_once()

    def test_initialize_client_status_table(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test initialization of client status table."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        infra.initialize_client_status_table()

        assert mock_connection.commit.called

    def test_set_table_status_active(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test setting table status to active."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        infra.set_table_status_active("TABLE1")

        assert cursor.execute.called
        assert mock_connection.commit.called


class TestInfrastructureFailures:
    """Test suite for infrastructure failure scenarios."""

    def test_create_change_table_with_db_error(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test change table creation handles database errors."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchone.return_value = (0,)
        cursor.execute.side_effect = Exception("Database error")

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)

        with pytest.raises(Exception) as exc_info:
            infra.create_change_table()

        assert "Database error" in str(exc_info.value)

    def test_get_monitored_tables_with_db_error(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test getting monitored tables handles database errors."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.execute.side_effect = Exception("Query failed")

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)

        with pytest.raises(Exception) as exc_info:
            infra.get_monitored_tables()

        assert "Query failed" in str(exc_info.value)

    def test_table_exists_with_db_error(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test table existence check handles database errors gracefully."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.execute.side_effect = Exception("Connection lost")

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        exists = infra._table_exists("SCHEMA", "TABLE1")

        assert exists is False

    def test_is_view_with_db_error(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test view check handles database errors gracefully."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.execute.side_effect = Exception("Connection timeout")

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        is_view = infra._is_view("VIEW1")

        assert is_view is False

    def test_create_select_stmt_with_no_columns(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test create_select_stmt raises error when no columns found."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchall.return_value = []

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)

        with pytest.raises(ValueError) as exc_info:
            infra._create_select_stmt("TABLE1", "new_row", "new_json")

        assert "No columns found" in str(exc_info.value)

    def test_check_trigger_exists_with_db_error(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test trigger existence check handles errors gracefully."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.execute.side_effect = Exception("Database unavailable")

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        exists = infra._check_trigger_exists(cursor, "TABLE1", TriggerType.INSERT)

        assert exists is False

    def test_drop_trigger_with_db_error(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test drop trigger handles errors gracefully."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.execute.side_effect = Exception("Trigger not found")

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)

        infra._drop_trigger(cursor, "TABLE1", TriggerType.INSERT)

    def test_setup_table_cdc_with_db_error(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test setup_table_cdc propagates database errors."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.execute.side_effect = Exception("Permission denied")

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)

        with pytest.raises(Exception) as exc_info:
            infra._setup_table_cdc(cursor, "TABLE1")

        assert "Permission denied" in str(exc_info.value)

    def test_get_trigger_name_with_empty_table_name(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test trigger name generation with empty table name."""
        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)

        trigger_name = infra._get_trigger_name("___", TriggerType.INSERT)

        assert "TABLE_INSERT_CDC_TRIGGER" == trigger_name

    def test_cleanup_with_partial_failure(
        self, mock_connection: Mock, sample_config: SAPHanaCDCConfig
    ) -> None:
        """Test cleanup continues even if some operations fail."""
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.fetchall.return_value = [("TABLE1",)]
        cursor.execute.side_effect = [None, None, None, Exception("Drop failed")]

        infra = SAPHanaCDCInfrastructure(mock_connection, sample_config)

        infra.cleanup_cdc_infrastructure()
