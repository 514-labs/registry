"""
Wonderware to ClickHouse Pipeline

Main entry point for Moose framework. Exports all tables, workflows, and APIs
for automatic discovery by the Moose server.
"""

# Data models and OLAP tables
from app.ingest.wonderware_models import (
    WonderwareHistory,
    WonderwareHistoryAggregated,
    WonderwareHistoryTable,
    WonderwareHistoryAggregatedTable,
)
from app.ingest.models import MachineData, MachineDataTable

# APIs
from app.apis import wonderware_status
from app.apis import wonderware_timeseries
from app.apis import wonderware_tags
from app.apis import machine
from app.apis import machine_type
from app.apis import sensor_data
from app.apis import sensor_type

# Workflows
from app.workflows.wonderware_backfill import wonderware_backfill
from app.workflows.wonderware_sync import wonderware_current_sync

__all__ = [
    # Tables
    "WonderwareHistory",
    "WonderwareHistoryAggregated",
    "WonderwareHistoryTable",
    "WonderwareHistoryAggregatedTable",
    "MachineData",
    "MachineDataTable",
    # APIs
    "wonderware_status",
    "wonderware_timeseries",
    "wonderware_tags",
    "machine",
    "machine_type",
    "sensor_data",
    "sensor_type",
    # Workflows
    "wonderware_backfill",
    "wonderware_current_sync",
]
