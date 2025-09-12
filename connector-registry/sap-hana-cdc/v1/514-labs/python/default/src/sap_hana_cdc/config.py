"""Configuration models for SAP HANA CDC connector."""

from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from enum import Enum


class ChangeType(Enum):
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
    ssl: bool = False
    connection_timeout: int = 30
    max_connections: int = 10


@dataclass
class CDCConfig:
    """CDC pipeline configuration."""
    # Table selection
    tables: List[str] = field(default_factory=lambda: ["*"])
    exclude_tables: List[str] = field(default_factory=list)
    
    # Change table configuration
    change_table_name: str = "CDC_CHANGES"
    change_schema: Optional[str] = None  # If None, uses the same schema as monitored tables
    
    # Polling configuration
    poll_interval_ms: int = 5000
    batch_size: int = 1000
    max_poll_records: int = 10000
    
    # Change tracking
    change_types: List[ChangeType] = field(
        default_factory=lambda: [ChangeType.INSERT, ChangeType.UPDATE, ChangeType.DELETE]
    )
    
    # Performance tuning
    parallel_workers: int = 4
    buffer_size: int = 10000
    
    # Error handling
    max_retries: int = 3
    retry_delay_ms: int = 1000
    dead_letter_topic: Optional[str] = None
    
    # Monitoring
    enable_metrics: bool = True
    metrics_port: int = 8080
    
    # Logging
    log_level: str = "INFO"
    log_format: str = "json"


@dataclass
class PipelineConfig:
    """Complete pipeline configuration."""
    sap_hana: SAPHanaConfig
    cdc: CDCConfig
    
    # Pipeline metadata
    pipeline_id: str = "sap-hana-cdc"
    version: str = "1.0.0"
    
    # Scheduling
    cron: Optional[str] = None
    timezone: str = "UTC"
    
    # Additional metadata
    metadata: Dict[str, Any] = field(default_factory=dict)
