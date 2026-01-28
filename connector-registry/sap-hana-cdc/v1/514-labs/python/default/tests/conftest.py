"""Pytest configuration and fixtures for SAP HANA CDC tests."""
import os
import pytest
import socket
from typing import List
from datetime import datetime
from unittest.mock import Mock, MagicMock

from sap_hana_cdc import SAPHanaCDCConfig, ChangeEvent, BatchChange, TriggerType, TableStatus, ClientTableStatus
from tests.fixtures.mock_connections import create_mock_connection, MockConnection
from tests.fixtures.sample_data import (
    sample_change_event,
    sample_batch_change,
    sample_insert_event,
    sample_update_event,
    sample_delete_event,
)


# Helper function to check if a service is available
def _is_service_available(host: str, port: int, timeout: int = 2) -> bool:
    """Check if a service is available at host:port."""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except Exception:
        return False


# Check if integration tests should be enabled
ENABLE_INTEGRATION_TESTS = os.getenv("ENABLE_INTEGRATION_TESTS", "false").lower() in (
    "true",
    "1",
    "yes",
)

# Check if SAP HANA is actually available (even if enabled)
SAP_HANA_HOST = os.getenv("SAP_HANA_HOST", "localhost")
SAP_HANA_PORT = int(os.getenv("SAP_HANA_PORT", "39015"))
SAP_HANA_AVAILABLE = _is_service_available(SAP_HANA_HOST, SAP_HANA_PORT)

# Check if ClickHouse is available
CLICKHOUSE_HOST = os.getenv("CLICKHOUSE_HOST", "localhost")
CLICKHOUSE_PORT = int(os.getenv("CLICKHOUSE_HTTP_PORT", "8123"))
CLICKHOUSE_AVAILABLE = _is_service_available(CLICKHOUSE_HOST, CLICKHOUSE_PORT)

# Skip conditions for different test types
skip_integration_not_enabled = pytest.mark.skipif(
    not ENABLE_INTEGRATION_TESTS,
    reason="Integration tests disabled. Set ENABLE_INTEGRATION_TESTS=true to enable.",
)

skip_sap_hana_unavailable = pytest.mark.skipif(
    not SAP_HANA_AVAILABLE,
    reason=f"SAP HANA not available at {SAP_HANA_HOST}:{SAP_HANA_PORT}. Start Docker containers or set SAP_HANA_HOST/PORT.",
)

skip_clickhouse_unavailable = pytest.mark.skipif(
    not CLICKHOUSE_AVAILABLE,
    reason=f"ClickHouse not available at {CLICKHOUSE_HOST}:{CLICKHOUSE_PORT}. Start Docker containers.",
)


def pytest_configure(config):
    """Configure pytest with custom markers and information."""
    config.addinivalue_line(
        "markers",
        "requires_sap_hana: mark test as requiring SAP HANA connection (skipped by default)",
    )
    config.addinivalue_line(
        "markers",
        "requires_clickhouse: mark test as requiring ClickHouse connection (skipped by default)",
    )

    # Print configuration info
    if config.option.verbose >= 1:
        print("\n" + "=" * 70)
        print("SAP HANA CDC Test Configuration")
        print("=" * 70)
        print(f"Integration tests enabled: {ENABLE_INTEGRATION_TESTS}")
        print(f"SAP HANA available: {SAP_HANA_AVAILABLE} ({SAP_HANA_HOST}:{SAP_HANA_PORT})")
        print(f"ClickHouse available: {CLICKHOUSE_AVAILABLE} ({CLICKHOUSE_HOST}:{CLICKHOUSE_PORT})")
        print("=" * 70 + "\n")

        if not ENABLE_INTEGRATION_TESTS:
            print("ℹ️  Integration tests are DISABLED")
            print("   To enable: export ENABLE_INTEGRATION_TESTS=true")
            print("   Or run: ENABLE_INTEGRATION_TESTS=true pytest\n")


@pytest.fixture
def mock_config() -> SAPHanaCDCConfig:
    """Create a mock SAP HANA CDC configuration for testing."""
    return SAPHanaCDCConfig(
        host="localhost",
        port=39015,
        user="SYSTEM",
        password="test_password",
        client_id="test_client",
        tables=["TEST_TABLE1", "TEST_TABLE2"],
        source_schema="SAPHANADB",
        cdc_schema="SAPHANADB",
    )


@pytest.fixture
def sample_config() -> SAPHanaCDCConfig:
    """Create a sample configuration for testing (alias for mock_config)."""
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
def mock_connection() -> MockConnection:
    """Create a mock database connection for testing."""
    return create_mock_connection()


@pytest.fixture
def simple_mock_connection() -> Mock:
    """Create a simple mock database connection using unittest.mock."""
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
def sample_change_events() -> List[ChangeEvent]:
    """Create a list of sample change events."""
    return [
        sample_insert_event(),
        sample_update_event(),
        sample_delete_event(),
    ]


@pytest.fixture
def sample_batch() -> BatchChange:
    """Create a sample batch of changes."""
    return sample_batch_change(num_events=10)


@pytest.fixture
def insert_event() -> ChangeEvent:
    """Create a sample INSERT event."""
    return sample_insert_event()


@pytest.fixture
def update_event() -> ChangeEvent:
    """Create a sample UPDATE event."""
    return sample_update_event()


@pytest.fixture
def delete_event() -> ChangeEvent:
    """Create a sample DELETE event."""
    return sample_delete_event()


@pytest.fixture
def sample_client_status() -> ClientTableStatus:
    """Create a sample client table status for testing."""
    return ClientTableStatus(
        schema_name="TEST_SCHEMA",
        table_name="TABLE1",
        status=TableStatus.ACTIVE,
    )
