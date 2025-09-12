"""SAP HANA Change Data Capture (CDC) Connector.

A high-performance, real-time CDC connector for SAP HANA database.
"""

__version__ = "0.1.0"

from .connector import SAPHanaCDCConnector
from .config import CDCConfig, SAPHanaConfig
from .models import ChangeEvent, ChangeType, TableChange
from .streamer import BaseStreamer

__all__ = [
    "SAPHanaCDCConnector",
    "CDCConfig", 
    "SAPHanaConfig",
    "ChangeEvent",
    "ChangeType", 
    "TableChange",
    "BaseStreamer",
]
