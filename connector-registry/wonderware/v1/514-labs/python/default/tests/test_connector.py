"""Tests for WonderwareConnector."""
import pytest
from unittest.mock import Mock, patch


def test_build_from_env(mock_env):
    """Test building connector from environment variables."""
    from wonderware.connector import WonderwareConnector

    connector = WonderwareConnector.build_from_env()

    assert connector.config.host == "test-host"
    assert connector.connection_pool is not None


def test_build_from_config(wonderware_config):
    """Test building connector from config object."""
    from wonderware.connector import WonderwareConnector

    connector = WonderwareConnector.build_from_config(wonderware_config)

    assert connector.config == wonderware_config
    assert connector.connection_pool is not None


def test_discover_tags(wonderware_config, mock_engine):
    """Test discovering tags through connector."""
    from wonderware.connector import WonderwareConnector
    from wonderware.connection_manager import ConnectionPool

    # Mock the connection pool to return our test engine
    pool = Mock(spec=ConnectionPool)
    pool.get_engine.return_value = mock_engine

    connector = WonderwareConnector(wonderware_config, connection_pool=pool)
    tags = connector.discover_tags()

    assert len(tags) == 2
    assert "Tag1" in tags
    assert "Tag2" in tags


def test_fetch_history_data(wonderware_config, mock_engine):
    """Test fetching history data through connector."""
    from wonderware.connector import WonderwareConnector
    from wonderware.connection_manager import ConnectionPool

    pool = Mock(spec=ConnectionPool)
    pool.get_engine.return_value = mock_engine

    connector = WonderwareConnector(wonderware_config, connection_pool=pool)
    rows = connector.fetch_history_data(
        tag_names=["Tag1"],
        date_from="2026-01-01 00:00:00",
        date_to="2026-01-01 00:02:00"
    )

    assert len(rows) > 0
    assert all(isinstance(row, dict) for row in rows)


def test_get_tag_count(wonderware_config, mock_engine):
    """Test getting tag count through connector."""
    from wonderware.connector import WonderwareConnector
    from wonderware.connection_manager import ConnectionPool

    pool = Mock(spec=ConnectionPool)
    pool.get_engine.return_value = mock_engine

    connector = WonderwareConnector(wonderware_config, connection_pool=pool)
    count = connector.get_tag_count()

    assert count == 2


def test_test_connection_success(wonderware_config, mock_engine):
    """Test successful connection test."""
    from wonderware.connector import WonderwareConnector
    from wonderware.connection_manager import ConnectionPool

    pool = Mock(spec=ConnectionPool)
    pool.get_engine.return_value = mock_engine

    connector = WonderwareConnector(wonderware_config, connection_pool=pool)
    assert connector.test_connection() is True


def test_test_connection_failure(wonderware_config):
    """Test failed connection test."""
    from wonderware.connector import WonderwareConnector
    from wonderware.connection_manager import ConnectionPool

    pool = Mock(spec=ConnectionPool)
    pool.get_engine.side_effect = Exception("Connection failed")

    connector = WonderwareConnector(wonderware_config, connection_pool=pool)
    assert connector.test_connection() is False


def test_get_status_success(wonderware_config, mock_engine):
    """Test getting status with successful connection."""
    from wonderware.connector import WonderwareConnector
    from wonderware.connection_manager import ConnectionPool

    pool = Mock(spec=ConnectionPool)
    pool.get_engine.return_value = mock_engine

    connector = WonderwareConnector(wonderware_config, connection_pool=pool)
    status = connector.get_status()

    assert status.connected is True
    assert status.host == "test-host"
    assert status.database == "TestDB"
    assert status.tag_count == 2
    assert status.error is None


def test_get_status_failure(wonderware_config):
    """Test getting status with failed connection."""
    from wonderware.connector import WonderwareConnector
    from wonderware.connection_manager import ConnectionPool

    pool = Mock(spec=ConnectionPool)
    pool.get_engine.side_effect = Exception("Connection failed")

    connector = WonderwareConnector(wonderware_config, connection_pool=pool)
    status = connector.get_status()

    assert status.connected is False
    assert status.host == "test-host"
    assert status.database == "TestDB"
    assert status.tag_count is None
    assert status.error is not None


def test_refresh_connection(wonderware_config, mock_engine):
    """Test refreshing connection."""
    from wonderware.connector import WonderwareConnector
    from wonderware.connection_manager import ConnectionPool

    pool = Mock(spec=ConnectionPool)
    pool.get_engine.return_value = mock_engine

    connector = WonderwareConnector(wonderware_config, connection_pool=pool)
    connector._ensure_reader()  # Initialize reader

    assert connector.reader is not None

    connector.refresh_connection()

    pool.close.assert_called_once()
    assert connector.reader is None


def test_close(wonderware_config):
    """Test closing connector."""
    from wonderware.connector import WonderwareConnector
    from wonderware.connection_manager import ConnectionPool

    pool = Mock(spec=ConnectionPool)

    connector = WonderwareConnector(wonderware_config, connection_pool=pool)
    connector.close()

    pool.close.assert_called_once()
    assert connector.reader is None


def test_context_manager(wonderware_config):
    """Test using connector as context manager."""
    from wonderware.connector import WonderwareConnector
    from wonderware.connection_manager import ConnectionPool

    pool = Mock(spec=ConnectionPool)

    with WonderwareConnector(wonderware_config, connection_pool=pool) as connector:
        assert connector is not None

    pool.close.assert_called_once()
