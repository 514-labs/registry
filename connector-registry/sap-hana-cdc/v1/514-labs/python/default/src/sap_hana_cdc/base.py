
from typing import List
from hdbcli import dbapi

from .config import SAPHanaCDCConfig


class SAPHanaCDCBase:

    CDC_CLIENT_STATUS_TABLE = "CDC_CLIENT_STATUS"
    CDC_CHANGES_TABLE = "CDC_CHANGES"


    def __init__(self, connection: dbapi.Connection, config: SAPHanaCDCConfig):
        self.connection: dbapi.Connection = connection
        self.config: SAPHanaCDCConfig = config
        self.full_client_status_table_name = f"{self.config.cdc_schema}.{self.CDC_CLIENT_STATUS_TABLE}"
        self.full_changes_table_name = f"{self.config.cdc_schema}.{self.CDC_CHANGES_TABLE}"