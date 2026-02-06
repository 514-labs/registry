"""
Wonderware Historian Connector

A high-performance connector for extracting data from AVEVA Wonderware Historian systems.
"""

from .config import WonderwareConfig
from .connector import WonderwareConnector
from .connection_manager import ConnectionPool, CircuitBreaker, CircuitBreakerOpenError
from .reader import WonderwareReader
from .models import TagInfo, HistoryRow, ConnectorStatus

__version__ = "1.0.0"

__all__ = [
    "WonderwareConnector",
    "WonderwareConfig",
    "WonderwareReader",
    "ConnectionPool",
    "CircuitBreaker",
    "CircuitBreakerOpenError",
    "TagInfo",
    "HistoryRow",
    "ConnectorStatus",
]
