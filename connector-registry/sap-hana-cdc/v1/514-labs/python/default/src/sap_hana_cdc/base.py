
from typing import List
from hdbcli import dbapi

from .config import SAPHanaCDCConfig


class SAPHanaCDCBase:

    CDC_CLIENT_CHANGES_STATUS_TABLE = "CDC_CLIENT_CHANGES_STATUS"
    CDC_TABLE_CHANGES_STATUS_TABLE = "CDC_TABLE_CHANGES_STATUS"
    CDC_CHANGES_TABLE = "CDC_CHANGES"


    def __init__(self, connection: dbapi.Connection, config: SAPHanaCDCConfig):
        self.connection: dbapi.Connection = connection
        self.config: SAPHanaCDCConfig = config
        
    def _get_change_table_name(self) -> str:
        return f"{self.config.cdc_schema}.{self.CDC_CHANGES_TABLE}"
    
    def _get_client_status_table_name(self) -> str:
        return f"{self.config.cdc_schema}.{self.CDC_CLIENT_CHANGES_STATUS_TABLE}"
    
    def _get_table_status_table_name(self) -> str:
        return f"{self.config.cdc_schema}.{self.CDC_TABLE_CHANGES_STATUS_TABLE}"
    