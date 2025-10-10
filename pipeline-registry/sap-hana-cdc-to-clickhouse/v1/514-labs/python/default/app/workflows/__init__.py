"""
Workflow definitions for SAP HANA CDC to ClickHouse pipeline.
"""

from .cdc import cdc_workflow
from .prune import prune_workflow

__all__ = [
    "cdc_workflow",
    "prune_workflow"
]
