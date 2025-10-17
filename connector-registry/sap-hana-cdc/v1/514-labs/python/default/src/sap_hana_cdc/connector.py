"""SAP HANA database extractor for CDC."""

import logging
from hdbcli import dbapi
from typing import List, Optional, Dict, Set, Any, Callable
from datetime import datetime

from .config import SAPHanaCDCConfig
from .models import BatchChange, PruneResult, TableStatus
from .infrastructure import SAPHanaCDCInfrastructure
from .reader import SAPHanaCDCReader


logger = logging.getLogger(__name__)


class SAPHanaCDCConnector:
    """High-level interface for SAP HANA CDC operations.
    
    This class orchestrates the infrastructure setup and data reading operations,
    providing a unified API for CDC functionality.
    """
    def __init__(self, infrastructure: SAPHanaCDCInfrastructure, reader: SAPHanaCDCReader, config: SAPHanaCDCConfig):
        self.infrastructure = infrastructure
        self.reader = reader
        self.config = config
        
    @staticmethod
    def build_from_env() -> 'SAPHanaCDCConnector':
        sap_config = SAPHanaCDCConfig.from_env(prefix="SAP_HANA_")
        return SAPHanaCDCConnector.build_from_config(sap_config)

    @staticmethod
    def build_from_config(config: SAPHanaCDCConfig) -> 'SAPHanaCDCConnector':
        
        connection = dbapi.connect(
            address=config.host,
            port=config.port,
            user=config.user,
            password=config.password
        )
        infrastructure = SAPHanaCDCInfrastructure(connection, config)
        reader = SAPHanaCDCReader(connection, config)
        return SAPHanaCDCConnector(infrastructure, reader, config)
  
    @property
    def connection(self) -> dbapi.Connection:
        return self.reader.connection

    def init_cdc(self) -> None:
        """Initialize CDC infrastructure and setup data reader.
        
        This method should be called with elevated privileges to set up the
        CDC infrastructure (tables and triggers).
        """
        # Setup infrastructure (requires elevated privileges)
        self.infrastructure.setup_cdc_infrastructure()
        
        logger.info("CDC initialization completed")
    
    def get_changes(self, limit: int = 1000) -> BatchChange:
        """Get changes from the CDC system.
        
        This method requires regular database privileges and can be called
        multiple times to process changes incrementally.
        """
        return self.reader.get_changes(limit)
    
    def update_client_status(self, batch: BatchChange) -> None:
        """Update client processing status.
        
        This method requires regular database privileges.
        """
        self.reader.update_client_status(batch)
    
    def get_current_monitored_tables(self) -> Dict[str, Set[str]]:
        """Get currently monitored tables and their enabled change types.
        
        This method requires regular database privileges.
        """
        return self.reader.get_current_monitored_tables()
    
    def get_all_table_rows(self, table_name: str, page_size: int = 1000):
        """Get all rows from a given table with transparent pagination.
        
        This method requires regular database privileges.
        
        Args:
            table_name: Name of the table to read from
            page_size: Number of rows to fetch per page (default: 1000)
            
        Yields:
            Dict[str, Any]: Dictionary representing a single row with column names as keys
        """
        return self.reader.get_all_table_rows(table_name, page_size)
    
    def get_client_status(self) -> List[tuple[str, str, str]]:
        return self.reader.get_client_status()
    
    def cleanup_cdc_infrastructure(self) -> None:
        """Remove all CDC infrastructure.
        
        This method requires elevated privileges and should be used with caution.
        """
        self.infrastructure.cleanup_cdc_infrastructure()
        logger.info("CDC infrastructure cleanup completed")
    
    def get_status(self, client_id: str) -> Dict[str, Any]:
        """Get CDC status for a specific client.
        
        Args:
            client_id: The client ID to get status for
            
        Returns:
            Dict containing:
            - total_entries: Total number of entries in the CDC change table
            - lag_seconds: Lag in seconds (max insert timestamp - last client update)
        """
        return self.reader.get_status(client_id)
    
    def prune(self, older_than_days: int = 7) -> PruneResult:
        """Prune old entries from the CDC change table.
        
        Args:
            older_than_days: Number of days to keep (entries older than this will be deleted)
            
        Returns:
            PruneResult containing:
            - entries_deleted: Number of entries deleted
            - cutoff_timestamp: The timestamp used as the cutoff (ISO format)
        """
        return self.reader.prune(older_than_days)
    
    