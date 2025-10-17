"""
Workflow definitions for SAP HANA CDC to ClickHouse pipeline.
"""

from .lib import BatchChangeInserter

__all__ = [
    "BatchChangeInserter"
]
