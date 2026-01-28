"""Tests for SAP HANA CDC connector."""

import os
import pytest
from unittest.mock import Mock, patch, MagicMock

from sap_hana_cdc.connector import SAPHanaCDCConnector
from sap_hana_cdc.infrastructure import SAPHanaCDCInfrastructure
from sap_hana_cdc.reader import SAPHanaCDCReader
from sap_hana_cdc.config import SAPHanaCDCConfig
from sap_hana_cdc.models import BatchChange, ClientTableStatus


class TestSAPHanaCDCConnector:
    """Test suite for SAPHanaCDCConnector."""

    def test_initialization(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
    ) -> None:
        """Test connector initialization."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)

        assert connector.infrastructure == infrastructure
        assert connector.reader == reader
        assert connector.config == sample_config

    def test_connection_property(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
    ) -> None:
        """Test connection property returns reader's connection."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)

        assert connector.connection == mock_connection

    def test_init_cdc(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        mocker,
    ) -> None:
        """Test CDC initialization."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        mocker.patch.object(infrastructure, "setup_cdc_infrastructure")

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)
        connector.init_cdc()

        infrastructure.setup_cdc_infrastructure.assert_called_once()

    def test_get_changes(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        sample_batch_change: BatchChange,
        mocker,
    ) -> None:
        """Test getting changes."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        mocker.patch.object(reader, "get_changes", return_value=sample_batch_change)

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)
        changes = connector.get_changes(limit=100)

        reader.get_changes.assert_called_once_with(100)
        assert changes == sample_batch_change

    def test_reset_cdc_status(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        mocker,
    ) -> None:
        """Test resetting CDC status."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        mocker.patch.object(infrastructure, "reset_cdc_status")

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)
        connector.reset_cdc_status()

        infrastructure.reset_cdc_status.assert_called_once()

    def test_update_client_status(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        sample_batch_change: BatchChange,
        mocker,
    ) -> None:
        """Test updating client status."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        mocker.patch.object(reader, "update_client_status")

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)
        connector.update_client_status(sample_batch_change)

        reader.update_client_status.assert_called_once_with(sample_batch_change)

    def test_get_current_monitored_tables(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        mocker,
    ) -> None:
        """Test getting current monitored tables."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        expected_tables = {"TABLE1": {"INSERT", "UPDATE"}}
        mocker.patch.object(
            reader, "get_current_monitored_tables", return_value=expected_tables
        )

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)
        tables = connector.get_current_monitored_tables()

        reader.get_current_monitored_tables.assert_called_once()
        assert tables == expected_tables

    def test_get_all_table_rows(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        mocker,
    ) -> None:
        """Test getting all table rows."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        expected_rows = [{"id": 1, "name": "test"}]
        mocker.patch.object(
            reader, "get_all_table_rows", return_value=expected_rows
        )

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)
        rows = connector.get_all_table_rows("TABLE1", page_size=100, offset=0)

        reader.get_all_table_rows.assert_called_once_with("TABLE1", 100, 0)
        assert rows == expected_rows

    def test_get_client_status(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        sample_client_status: ClientTableStatus,
        mocker,
    ) -> None:
        """Test getting client status."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        expected_status = [sample_client_status]
        mocker.patch.object(reader, "get_client_status", return_value=expected_status)

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)
        status = connector.get_client_status()

        reader.get_client_status.assert_called_once()
        assert status == expected_status

    def test_is_view(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        mocker,
    ) -> None:
        """Test checking if object is a view."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        mocker.patch.object(infrastructure, "_is_view", return_value=True)

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)
        is_view = connector.is_view("VIEW1")

        infrastructure._is_view.assert_called_once_with("VIEW1")
        assert is_view is True

    def test_cleanup_cdc_infrastructure(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        mocker,
    ) -> None:
        """Test cleaning up CDC infrastructure."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        mocker.patch.object(infrastructure, "cleanup_cdc_infrastructure")

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)
        connector.cleanup_cdc_infrastructure()

        infrastructure.cleanup_cdc_infrastructure.assert_called_once()

    def test_get_status(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        mocker,
    ) -> None:
        """Test getting CDC status."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        expected_status = {
            "total_entries": 100,
            "lag_seconds": 5,
            "max_timestamp": "2024-01-01T12:00:00",
            "last_client_update": "2024-01-01T11:59:55",
        }
        mocker.patch.object(reader, "get_status", return_value=expected_status)

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)
        status = connector.get_status("test_client")

        reader.get_status.assert_called_once_with("test_client")
        assert status == expected_status

    def test_prune(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        mocker,
    ) -> None:
        """Test pruning old entries."""
        from sap_hana_cdc.models import PruneResult

        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        expected_result = PruneResult(
            entries_deleted=50, cutoff_timestamp="2024-01-01T00:00:00"
        )
        mocker.patch.object(reader, "prune", return_value=expected_result)

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)
        result = connector.prune(older_than_days=7)

        reader.prune.assert_called_once_with(7)
        assert result == expected_result

    @patch("sap_hana_cdc.connector.dbapi.connect")
    def test_build_from_config(
        self,
        mock_dbapi_connect: Mock,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
    ) -> None:
        """Test building connector from config."""
        mock_dbapi_connect.return_value = mock_connection

        connector = SAPHanaCDCConnector.build_from_config(sample_config)

        mock_dbapi_connect.assert_called_once_with(
            address=sample_config.host,
            port=sample_config.port,
            user=sample_config.user,
            password=sample_config.password,
        )
        assert connector.config == sample_config
        assert connector.connection == mock_connection

    @patch("sap_hana_cdc.connector.dbapi.connect")
    @patch("sap_hana_cdc.config.SAPHanaCDCConfig.from_env")
    def test_build_from_env(
        self,
        mock_from_env: Mock,
        mock_dbapi_connect: Mock,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
    ) -> None:
        """Test building connector from environment variables."""
        mock_from_env.return_value = sample_config
        mock_dbapi_connect.return_value = mock_connection

        connector = SAPHanaCDCConnector.build_from_env()

        mock_from_env.assert_called_once_with(prefix="SAP_HANA_")
        mock_dbapi_connect.assert_called_once()
        assert connector.config == sample_config


class TestConnectorFailures:
    """Test suite for connector failure scenarios."""

    @patch("sap_hana_cdc.connector.dbapi.connect")
    def test_build_from_config_with_connection_error(
        self,
        mock_dbapi_connect: Mock,
        sample_config: SAPHanaCDCConfig,
    ) -> None:
        """Test build_from_config handles connection errors."""
        mock_dbapi_connect.side_effect = Exception("Connection refused")

        with pytest.raises(Exception) as exc_info:
            SAPHanaCDCConnector.build_from_config(sample_config)

        assert "Connection refused" in str(exc_info.value)

    @patch("sap_hana_cdc.connector.dbapi.connect")
    @patch("sap_hana_cdc.config.SAPHanaCDCConfig.from_env")
    def test_build_from_env_with_missing_env_vars(
        self,
        mock_from_env: Mock,
        mock_dbapi_connect: Mock,
    ) -> None:
        """Test build_from_env handles missing environment variables."""
        mock_from_env.side_effect = KeyError("Missing required environment variable")

        with pytest.raises(KeyError):
            SAPHanaCDCConnector.build_from_env()

    def test_init_cdc_with_infrastructure_error(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        mocker,
    ) -> None:
        """Test init_cdc handles infrastructure setup errors."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        mocker.patch.object(
            infrastructure,
            "setup_cdc_infrastructure",
            side_effect=Exception("Permission denied"),
        )

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)

        with pytest.raises(Exception) as exc_info:
            connector.init_cdc()

        assert "Permission denied" in str(exc_info.value)

    def test_get_changes_with_reader_error(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        mocker,
    ) -> None:
        """Test get_changes handles reader errors."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        mocker.patch.object(
            reader, "get_changes", side_effect=Exception("Query failed")
        )

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)

        with pytest.raises(Exception) as exc_info:
            connector.get_changes(limit=100)

        assert "Query failed" in str(exc_info.value)

    def test_reset_cdc_status_with_error(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        mocker,
    ) -> None:
        """Test reset_cdc_status handles errors."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        mocker.patch.object(
            infrastructure, "reset_cdc_status", side_effect=Exception("Reset failed")
        )

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)

        with pytest.raises(Exception) as exc_info:
            connector.reset_cdc_status()

        assert "Reset failed" in str(exc_info.value)

    def test_update_client_status_with_error(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        sample_batch_change: BatchChange,
        mocker,
    ) -> None:
        """Test update_client_status handles errors."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        mocker.patch.object(
            reader, "update_client_status", side_effect=Exception("Update failed")
        )

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)

        with pytest.raises(Exception) as exc_info:
            connector.update_client_status(sample_batch_change)

        assert "Update failed" in str(exc_info.value)

    def test_cleanup_cdc_infrastructure_with_error(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        mocker,
    ) -> None:
        """Test cleanup_cdc_infrastructure handles errors."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        mocker.patch.object(
            infrastructure,
            "cleanup_cdc_infrastructure",
            side_effect=Exception("Cleanup failed"),
        )

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)

        with pytest.raises(Exception) as exc_info:
            connector.cleanup_cdc_infrastructure()

        assert "Cleanup failed" in str(exc_info.value)

    def test_get_status_with_error(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        mocker,
    ) -> None:
        """Test get_status handles errors."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        mocker.patch.object(
            reader, "get_status", side_effect=Exception("Status retrieval failed")
        )

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)

        with pytest.raises(Exception) as exc_info:
            connector.get_status("test_client")

        assert "Status retrieval failed" in str(exc_info.value)

    def test_prune_with_error(
        self,
        mock_connection: Mock,
        sample_config: SAPHanaCDCConfig,
        mocker,
    ) -> None:
        """Test prune handles errors."""
        infrastructure = SAPHanaCDCInfrastructure(mock_connection, sample_config)
        reader = SAPHanaCDCReader(mock_connection, sample_config)

        mocker.patch.object(
            reader, "prune", side_effect=Exception("Prune operation failed")
        )

        connector = SAPHanaCDCConnector(infrastructure, reader, sample_config)

        with pytest.raises(Exception) as exc_info:
            connector.prune(older_than_days=7)

        assert "Prune operation failed" in str(exc_info.value)

    @patch("sap_hana_cdc.connector.dbapi.connect")
    def test_build_from_config_with_auth_error(
        self,
        mock_dbapi_connect: Mock,
        sample_config: SAPHanaCDCConfig,
    ) -> None:
        """Test build_from_config handles authentication errors."""
        mock_dbapi_connect.side_effect = Exception("Authentication failed")

        with pytest.raises(Exception) as exc_info:
            SAPHanaCDCConnector.build_from_config(sample_config)

        assert "Authentication failed" in str(exc_info.value)
