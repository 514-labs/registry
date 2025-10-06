"""Configuration models for SAP HANA CDC connector."""
import os
from dataclasses import dataclass, field
from typing import List, Optional
from enum import StrEnum


class ChangeType(StrEnum):
    """Types of database changes."""
    INSERT = "INSERT"
    UPDATE = "UPDATE"
    DELETE = "DELETE"
    TRUNCATE = "TRUNCATE"


@dataclass
class SAPHanaConfig:
    """SAP HANA database connection configuration."""
    host: str
    port: int = 30015
    user: str = "SYSTEM"
    password: str = ""
    database: str = "HDB"
    schema: str = "SYSTEM"

    @staticmethod
    def from_env(prefix: str = "SAP_HANA_") -> "SAPHanaConfig":
        return SAPHanaConfig(
            host=os.getenv(f"{prefix}HOST", "localhost"),
            port=os.getenv(f"{prefix}PORT", 30015),
            user=os.getenv(f"{prefix}USERNAME", "SYSTEM"),
            password=os.getenv(f"{prefix}PASSWORD", ""),
            database=os.getenv(f"{prefix}DATABASE", "HDB"),
            schema=os.getenv(f"{prefix}SCHEMA", "SYSTEM"),
        )

    def __str__(self) -> str:
        return (
            f"SAPHanaConfig(\n"
            f"  host={self.host!r},\n"
            f"  port={self.port!r},\n"
            f"  user={self.user!r},\n"
            f"  password='***',\n"
            f"  database={self.database!r},\n"
            f"  schema={self.schema!r}\n"
            f")"
        )


@dataclass
class CDCConfig:
    """CDC configuration."""
    # Client identification
    client_id: str = "default_client"
    
    # Table selection
    tables: List[str] = field(default_factory=lambda: ["*"])
    exclude_tables: List[str] = field(default_factory=list)
    
    # Change table configuration
    change_table_name: str = "CDC_CHANGES"
    change_schema: Optional[str] = None  # If None, uses the same schema as monitored tables
    
    batch_size: int = 1000
    # Change tracking
    change_types: List[ChangeType] = field(
        default_factory=lambda: [ChangeType.INSERT, ChangeType.UPDATE, ChangeType.DELETE]
    )

    def __str__(self) -> str:
        return (
            f"CDCConfig(\n"
            f"  client_id={self.client_id},\n"
            f"  tables={self.tables},\n"
            f"  exclude_tables={self.exclude_tables},\n"
            f"  change_table_name={self.change_table_name!r},\n"
            f"  change_schema={self.change_schema},\n"
            f"  batch_size={self.batch_size},\n"
            f"  change_types={[ct.value for ct in self.change_types]},\n"
            f")"
        )
