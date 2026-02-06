"""High-level facade for Wonderware connector."""
import logging
from datetime import datetime
from typing import List, Dict, Optional

from .config import WonderwareConfig
from .connection_manager import ConnectionPool, CircuitBreaker
from .reader import WonderwareReader
from .models import ConnectorStatus

logger = logging.getLogger(__name__)


class WonderwareConnector:
    """
    High-level connector for AVEVA Wonderware Historian.

    This facade provides a simple interface for:
    - Discovering tags
    - Fetching historical data
    - Managing connections
    - Checking system status
    """

    def __init__(
        self,
        config: WonderwareConfig,
        connection_pool: Optional[ConnectionPool] = None,
    ):
        """
        Initialize Wonderware connector.

        Args:
            config: WonderwareConfig instance
            connection_pool: Optional ConnectionPool (created if not provided)
        """
        self.config = config
        self.connection_pool = connection_pool or ConnectionPool(config)
        self.reader: Optional[WonderwareReader] = None

    @staticmethod
    def build_from_env(prefix: str = "WONDERWARE_") -> "WonderwareConnector":
        """
        Build connector from environment variables.

        Args:
            prefix: Environment variable prefix (default: "WONDERWARE_")

        Returns:
            WonderwareConnector instance

        Raises:
            ValueError: If required environment variables are missing
        """
        config = WonderwareConfig.from_env(prefix)
        return WonderwareConnector(config)

    @staticmethod
    def build_from_config(config: WonderwareConfig) -> "WonderwareConnector":
        """
        Build connector from config object.

        Args:
            config: WonderwareConfig instance

        Returns:
            WonderwareConnector instance
        """
        return WonderwareConnector(config)

    def _ensure_reader(self):
        """Ensure reader is initialized with a valid engine."""
        if self.reader is None:
            engine = self.connection_pool.get_engine()
            self.reader = WonderwareReader(engine)

    def refresh_connection(self):
        """
        Refresh the database connection.

        Useful after connection errors or to reset the connection pool.
        """
        logger.info("Refreshing connection")
        self.connection_pool.close()
        self.reader = None
        self._ensure_reader()

    def discover_tags(self) -> List[str]:
        """
        Discover all active tags from Wonderware TagRef table.

        Returns:
            List of tag names (excludes System tags starting with 'Sys')

        Raises:
            Exception: If query fails
        """
        self._ensure_reader()
        return self.reader.discover_tags()

    def fetch_history_data(
        self,
        tag_names: List[str],
        date_from: str,
        date_to: str,
        inclusive_start: bool = True
    ) -> List[Dict]:
        """
        Fetch historical data from Wonderware History view.

        Args:
            tag_names: List of tag names to query
            date_from: Start datetime (ISO format)
            date_to: End datetime (ISO format)
            inclusive_start: If True, use BETWEEN (>=). If False, use > (exclusive start)

        Returns:
            List of row dictionaries with all history fields

        Raises:
            Exception: If query fails
        """
        self._ensure_reader()
        return self.reader.fetch_history_data(
            tag_names=tag_names,
            date_from=date_from,
            date_to=date_to,
            inclusive_start=inclusive_start
        )

    def get_tag_count(self) -> int:
        """
        Get count of active tags.

        Returns:
            Number of active tags (excluding System tags)

        Raises:
            Exception: If query fails
        """
        self._ensure_reader()
        return self.reader.get_tag_count()

    def test_connection(self) -> bool:
        """
        Test if connection to Wonderware is working.

        Returns:
            True if connection is valid, False otherwise
        """
        try:
            self._ensure_reader()
            return self.reader.test_connection()
        except Exception as e:
            logger.error(f"Connection test failed: {e}")
            return False

    def get_status(self) -> ConnectorStatus:
        """
        Get current connector status.

        Returns:
            ConnectorStatus with connection info and health
        """
        try:
            connected = self.test_connection()
            tag_count = self.get_tag_count() if connected else None
            error = None
        except Exception as e:
            connected = False
            tag_count = None
            error = str(e)

        return ConnectorStatus(
            connected=connected,
            host=self.config.host,
            database=self.config.database,
            tag_count=tag_count,
            last_check=datetime.now(),
            error=error
        )

    def close(self):
        """Close all connections and cleanup resources."""
        logger.info("Closing Wonderware connector")
        self.connection_pool.close()
        self.reader = None

    def __enter__(self):
        """Support context manager protocol."""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Close connections on context exit."""
        self.close()
        return False
