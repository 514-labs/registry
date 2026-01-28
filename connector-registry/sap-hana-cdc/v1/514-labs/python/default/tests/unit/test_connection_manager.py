"""Unit tests for connection manager with circuit breaker."""
import pytest
import time
from unittest.mock import Mock, patch, MagicMock
from hdbcli import dbapi

from sap_hana_cdc.connection_manager import (
    ConnectionPool,
    CircuitBreaker,
    CircuitState,
    CircuitBreakerOpenError,
)
from sap_hana_cdc import SAPHanaCDCConfig


@pytest.mark.unit
class TestCircuitBreaker:
    """Test CircuitBreaker functionality."""

    def test_circuit_breaker_starts_closed(self):
        """Test circuit breaker starts in CLOSED state."""
        cb = CircuitBreaker(failure_threshold=3, timeout_seconds=5)
        assert cb.state == CircuitState.CLOSED
        assert cb.failure_count == 0

    def test_circuit_breaker_opens_after_threshold(self):
        """Test circuit breaker opens after reaching failure threshold."""
        cb = CircuitBreaker(failure_threshold=3, timeout_seconds=5)

        def failing_func():
            raise Exception("Simulated failure")

        # First 2 failures should not open circuit
        for _ in range(2):
            with pytest.raises(Exception):
                cb.call(failing_func)
            assert cb.state == CircuitState.CLOSED

        # Third failure should open circuit
        with pytest.raises(Exception):
            cb.call(failing_func)
        assert cb.state == CircuitState.OPEN

    def test_circuit_breaker_rejects_when_open(self):
        """Test circuit breaker rejects calls when open."""
        cb = CircuitBreaker(failure_threshold=1, timeout_seconds=5)

        def failing_func():
            raise Exception("Failure")

        # Trigger failure to open circuit
        with pytest.raises(Exception):
            cb.call(failing_func)

        # Next call should be rejected immediately
        with pytest.raises(CircuitBreakerOpenError):
            cb.call(failing_func)

    def test_circuit_breaker_half_open_after_timeout(self):
        """Test circuit breaker enters half-open state after timeout."""
        cb = CircuitBreaker(failure_threshold=1, timeout_seconds=0.1)

        def failing_func():
            raise Exception("Failure")

        # Open the circuit
        with pytest.raises(Exception):
            cb.call(failing_func)
        assert cb.state == CircuitState.OPEN

        # Wait for timeout
        time.sleep(0.2)

        # Next call should enter half-open state
        # We'll use a successful call to test this
        def success_func():
            return "success"

        result = cb.call(success_func)
        assert result == "success"
        assert cb.state == CircuitState.CLOSED

    def test_circuit_breaker_closes_on_success(self):
        """Test circuit breaker closes after successful half-open call."""
        cb = CircuitBreaker(failure_threshold=2, timeout_seconds=0.1)

        def failing_func():
            raise Exception("Failure")

        # Trigger failures to open circuit
        for _ in range(2):
            with pytest.raises(Exception):
                cb.call(failing_func)
        assert cb.state == CircuitState.OPEN

        # Wait for timeout
        time.sleep(0.2)

        # Successful call should close circuit
        def success_func():
            return "success"

        result = cb.call(success_func)
        assert result == "success"
        assert cb.state == CircuitState.CLOSED
        assert cb.failure_count == 0

    def test_circuit_breaker_resets_failure_count_on_success(self):
        """Test circuit breaker resets failure count on success."""
        cb = CircuitBreaker(failure_threshold=3, timeout_seconds=5)

        def failing_func():
            raise Exception("Failure")

        def success_func():
            return "success"

        # One failure
        with pytest.raises(Exception):
            cb.call(failing_func)
        assert cb.failure_count == 1

        # Success resets count
        cb.call(success_func)
        assert cb.failure_count == 0
        assert cb.state == CircuitState.CLOSED


@pytest.mark.unit
class TestConnectionPool:
    """Test ConnectionPool functionality."""

    def test_connection_pool_creates_connection(self, mock_config):
        """Test connection pool can create a connection."""
        with patch("sap_hana_cdc.connection_manager.dbapi.connect") as mock_connect:
            mock_conn = Mock()
            mock_cursor = Mock()
            mock_cursor.fetchone.return_value = (1,)
            mock_conn.cursor.return_value = mock_cursor
            mock_connect.return_value = mock_conn

            pool = ConnectionPool(mock_config)
            conn = pool.get_connection()

            assert conn is not None
            mock_connect.assert_called_once_with(
                address=mock_config.host,
                port=mock_config.port,
                user=mock_config.user,
                password=mock_config.password,
            )

    def test_connection_pool_reuses_connection(self, mock_config):
        """Test connection pool reuses existing valid connection."""
        with patch("sap_hana_cdc.connection_manager.dbapi.connect") as mock_connect:
            mock_conn = Mock()
            mock_cursor = Mock()
            mock_cursor.fetchone.return_value = (1,)
            mock_conn.cursor.return_value = mock_cursor
            mock_connect.return_value = mock_conn

            pool = ConnectionPool(mock_config)
            conn1 = pool.get_connection()
            conn2 = pool.get_connection()

            # Should reuse same connection
            assert conn1 is conn2
            # Should only connect once
            assert mock_connect.call_count == 1

    def test_connection_pool_retries_on_failure(self, mock_config):
        """Test connection pool retries on connection failure."""
        with patch("sap_hana_cdc.connection_manager.dbapi.connect") as mock_connect:
            # First two calls fail, third succeeds
            mock_conn = Mock()
            mock_cursor = Mock()
            mock_cursor.fetchone.return_value = (1,)
            mock_conn.cursor.return_value = mock_cursor

            mock_connect.side_effect = [
                dbapi.Error("Connection failed"),
                dbapi.Error("Connection failed"),
                mock_conn,
            ]

            pool = ConnectionPool(mock_config, max_retries=3)
            conn = pool.get_connection()

            assert conn is not None
            assert mock_connect.call_count == 3

    def test_connection_pool_respects_circuit_breaker(self, mock_config):
        """Test connection pool respects circuit breaker."""
        with patch("sap_hana_cdc.connection_manager.dbapi.connect") as mock_connect:
            mock_connect.side_effect = dbapi.Error("Connection failed")

            cb = CircuitBreaker(failure_threshold=2, timeout_seconds=5)
            pool = ConnectionPool(mock_config, circuit_breaker=cb)

            # First two attempts should fail and open circuit
            for _ in range(2):
                with pytest.raises(Exception):
                    pool.get_connection()

            # Circuit should be open now
            with pytest.raises(CircuitBreakerOpenError):
                pool.get_connection()

    def test_connection_pool_validates_connection(self, mock_config):
        """Test connection pool validates existing connection."""
        with patch("sap_hana_cdc.connection_manager.dbapi.connect") as mock_connect:
            mock_conn = Mock()
            mock_cursor = Mock()

            # First call: valid connection
            mock_cursor.fetchone.return_value = (1,)
            mock_conn.cursor.return_value = mock_cursor
            mock_connect.return_value = mock_conn

            pool = ConnectionPool(mock_config)
            conn1 = pool.get_connection()
            assert conn1 is not None

            # Second call: connection invalid, should recreate
            mock_cursor.fetchone.side_effect = Exception("Connection lost")
            mock_conn2 = Mock()
            mock_cursor2 = Mock()
            mock_cursor2.fetchone.return_value = (1,)
            mock_conn2.cursor.return_value = mock_cursor2
            mock_connect.return_value = mock_conn2

            conn2 = pool.get_connection()
            assert conn2 is mock_conn2
            assert mock_connect.call_count == 2

    def test_connection_pool_context_manager(self, mock_config):
        """Test connection pool works as context manager."""
        with patch("sap_hana_cdc.connection_manager.dbapi.connect") as mock_connect:
            mock_conn = Mock()
            mock_cursor = Mock()
            mock_cursor.fetchone.return_value = (1,)
            mock_conn.cursor.return_value = mock_cursor
            mock_connect.return_value = mock_conn

            with ConnectionPool(mock_config) as pool:
                conn = pool.get_connection()
                assert conn is not None

            # Connection should be closed after context exit
            mock_conn.close.assert_called_once()

    def test_connection_pool_get_connection_context(self, mock_config):
        """Test get_connection_context context manager."""
        with patch("sap_hana_cdc.connection_manager.dbapi.connect") as mock_connect:
            mock_conn = Mock()
            mock_cursor = Mock()
            mock_cursor.fetchone.return_value = (1,)
            mock_conn.cursor.return_value = mock_cursor
            mock_connect.return_value = mock_conn

            pool = ConnectionPool(mock_config)
            with pool.get_connection_context() as conn:
                assert conn is not None

            # Connection should not be closed (reused by pool)
            mock_conn.close.assert_not_called()

    def test_connection_pool_context_rollback_on_error(self, mock_config):
        """Test connection pool rolls back on error in context."""
        with patch("sap_hana_cdc.connection_manager.dbapi.connect") as mock_connect:
            mock_conn = Mock()
            mock_cursor = Mock()
            mock_cursor.fetchone.return_value = (1,)
            mock_conn.cursor.return_value = mock_cursor
            mock_connect.return_value = mock_conn

            pool = ConnectionPool(mock_config)

            with pytest.raises(ValueError):
                with pool.get_connection_context() as conn:
                    raise ValueError("Test error")

            # Rollback should be called
            mock_conn.rollback.assert_called_once()
