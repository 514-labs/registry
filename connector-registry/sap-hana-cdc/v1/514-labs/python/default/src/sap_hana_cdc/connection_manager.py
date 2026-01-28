"""Connection management with resilience features for SAP HANA."""
import logging
import time
from contextlib import contextmanager
from enum import Enum
from typing import Optional

from hdbcli import dbapi
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)

from .config import SAPHanaCDCConfig

logger = logging.getLogger(__name__)


class CircuitState(Enum):
    """Circuit breaker states."""
    CLOSED = "closed"      # Normal operation
    OPEN = "open"          # Failing, reject requests
    HALF_OPEN = "half_open"  # Testing recovery


class CircuitBreaker:
    """
    Circuit breaker pattern to prevent cascading failures.

    Opens after failure_threshold consecutive failures.
    After timeout_seconds, enters half-open state to test recovery.
    """

    def __init__(
        self,
        failure_threshold: int = 5,
        timeout_seconds: int = 60,
    ):
        self.failure_threshold = failure_threshold
        self.timeout_seconds = timeout_seconds
        self.failure_count = 0
        self.last_failure_time: Optional[float] = None
        self.state = CircuitState.CLOSED

    def call(self, func, *args, **kwargs):
        """Execute function with circuit breaker protection."""
        if self.state == CircuitState.OPEN:
            if self._should_attempt_reset():
                logger.info("Circuit breaker entering half-open state")
                self.state = CircuitState.HALF_OPEN
            else:
                raise CircuitBreakerOpenError(
                    f"Circuit breaker is open. Last failure: {self.last_failure_time}"
                )

        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise e

    def _should_attempt_reset(self) -> bool:
        """Check if enough time has passed to attempt recovery."""
        if self.last_failure_time is None:
            return True
        return time.time() - self.last_failure_time >= self.timeout_seconds

    def _on_success(self):
        """Reset circuit breaker on successful call."""
        if self.state == CircuitState.HALF_OPEN:
            logger.info("Circuit breaker closing after successful recovery")
        self.failure_count = 0
        self.state = CircuitState.CLOSED
        self.last_failure_time = None

    def _on_failure(self):
        """Record failure and potentially open circuit."""
        self.failure_count += 1
        self.last_failure_time = time.time()

        if self.state == CircuitState.HALF_OPEN:
            logger.warning("Circuit breaker re-opening after failed recovery attempt")
            self.state = CircuitState.OPEN
        elif self.failure_count >= self.failure_threshold:
            logger.warning(
                f"Circuit breaker opening after {self.failure_count} failures"
            )
            self.state = CircuitState.OPEN


class CircuitBreakerOpenError(Exception):
    """Raised when circuit breaker is open and rejecting calls."""
    pass


class ConnectionPool:
    """
    Connection pool with retry logic and circuit breaker.

    Features:
    - Automatic retry with exponential backoff
    - Circuit breaker to prevent cascading failures
    - Connection validation
    """

    def __init__(
        self,
        config: SAPHanaCDCConfig,
        circuit_breaker: Optional[CircuitBreaker] = None,
    ):
        self.config = config
        self.circuit_breaker = circuit_breaker or CircuitBreaker()
        self._connection: Optional[dbapi.Connection] = None

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=10),
        retry=retry_if_exception_type((dbapi.Error, OSError)),
        reraise=True,
    )
    def _create_connection(self) -> dbapi.Connection:
        """Create a new database connection with retry logic."""
        logger.info(
            f"Connecting to SAP HANA at {self.config.host}:{self.config.port}"
        )

        try:
            connection = dbapi.connect(
                address=self.config.host,
                port=self.config.port,
                user=self.config.user,
                password=self.config.password,
            )
            logger.info("Successfully connected to SAP HANA")
            return connection
        except Exception as e:
            logger.error(f"Failed to connect to SAP HANA: {e}")
            raise

    def get_connection(self) -> dbapi.Connection:
        """
        Get a database connection with circuit breaker protection.

        Returns:
            Active database connection

        Raises:
            CircuitBreakerOpenError: If circuit breaker is open
            dbapi.Error: If connection fails after retry attempts
            OSError: If network-level connection fails after retry attempts
        """
        if self._connection is not None:
            try:
                # Validate existing connection
                if self._is_connection_valid(self._connection):
                    return self._connection
                else:
                    logger.warning("Existing connection invalid, creating new one")
                    try:
                        self._connection.close()
                    except Exception:
                        pass  # Best effort close
                    self._connection = None
            except Exception as e:
                logger.warning(f"Connection validation failed: {e}")
                try:
                    self._connection.close()
                except Exception:
                    pass  # Best effort close
                self._connection = None

        # Create new connection with circuit breaker protection
        try:
            self._connection = self.circuit_breaker.call(self._create_connection)
            return self._connection
        except CircuitBreakerOpenError:
            logger.error("Cannot get connection: circuit breaker is open")
            raise

    def _is_connection_valid(self, connection: dbapi.Connection) -> bool:
        """Check if connection is still valid."""
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT 1 FROM DUMMY")
            cursor.fetchone()
            cursor.close()
            return True
        except Exception:
            return False

    @contextmanager
    def get_connection_context(self):
        """
        Context manager for safe connection handling.

        Usage:
            with pool.get_connection_context() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM table")
        """
        conn = self.get_connection()
        try:
            yield conn
        except Exception as e:
            logger.error(f"Error during connection context: {e}")
            try:
                conn.rollback()
            except Exception:
                pass
            raise
        finally:
            # Connection is reused, so we don't close it here
            pass

    def close(self):
        """Close the connection pool."""
        if self._connection is not None:
            try:
                self._connection.close()
                logger.info("Connection closed")
            except Exception as e:
                logger.warning(f"Error closing connection: {e}")
            finally:
                self._connection = None

    def __enter__(self):
        """Support context manager protocol."""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Close connection on context exit."""
        self.close()
        return False
