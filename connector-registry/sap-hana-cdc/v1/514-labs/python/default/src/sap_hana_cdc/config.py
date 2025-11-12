"""Configuration models for SAP HANA CDC connector."""
import os
from dataclasses import dataclass, field
from typing import List

@dataclass
class SAPHanaCDCConfig:
    """SAP HANA database connection configuration."""
    host: str
    port: int = 30015
    user: str = "SYSTEM"
    password: str = ""

    client_id: str = "default_client"
    tables: List[str] = field(default_factory=lambda: [])
    source_schema: str = "SAPHANADB"
    cdc_schema: str = "SAPHANADB"

    def __post_init__(self):
        # Trim all values of tables and remove empties
        if self.tables:
            self.tables = [t.strip() for t in self.tables if t.strip()]


    @staticmethod
    def from_env(prefix: str = "SAP_HANA_") -> "SAPHanaCDCConfig":
        return SAPHanaCDCConfig(
            host=os.getenv(f"{prefix}HOST", "localhost"),
            port=os.getenv(f"{prefix}PORT", 30015),
            user=os.getenv(f"{prefix}USERNAME", "SYSTEM"),
            password=os.getenv(f"{prefix}PASSWORD", ""),
            client_id=os.getenv(f"{prefix}CLIENT_ID", "default_client"),
            tables=os.getenv(f"{prefix}TABLES", "").split(","),
            source_schema=os.getenv(f"{prefix}SOURCE_SCHEMA", "SAPHANADB"),
            cdc_schema=os.getenv(f"{prefix}CDC_SCHEMA", "SAPHANADB"),
        )

    def __str__(self) -> str:
        return (
            f"SAPHanaConfig(\n"
            f"  host={self.host!r},\n"
            f"  port={self.port!r},\n"
            f"  user={self.user!r},\n"
            f"  password='***',\n"
            f"  client_id={self.client_id!r},\n"
            f"  tables={self.tables!r},\n"
            f"  source_schema={self.source_schema!r},\n"
            f"  cdc_schema={self.cdc_schema!r},\n"
            f")"
        )