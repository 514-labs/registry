"""Connection management with resilience features for Wonderware."""
import logging
import time
from enum import Enum
from typing import Optional

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)

from .config import WonderwareConfig

logger = logging.getLogger(__name__)


class CircuitState(Enum):
    """Circuit breaker states."""
    CLOSED = "closed"        # Normal operation
    OPEN = "open"            # Failing, reject requests
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
        config: WonderwareConfig,
        circuit_breaker: Optional[CircuitBreaker] = None,
    ):
        self.config = config
        self.circuit_breaker = circuit_breaker or CircuitBreaker()
        self._engine: Optional[Engine] = None

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=10),
        retry=retry_if_exception_type((Exception,)),
        reraise=True,
    )
    def _create_engine(self) -> Engine:
        """Create a new SQLAlchemy engine with retry logic."""
        logger.info(
            f"Creating engine for Wonderware at {self.config.host}:{self.config.port}"
        )

        try:
            engine = create_engine(self.config.get_connection_string())
            # Test connection
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("Successfully connected to Wonderware")
            return engine
        except Exception as e:
            logger.error(f"Failed to connect to Wonderware: {e}")
            raise

    def get_engine(self) -> Engine:
        """
        Get a database engine with circuit breaker protection.

        Returns:
            Active SQLAlchemy engine

        Raises:
            CircuitBreakerOpenError: If circuit breaker is open
            Exception: If connection fails after retry attempts
        """
        if self._engine is not None:
            try:
                # Validate existing engine
                if self._is_engine_valid(self._engine):
                    return self._engine
                else:
                    logger.warning("Existing engine invalid, creating new one")
                    try:
                        self._engine.dispose()
                    except Exception:
                        pass  # Best effort cleanup
                    self._engine = None
            except Exception as e:
                logger.warning(f"Engine validation failed: {e}")
                try:
                    self._engine.dispose()
                except Exception:
                    pass  # Best effort cleanup
                self._engine = None

        # Create new engine with circuit breaker protection
        try:
            self._engine = self.circuit_breaker.call(self._create_engine)
            return self._engine
        except CircuitBreakerOpenError:
            logger.error("Cannot get engine: circuit breaker is open")
            raise

    def _is_engine_valid(self, engine: Engine) -> bool:
        """Check if engine is still valid."""
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return True
        except Exception:
            return False

    def close(self):
        """Close the connection pool."""
        if self._engine is not None:
            try:
                self._engine.dispose()
                logger.info("Engine disposed")
            except Exception as e:
                logger.warning(f"Error disposing engine: {e}")
            finally:
                self._engine = None

    def __enter__(self):
        """Support context manager protocol."""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Close connection on context exit."""
        self.close()
        return False
