"""SAP HANA Change Data Capture (CDC) Connector.

A high-performance, real-time CDC connector for SAP HANA database.
"""

__version__ = "0.1.0"

from .connector import SAPHanaCDCConnector
from .infrastructure import SAPHanaCDCInfrastructure
from .reader import SAPHanaCDCReader
from .config import SAPHanaCDCConfig
from .models import ChangeEvent, BatchChange, PruneResult

__all__ = [
    "SAPHanaCDCConnector",
    "SAPHanaCDCInfrastructure",
    "SAPHanaCDCReader",
    "SAPHanaCDCConfig",
    "ChangeEvent",
    "BatchChange",
    "PruneResult",
]
