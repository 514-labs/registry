"""Configuration for Wonderware connector."""
import os
from dataclasses import dataclass
from typing import Optional


@dataclass
class WonderwareConfig:
    """Configuration for Wonderware Historian connection."""

    # SQL Server connection (required)
    host: str

    # SQL Server connection (optional)
    port: int = 1433
    database: str = "Runtime"
    username: Optional[str] = None
    password: Optional[str] = None
    driver: str = "mssql+pytds"

    @staticmethod
    def from_env(prefix: str = "WONDERWARE_") -> "WonderwareConfig":
        """
        Load configuration from environment variables.

        Args:
            prefix: Environment variable prefix (default: "WONDERWARE_")

        Returns:
            WonderwareConfig instance

        Raises:
            ValueError: If required host is not set
        """
        host = os.getenv(f"{prefix}HOST")
        if not host:
            raise ValueError(f"{prefix}HOST environment variable is required")

        return WonderwareConfig(
            host=host,
            port=int(os.getenv(f"{prefix}PORT", "1433")),
            database=os.getenv(f"{prefix}DATABASE", "Runtime"),
            username=os.getenv(f"{prefix}USERNAME"),
            password=os.getenv(f"{prefix}PASSWORD"),
            driver=os.getenv(f"{prefix}DRIVER", "mssql+pytds"),
        )

    def get_connection_string(self) -> str:
        """
        Build SQLAlchemy connection string.

        Returns:
            Connection string for SQLAlchemy
        """
        auth = f"{self.username}:{self.password}@" if self.username and self.password else ""
        return f"{self.driver}://{auth}{self.host}:{self.port}/{self.database}"
